import type { PhotoExif } from '../loaders/albums';

/**
 * EXIF stores exposure as a float — 0.002 rather than "1/500". Anything shorter
 * than a second reads better as a fraction, which is also how the camera
 * displayed it.
 */
export function formatShutter(exposureTime?: number): string | undefined {
  if (exposureTime === undefined || exposureTime <= 0) return undefined;

  if (exposureTime >= 1) {
    // 2s, 1.6s — trim a trailing .0 so whole seconds stay clean.
    const rounded = Math.round(exposureTime * 10) / 10;
    return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}s`;
  }

  return `1/${Math.round(1 / exposureTime)}s`;
}

/** f/2.8, f/8 — never f/8.0. */
export function formatAperture(fNumber?: number): string | undefined {
  if (fNumber === undefined || fNumber <= 0) return undefined;
  const rounded = Math.round(fNumber * 10) / 10;
  return `f/${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)}`;
}

export function formatIso(iso?: number): string | undefined {
  if (iso === undefined || iso <= 0) return undefined;
  return `ISO ${iso}`;
}

export function formatFocalLength(focalLength?: number): string | undefined {
  if (focalLength === undefined || focalLength <= 0) return undefined;
  return `${Math.round(focalLength)}mm`;
}

export function formatCapturedAt(capturedAt?: Date): string | undefined {
  if (!capturedAt || Number.isNaN(capturedAt.getTime())) return undefined;
  return capturedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * The caption line shown beside every photo, e.g.
 *   1/500s · f/2.8 · ISO 100 · 40mm
 *
 * Missing fields drop out along with their separator, so a photo with partial
 * EXIF still reads correctly and one with none renders nothing at all.
 */
export function formatExifParts(exif: PhotoExif): string[] {
  return [
    formatShutter(exif.exposureTime),
    formatAperture(exif.fNumber),
    formatIso(exif.iso),
    formatFocalLength(exif.focalLength),
  ].filter((part): part is string => Boolean(part));
}
