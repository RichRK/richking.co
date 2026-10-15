import { getCollection, type CollectionEntry } from 'astro:content';

/** Both inferred from the collection schema, so they cannot drift from it. */
export type Album = CollectionEntry<'albums'>['data'];
export type Photo = Album['photos'][number];

/**
 * Albums with an explicit `order` come first, in that order. The rest follow,
 * newest capture first, so a new album appears without renumbering the others.
 */
export async function getAlbums(): Promise<Album[]> {
  const entries = await getCollection('albums');

  return entries
    .map((entry) => entry.data)
    .sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;

      const dateA = a.photos[0]?.exif.capturedAt?.getTime() ?? 0;
      const dateB = b.photos[0]?.exif.capturedAt?.getTime() ?? 0;
      return dateB - dateA;
    });
}

export function orientationOf(photo: Photo): 'portrait' | 'landscape' {
  return photo.src.height > photo.src.width ? 'portrait' : 'landscape';
}
