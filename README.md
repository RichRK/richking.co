# richking.co

Photography and videography portfolio, originally built by hand in 2014 and
rebuilt on [Astro](https://astro.build) in 2026.

## Quick start

```sh
bun install
bun run dev      # http://localhost:4321
bun run build    # → dist/
bun run preview
bun run check    # astro check (types)
bun run format   # prettier
```

## Adding an album

Drop a folder of JPEGs into `src/assets/photos/` and rebuild. That's it — the
album is routed, thumbnailed, listed on `/photo`, added to the sitemap, and
every photo gets an ISO / aperture / shutter caption read from its EXIF.

```
src/assets/photos/
└── patagonia/
    ├── cover.jpg      # optional — falls back to the first photo
    ├── 001.jpg
    ├── 002.jpg
    └── album.yaml     # optional — see below
```

Photos are sorted numerically by filename. Orientation is derived from the
actual image dimensions, so nothing needs to be declared.

### `album.yaml`

Entirely optional. It only supplies what a filename cannot:

```yaml
title: Patagonia # defaults to the folder name, title-cased
description: A month on the ice. # shown on the album's opening card
order: 3 # position on /photo; unordered albums sort by capture date, newest first
cover: 004.jpg # defaults to cover.jpg, else the first photo
photos:
  001.jpg:
    alt: Glacier at first light # defaults to "<Album> — photo N"
    thumbPosition: bottom # object-position for the thumbnail crop
```

The file is validated against a Zod schema at build time, so a typo fails the
build with a readable error rather than rendering a broken page.

### `bun run album:new <slug>`

Scaffolds an `album.yaml` for an existing folder.

## How it fits together

| Piece                                 | Role                                                                      |
| ------------------------------------- | ------------------------------------------------------------------------- |
| `src/loaders/albums.ts`               | Scans `src/assets/photos/` and reads each photo's EXIF (`exifr`)          |
| `src/content.config.ts`               | Zod schemas for the `albums` and `videos` collections                     |
| `src/content/videos/`                 | One YAML file per film, with its poster image alongside                   |
| `src/integrations/prune-originals.ts` | Drops unreferenced full-size JPEGs that `image()` leaves in `dist/`       |
| `src/components/Filmstrip.astro`      | The horizontal gallery — CSS scroll-snap, vertical stack on small screens |
| `src/components/ThumbStrip.astro`     | Thumbnail strip along the bottom                                          |
| `src/components/PhotoMeta.astro`      | The `1/500s · f/2.8 · ISO 100 · 40mm` caption                             |
| `src/utils/gallery.ts`                | Arrow keys, prev/next, current-photo tracking                             |

EXIF is harvested **at build time, from the source files**. Astro's image
pipeline re-encodes photos and strips their metadata, so it has to be captured
into the content layer before optimisation — it cannot be read back out of
`dist/`.

## Deployment

Static output. Built with `bun run build`, published from `dist/`.

Two things to set on the host (Statichost) when this first goes live:

1. **Build command `bun run build`, publish directory `dist`.** The site was
   previously deployed by uploading the `www/` directory as-is; that directory
   no longer exists, so the site will break until this is changed.
2. **Retire `m.richking.co`.** The site is responsive now — the separate mobile
   build and the user-agent sniffing that redirected to it are both gone. Point
   the subdomain at the apex domain.

`trailingSlash` is `'never'`, matching the link style the site adopted in March 2026. Normalising `/photo/` → `/photo` is the host's job; don't add those as
Astro `redirects`, because with `build.format: 'file'` the redirect target
resolves to the same output file as the real page and overwrites it.

## Known gaps

- **The contact form has no backend.** It posts to `/thanks`, a static page. The
  Netlify Forms wiring and honeypot were stripped in March 2026 and never
  replaced. The markup is ported as-is and remains non-functional; it needs a
  form service or to be swapped for a mailto link.
- **Alt text is generated.** All 174 photos get `"<Album> — photo N"`. Real
  descriptions can be filled in per photo via `album.yaml` at any time.
- **Source resolution is capped by what's in the repo** — 1555×1037 landscape,
  691×1037 portrait. EXIF says the originals were 5184×3456. If those turn up,
  dropping them in gives retina output for free; no code changes needed.
