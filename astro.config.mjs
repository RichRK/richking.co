// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://richking.co',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: {
    format: 'file',
  },
  image: {
    // Photos are the whole point of this site — spend the build time.
    responsiveStyles: true,
  },
  redirects: {
    // Retired: the IE8 landing page the 2014 site bounced old browsers to.
    '/unsupported': '/',
  },
  /*
   * Note: do NOT add trailing-slash redirects such as '/photo/': '/photo'
   * here. With trailingSlash 'never' and build.format 'file' the source
   * normalises to the same output file as the real page, so Astro overwrites
   * photo.html with a redirect stub pointing at itself. Normalising '/photo/'
   * to '/photo' is the host's job — see README.
   */
});
