# Migration validation

Validated November 4, 2026 in the ChatGPT in-app Chromium browser and the local Next.js production server.

## Result

Four discovered content pages, four migrated. All original page text and heading sequences match the archived source (`content-validation.json`). All 240 unique local assets match their original SHA-256 hashes. No missing required assets or failed downloads.

| Check | Result |
|---|---|
| ESLint | Passed, no warnings/errors |
| Strict TypeScript | Passed |
| Next.js production build | Passed; all content pages prerendered |
| Asset and internal-link integrity | Passed |
| Production HTTP | Four pages, sitemap, robots and PDF return 200 |
| Legacy redirects | Sitemap aliases, original PDF path, slash normalization return 308 |
| Unknown URL | Returns 404 |
| Canonical metadata and indexing | Present; production pages indexable |
| Responsive routes | All four routes checked at 1440, 768 and 390 CSS-pixel viewports |
| Broken images | Zero across the twelve responsive route checks |
| Horizontal overflow | None across the twelve checks |
| Runtime WordPress dependency scan | No unwanted source or production HTML/CSS/JS references |
| Application browser/server errors | None observed in production checks |

`responsive-validation.json` records measured section heights. Content viewport widths are 1425, 753 and 375 pixels because this Windows browser reserves 15 pixels for its scrollbar. All section heights match the source after fonts/images settle, except one one-pixel rounding difference on the 2026 mobile gallery. Homepage video frames differ because of playback timing. Screenshots were inspected in-browser; an automated image-diff score was not computed. Header text, button positions, page patterns, image grids, typography and source-responsive column behavior were visually compared. The missing builder-generated responsive row classes found during tablet testing were fixed in static markup and retested.

## Functional flow

Visitors load locally prerendered HTML and locally hosted assets. The small React client layer adds the two renovation slideshow controls and photo dialogs. Each yearly gallery opens its original local images (12 / 12 / 8). Previous/next navigation, homepage image selection, dialog close/focus restoration and the Get Involved contact anchor were exercised. The contact anchor settles with the source 40-pixel offset. Production slideshow and lightbox behavior were retested after the final build. Video autoplay/muted/loop behavior is native and independent of WordPress. The PDF endpoint returns application/pdf. Donation and news-article targets match the originals; no payment was submitted.

## SEO and retained references

Canonical/OG/JSON-LD URLs intentionally retain kennethteetersfoundation.org, with media URLs pointing to /assets on that domain after cutover. Original-domain references inside audit evidence and the user-supplied offline source are not served. One original /wp-content/ PDF path remains intentionally in next.config.ts as an inbound redirect to the preserved local PDF. No stylesheet, image, font, script, or API runtime request requires the WordPress host. Native sitemap/robots routes replace Yoast output. The obsolete WordPress SearchAction metadata was omitted; the original had no visible search UI.

## Remaining limitations

- The Scripps news-video embed reports "Unable to play media" on both the original and the migrated site. This publisher-owned external stream is outside the WordPress host; the original embed is retained. Its repair requires the publisher.
- Donation checkout is intentionally external. The link was preserved and checked; a real payment was not made.
- There is no contact form in the source, so there is no email backend to configure. Required environment variables: none.
- Production npm dependencies have zero audit findings. Eight moderate findings remain in development-only ESLint transitive dependencies (minimatch); no unsupported major override was forced.
- Validation covers the available Chromium browser at the three requested widths, not every browser/device. Source footer date, spelling and historical event dates are retained exactly.

Ready for Vercel import using this directory as the root. No deployment or production-domain changes were performed. Local production preview: http://127.0.0.1:3001/ while its server session remains running.
