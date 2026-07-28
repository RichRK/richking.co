import { defineCollection } from 'astro:content';
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

const photoSchema = z.object({
  file: z.string(),
  src: z.string(),
  alt: z.string(),
  width: z.number(),
  height: z.number(),
  orientation: z.enum(['portrait', 'landscape']),
  thumbPosition: z.string().default('center'),
  exif: exifSchema,
});

/**
 * One entry per directory under `src/assets/photos/`. Validating here means a
 * malformed `album.yaml` fails the build with a readable error rather than
 * rendering a broken page.
 */
const albums = defineCollection({
  loader: albumLoader({ base: './src/assets/photos' }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    cover: z.string(),
    photos: z.array(photoSchema).min(1),
  }),
});

export const collections = { albums };
