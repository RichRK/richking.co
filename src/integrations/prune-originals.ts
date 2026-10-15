import { readFile, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type { AstroIntegration } from 'astro';

const ORIGINAL = /\.(jpe?g|png)$/i;
const TEXT = /\.(html|css|js|mjs|xml|json)$/i;

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
    ),
  );
  return nested.flat();
}

/**
 * Images pulled in through a content collection's `image()` are emitted to
 * `_astro/` untouched, even when every page only uses their optimised variants:
 * Astro's own cleanup keeps any original it believes is referenced, and reading
 * collection data trips that check for every image. For this site that was
 * ~38 MB of full-size JPEGs nothing links to.
 *
 * This removes an original only if no emitted HTML, CSS or JS mentions its
 * filename, so anything actually referenced is left alone. If Astro stops
 * shipping them, this finds nothing to delete and can be removed.
 */
export default function pruneOriginals(): AstroIntegration {
  return {
    name: 'prune-unreferenced-originals',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const files = await walk(join(root, '_astro'));
        const originals = files.filter((file) => ORIGINAL.test(file));
        if (originals.length === 0) return;

        const haystack = (
          await Promise.all(
            (await walk(root)).filter((file) => TEXT.test(file)).map((f) => readFile(f, 'utf8')),
          )
        ).join('\n');

        let removed = 0;
        for (const file of originals) {
          const name = file.slice(file.lastIndexOf('/') + 1);
          if (haystack.includes(name)) continue;
          await rm(file);
          removed++;
        }
        if (removed > 0) logger.info(`Removed ${removed} unreferenced original image(s).`);
      },
    },
  };
}
