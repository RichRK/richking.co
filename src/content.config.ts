import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { albumLoader } from './loaders/albums';

const exifSchema = z.object({
  iso: z.number().optional(),
  fNumber: z.number().optional(),
  exposureTime: z.number().optional(),
  focalLength: z.number().optional(),
  lens: z.string().optional(),
  camera: z.string().optional(),
  capturedAt: z.coerce.date().optional(),
});

/**
 * One entry per directory under `src/assets/photos/`. Validating here means a
 * malformed `album.yaml` fails the build with a readable error rather than
 * rendering a broken page.
 *
 * `image()` resolves each photo against the album folder, so entries carry real
 * `ImageMetadata` (dimensions included) and pages never touch `import.meta.glob`.
 */
const albums = defineCollection({
  loader: albumLoader({ base: './src/assets/photos' }),
  schema: ({ image }) =>
    z.object({
      slug: z.string(),
      title: z.string(),
      description: z.string().optional(),
      order: z.number().optional(),
      cover: image(),
      photos: z
        .array(
          z.object({
            file: z.string(),
            src: image(),
            alt: z.string(),
            thumbPosition: z.string().default('center'),
            exif: exifSchema,
          }),
        )
        .min(1),
    }),
});

/**
 * One YAML file per film in `src/content/videos/`, with its poster alongside.
 */
const videos = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/videos' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      order: z.number(),
      youtubeId: z.string().regex(/^[\w-]{11}$/, 'expected an 11-character YouTube id'),
      duration: z.string().regex(/^\d{2}:\d{2}$/, 'expected mm:ss'),
      maxQuality: z.enum(['480p', '720p', '1080p', '1440p', '2160p']),
      poster: image(),
      description: z.string(),
    }),
});

export const collections = { albums, videos };
