import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Loader, LoaderContext } from 'astro/loaders';
import exifr from 'exifr';
import sharp from 'sharp';
import { parse as parseYaml } from 'yaml';

const PHOTO_PATTERN = /\.jpe?g$/i;
const COVER_FILE = 'cover.jpg';

/**
 * EXIF tags worth the read. `exifr` will only decode what is picked, which keeps
 * a full 174-photo scan down to a couple of seconds.
 */
const EXIF_TAGS = [
  'ISO',
  'FNumber',
  'ExposureTime',
  'FocalLength',
  'LensModel',
  'Model',
  'DateTimeOriginal',
] as const;

export interface PhotoExif {
  iso?: number;
  fNumber?: number;
  exposureTime?: number;
  focalLength?: number;
  lens?: string;
  camera?: string;
  capturedAt?: Date;
}

export interface Photo {
  file: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  orientation: 'portrait' | 'landscape';
  thumbPosition: string;
  exif: PhotoExif;
}

export interface Album {
  slug: string;
  title: string;
  description?: string;
  order?: number;
  cover: string;
  photos: Photo[];
}

/** Shape of the optional `album.yaml` sidecar. Every field is optional. */
interface AlbumSidecar {
  title?: string;
  description?: string;
  order?: number;
  cover?: string;
  photos?: Record<string, { alt?: string; thumbPosition?: string }>;
}

/** `three-peaks` → `Three Peaks`. Used when a sidecar omits the title. */
function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Photos are named `001.jpg`, `002.jpg`, … so a plain lexicographic sort is
 * already correct. Compare numerically anyway so an album dropped in with
 * unpadded names (`1.jpg`, `10.jpg`, `2.jpg`) still orders sensibly.
 */
function comparePhotoNames(a: string, b: string): number {
  const numA = Number(a.match(/\d+/)?.[0] ?? NaN);
  const numB = Number(b.match(/\d+/)?.[0] ?? NaN);
  if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) return numA - numB;
  return a.localeCompare(b);
}

function readSidecar(dir: string): AlbumSidecar {
  const path = join(dir, 'album.yaml');
  if (!existsSync(path)) return {};

  const parsed = parseYaml(readFileSync(path, 'utf8'));
  if (parsed === null || parsed === undefined) return {};
  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`${path}: expected a YAML mapping at the top level`);
  }
  return parsed as AlbumSidecar;
}

/**
 * Astro's image pipeline re-encodes every photo and drops its EXIF along the
 * way, so capture settings have to be harvested here — from the untouched
 * source file — and carried through the content layer instead.
 */
async function readExif(path: string): Promise<PhotoExif> {
  try {
    const raw = await exifr.parse(path, { pick: [...EXIF_TAGS] });
    if (!raw) return {};

    return {
      iso: typeof raw.ISO === 'number' ? raw.ISO : undefined,
      fNumber: typeof raw.FNumber === 'number' ? raw.FNumber : undefined,
      exposureTime: typeof raw.ExposureTime === 'number' ? raw.ExposureTime : undefined,
      focalLength: typeof raw.FocalLength === 'number' ? raw.FocalLength : undefined,
      lens: typeof raw.LensModel === 'string' ? raw.LensModel : undefined,
      camera: typeof raw.Model === 'string' ? raw.Model : undefined,
      capturedAt: raw.DateTimeOriginal instanceof Date ? raw.DateTimeOriginal : undefined,
    };
  } catch {
    // A photo without readable EXIF is fine — the caption just renders less.
    return {};
  }
}

async function buildPhoto(
  dir: string,
  slug: string,
  file: string,
  index: number,
  albumTitle: string,
  sidecar: AlbumSidecar,
): Promise<Photo> {
  const path = join(dir, file);
  const overrides = sidecar.photos?.[file] ?? {};

  const [metadata, exif] = await Promise.all([sharp(path).metadata(), readExif(path)]);

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;
  if (!width || !height) throw new Error(`Could not read dimensions of ${path}`);

  return {
    file,
    // Matches the keys produced by `import.meta.glob` in the album page.
    src: `/src/assets/photos/${slug}/${file}`,
    // Placeholder alt text. Better than a filename for a screen reader, and
    // overridable per photo in album.yaml.
    alt: overrides.alt ?? `${albumTitle} — photo ${index + 1}`,
    width,
    height,
    orientation: height > width ? 'portrait' : 'landscape',
    thumbPosition: overrides.thumbPosition ?? 'center',
    exif,
  };
}

/**
 * Cheap change detection: album identity is the sorted list of filenames plus
 * each file's size and mtime. If none of that moved, the cached entry is reused
 * and no EXIF or `sharp` work happens at all.
 */
function digestAlbum(dir: string, files: string[]): string {
  const hash = createHash('sha256');
  for (const file of [...files, 'album.yaml']) {
    const path = join(dir, file);
    if (!existsSync(path)) continue;
    const stats = statSync(path);
    hash.update(`${file}:${stats.size}:${stats.mtimeMs}`);
  }
  return hash.digest('hex');
}

async function loadAlbum(
  base: string,
  slug: string,
  context: LoaderContext,
): Promise<Album | undefined> {
  const dir = join(base, slug);

  const files = readdirSync(dir)
    .filter((file) => PHOTO_PATTERN.test(file) && file !== COVER_FILE)
    .sort(comparePhotoNames);

  if (files.length === 0) {
    context.logger.warn(`Album "${slug}" has no photos — skipping.`);
    return undefined;
  }

  const digest = digestAlbum(dir, files);
  // The store is typed as a bag of unknown properties; Album is the shape we
  // put in and take out, so the cast is confined to these two call sites.
  const cached = context.store.get<Album & Record<string, unknown>>(slug);
  if (cached && cached.digest === digest) return undefined;

  const sidecar = readSidecar(dir);
  const title = sidecar.title ?? titleFromSlug(slug);

  const photos = await Promise.all(
    files.map((file, index) => buildPhoto(dir, slug, file, index, title, sidecar)),
  );

  // A hand-made cover.jpg wins; otherwise fall back to the first photo so a
  // freshly dropped-in folder still gets a tile on /photo.
  const coverFile = sidecar.cover ?? (existsSync(join(dir, COVER_FILE)) ? COVER_FILE : files[0]!);

  const album: Album = {
    slug,
    title,
    description: sidecar.description,
    order: sidecar.order,
    cover: `/src/assets/photos/${slug}/${coverFile}`,
    photos,
  };

  /*
   * `store.set` does not validate on its own — a custom loader has to run the
   * collection schema itself. Without this a typo in album.yaml (a title that
   * is a number, an order that is a string) would sail through and surface as
   * a broken page instead of a build error.
   */
  const data = await context.parseData({
    id: slug,
    data: album as unknown as Record<string, unknown>,
  });

  context.store.set({ id: slug, data, digest });
  return album;
}

/**
 * Scans a directory of album folders and turns each one into a content entry,
 * harvesting EXIF and image dimensions from the source files.
 *
 * Everything is derived from the filesystem, so adding an album means dropping a
 * folder of JPEGs into `src/assets/photos/` — no code change, no route to
 * register, no thumbnail list to maintain. The optional `album.yaml` sidecar
 * only supplies the things a filename cannot: prose, ordering, and alt text.
 */
export function albumLoader({ base }: { base: string }): Loader {
  const root = resolve(base);
  let watching = false;

  return {
    name: 'album-loader',

    async load(context: LoaderContext): Promise<void> {
      if (!existsSync(root)) {
        throw new Error(`Album directory not found: ${root}`);
      }

      const slugs = readdirSync(root, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort();

      // Drop albums whose directory has since been deleted. Snapshot the ids
      // first — deleting while iterating the store is not safe.
      for (const id of context.store.values().map((entry) => entry.id)) {
        if (!slugs.includes(id)) context.store.delete(id);
      }

      let loaded = 0;
      let photos = 0;

      for (const slug of slugs) {
        const album = await loadAlbum(root, slug, context);
        if (album) {
          loaded++;
          photos += album.photos.length;
        }
      }

      if (loaded > 0) {
        context.logger.info(`Loaded ${loaded} album(s), ${photos} photos with EXIF.`);
      }

      // Watch the album root in `astro dev` so dropping in a folder of JPEGs
      // rebuilds the collection without a restart. Registered once — `load`
      // runs again on every change, and re-binding here would compound.
      if (context.watcher && !watching) {
        watching = true;
        context.watcher.add(root);
        context.watcher.on('all', (_event, path) => {
          if (path.startsWith(root)) void this.load(context);
        });
      }
    },
  };
}
