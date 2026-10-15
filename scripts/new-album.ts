/**
 * Scaffolds an `album.yaml` for an album directory.
 *
 * The sidecar is optional — an album works without one — so this exists purely
 * to save typing the field names. It refuses to overwrite an existing file.
 *
 * Usage: bun run album:new <slug> ["Title"]
 */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PHOTOS_ROOT = 'src/assets/photos';

function titleFromSlug(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const [slug, providedTitle] = process.argv.slice(2);

if (!slug) {
  console.error('Usage: bun run album:new <slug> ["Title"]');
  process.exit(1);
}

if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`"${slug}" is not a valid slug — use lowercase words separated by hyphens.`);
  process.exit(1);
}

const dir = join(PHOTOS_ROOT, slug);
const sidecar = join(dir, 'album.yaml');

if (existsSync(sidecar)) {
  console.error(`${sidecar} already exists — edit it directly.`);
  process.exit(1);
}

mkdirSync(dir, { recursive: true });

const photos = existsSync(dir)
  ? readdirSync(dir).filter((file) => /\.jpe?g$/i.test(file) && file !== 'cover.jpg')
  : [];

const title = providedTitle ?? titleFromSlug(slug);

writeFileSync(
  sidecar,
  `title: ${title}
description: >
  TODO: a sentence or two, shown on the album's opening card.
# order: 9          # position on /photo; omit to sort by capture date
# cover: 001.jpg    # defaults to cover.jpg, else the first photo
`,
  'utf8',
);

console.log(`✓ ${sidecar}`);
console.log(
  photos.length > 0
    ? `  ${photos.length} photo(s) already in ${dir} — run \`bun run dev\` to see it.`
    : `  Now drop your JPEGs into ${dir}/`,
);
