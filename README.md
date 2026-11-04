# Kenneth Teeters Foundation migration

Standalone Next.js 16.4.5 / React 19.3.1 / strict TypeScript application. The original four public content URLs retain their paths and trailing slashes. Our Work, Get Involved, Events, and the online assistance application are also available. No WordPress runtime, CMS, or database is required. Online forms require server-side SMTP.com credentials.

## Run

Use Node.js 22 or later (validated on Node.js 24.11.1).

```sh
npm ci
npm run dev
npm run lint
npm run typecheck
npm run verify
npm run build
npm start
```

`npm run verify` checks every preserved asset against its SHA-256 hash and checks content links, asset paths, and prohibited runtime references. Set `CHECK_HTTP=1` to also check the running site at port 3000.

## Deploy to Vercel

Import the repository root (`D:/Projects/ken-teeters`) as the project root. Use the Next.js framework preset, `npm run build`, and the default output configuration. `package-lock.json` is included project input; use `npm ci`. Configure `SMTP_API` and `SMTP_CHANNEL` as server-only production secrets before deploying. Both contact and application submissions send to `citryn.contactforms@gmail.com` using `contactforms@citryn.com` as the sender. Never commit `.env` files with credentials. The connected Vercel project is `ken-teeters` under `citryn-marketings-projects`, with production at https://ken-teeters.vercel.app/. Custom-domain DNS is managed separately.

## Architecture

- `src/app`: App Router pages, metadata, sitemap, robots, and 404.
- `src/components`: server content renderer and the small standalone React interaction layer.
- `src/data`: audited, sanitized, local static content snapshots and page metadata. These are trusted build inputs; do not replace them with untrusted remote HTML.
- `src/styles`: preserved vanilla CSS, scoped by page so gallery styles cannot overwrite homepage styles; deduplicated local webfonts; standalone interaction/accessibility CSS. All styles are imported by the root layout.
- `public/assets`: original image bytes, responsive image variants, fonts, PDF, and flag video.
- `scripts/verify.mjs`: repeatable migration integrity checks.
- `audit`: original HTML/API/sitemap evidence, inventory, SHA-256 asset map, and validation results. This folder is not publicly served. Extraction scripts are historical migration tooling and require Python requests, BeautifulSoup, and tinycss2; the application itself uses none of these dependencies.

The original layout classes remain to preserve exact typography, dimensions, image sizing, and media queries. Static content has no WordPress scripts, event handlers, APIs, or hosted dependencies. Builder-generated responsive row classes are preserved directly in markup. Entrance animations retain original durations, delays, direction, and easing; reduced-motion users receive static content. Galleries use native buttons and an accessible HTML dialog with keyboard navigation and focus restoration. Original content images retain their responsive `srcset` and intrinsic dimensions; the interactive full-size viewer uses Next Image without recompression.

## Content and assets

Four discovered/migrated pages: `/`, `/2024-gallery/`, `/2025-gallery/`, `/2026-gallery/`. See `audit/INVENTORY.md` and `audit/ASSETS.md`. There are 240 unique local files (169 images, 69 fonts, one PDF, one WebM), 43,280,091 bytes, with zero download failures. The 32 yearly event photos and ten renovation slideshow photos are preserved, along with homepage imagery, backgrounds, logos, social image, and favicons.

Original wording, spelling, event dates, and the source footer date are preserved. The source header/navigation was disabled, and the source had no contact submission form. No fabricated submission workflow was added.

## SEO

Titles, descriptions, canonical URLs, Open Graph, Twitter cards, source heading levels, source alt text, modified dates, and relevant JSON-LD are preserved. Previously empty linked-image alt text now falls back to the original image title. Production pages are indexable. The obsolete WordPress SearchAction advertisement is omitted because the source has no visible search interface and the migrated site has no WordPress search backend. The old sitemap endpoints redirect to `/sitemap.xml`; the old application PDF URL redirects to its local asset. Canonical/schema URLs intentionally keep the production domain. Preview-domain deployments therefore canonicalize to the existing production domain.

## Validation and limits

See `audit/VALIDATION.md`, `audit/content-validation.json`, and `audit/responsive-validation.json`. Source text and heading order match on all four pages. Desktop (1440), tablet (768), and mobile (390) browser comparisons pass with measured section heights matching within one CSS pixel, zero broken images, and no horizontal overflow. Video frames differ between screenshots because the original flag video continues playing. This is visual/manual and DOM geometry verification, not an automated pixel-diff score.

Intentional third parties remain: QuickClick donation checkout and the Scripps news-video player/article. The source player and migrated embed both report `Unable to play media` in the test browser. Restoring that third-party stream requires its publisher; it is not supplied by the WordPress host. Donation URL preservation was checked without making a payment. Analytics/hosting telemetry and WordPress plugin scripts were removed.

Production dependencies have zero npm audit findings. The installed Next ESLint tooling reports moderate development-only transitive minimatch advisories; these are not shipped in the browser application. No major-version dependency override was forced.

## Modern event galleries

The original migration results above describe the archived baseline. The approved gallery redesign replaces the three yearly gallery layouts and the homepage past-events band, while retaining the 32 event originals, routes, metadata and community renovation slideshows.

The application now lives at `D:/Projects/ken-teeters`. The event catalog is `src/data/galleries.ts` (typed interface) with its inspectable payload in `src/data/galleries.json`. Each photograph has a stable ID, original dimensions, reviewed crop/focal point and descriptive alternative text. Gallery pages use React Photo Album; a dynamically loaded native dialog contains the inline Yet Another React Lightbox viewer. No gallery credentials or CMS are required.

Photos use `#photo=<id>` links. Opening adds one history entry; photo changes replace it. Back closes the viewer and Forward restores it. Direct links close back to their album. Desktop has masonry and a full thumbnail rail; mobile uses a 92dvh sheet with swipe, zoom, drag dismissal and visible navigation. Viewer originals are never enlarged beyond their natural size by default. Original yearly styles are retained under `audit/modern-galleries/original-styles` and are not imported by the app.

See `audit/modern-galleries/VALIDATION.md` for current testing, measured Lighthouse scores, hardware-test limits, and the separately authored application-form changes present in the shared checkout. The gallery work has not been pushed or deployed. Historical gallery audit reports describe the version tested at their timestamps. The current community layout is documented in `audit/community-redesign/CLARITY-REVISION.md`.


## Email verification

On November 4, 2026, one clearly marked dummy contact message and one dummy application were submitted through the local API handlers. SMTP.com accepted both; acceptance does not establish inbox placement. Production requires its own configured SMTP environment variables.
