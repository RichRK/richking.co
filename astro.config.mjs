// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pruneOriginals from './src/integrations/prune-originals.ts';

export default defineConfig({
  site: 'https://richking.co',
  trailingSlash: 'never',
  integrations: [sitemap({ filter: (page) => !page.endsWith('/thanks') }), pruneOriginals()],
  build: {
    format: 'file',
  },
  image: {
    responsiveStyles: true,
  },
  redirects: {
    // Old IE8 landing page; existing links still resolve.
    '/unsupported': '/',
  },
  /*
   * Don't add trailing-slash redirects such as '/photo/': '/photo'. With
   * trailingSlash 'never' and build.format 'file' they resolve to the same
   * output file as the real page and overwrite it with a self-redirect.
   * Normalising is the host's job (see README).
   */
});
