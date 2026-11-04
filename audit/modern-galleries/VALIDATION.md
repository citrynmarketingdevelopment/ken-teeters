# Modern event gallery validation

Validated November 4, 2026. This is the approved redesign baseline; the initial 1:1 migration audit remains untouched in the parent audit directory.

## Implemented

- Dedicated yearly React gallery pages with the existing paths, titles, descriptions, canonicals, Open Graph and JSON-LD metadata.
- Local typed album catalog, all 32 originals in their original order, stable photo IDs, reviewed per-photo crops and focal positions, and descriptive alternative text.
- Four-column desktop masonry, three-column tablet masonry, two-column phone grid and one-column fallback below 360px. Native proportions are never distorted.
- A dynamically loaded native modal dialog with inline gallery/zoom functionality. Desktop has the complete optimized thumbnail rail; mobile uses a 92dvh sheet and reachable 48px controls. The handle has a 44px hit area. Landscape maximizes photo space.
- Original, uncropped viewer images capped at their intrinsic resolution by default, including the small 2026 originals.
- Photo fragment links, one history entry per opening, replacement on photo changes, Back/Forward restoration, Escape, arrow keys, visible controls, focus containment/restoration and scroll restoration.
- Image-led homepage album links in newest-first order. All other homepage section markup is checked against the original baseline, with one explicitly recorded exception for a separately authored application CTA change.

## Automated checks

`npm run lint`, `npm run typecheck`, `npm run verify` and `npm run build` pass. HTTP checks against the production preview confirm successful gallery/home/sitemap/robots/PDF responses and the existing 404 behavior. Asset checks preserve all 240 original migration asset hashes. The verification command also checks album counts/order, unique IDs, source paths, metadata completeness and unrelated homepage-section hashes. The new application route authored separately in the same checkout is recognized as an existing route.

No unwanted original-host WordPress asset/API dependencies were found in application source or built HTML/CSS/JS. Production-domain references remain for SEO identifiers and locally hosted production assets. Historical stylesheet copies are in `original-styles/` and are no longer imported by the app.

## Browser evidence

CUA Chromium checks waited for client hydration before measuring layouts. At 375/390px all albums use two columns; at 768/1024px they use three; at 1440px they use four. All fifteen combinations have the expected 12/12/8 visible tiles, no broken images and no horizontal overflow. The exact 1200px boundary was also checked and uses four columns. At 320px the single-column fallback works. `responsive-results.json` records the five required widths.

Every original event image was opened in order, verified loaded at its correct local URL, and checked against its counter/hash. Each album wraps correctly from its last photo to its first. The eight 2026 photos were measured at exactly their intrinsic widths on desktop. Thumbnail selection, zoom buttons, Previous/Next, direct photo links, unknown-ID fallback, Back/Forward, Escape and focus restoration were exercised. Twenty consecutive Tab presses remain inside the dialog after an explicit focus-loop check was added.

Mobile horizontal dragging advances photos. Handle dragging closes the sheet; a short, canceled drag leaves it open and returns it to its resting position. Closing still works after a canceled drag. Rotation preserves the selected photo. Landscape controls fit within the viewport and the thumbnail rail is hidden to protect image space. Homepage album links navigate to the correct yearly pages, and both community renovation slideshows remain present.

A local-only failure proxy on port 3003 deliberately blocked one preview and failed its original image once. The preview fallback remained actionable, the viewer displayed its error and recovery controls, and Try again successfully reloaded the original without losing the selected photo. The proxy is standalone QA tooling and is never imported or deployed by the application.

## Lighthouse results

| Production page | Performance | Accessibility | Best practices | SEO | CLS | LCP |
|---|---:|---:|---:|---:|---:|---:|
| Desktop 2025 gallery | 100 | 100 | 100 | 100 | 0 | 0.72s |
| Throttled mobile 2024 gallery | 93 | 100 | 100 | 100 | 0 | 3.15s |
| Mobile direct-photo link, forced reduced motion | 84 | 100 | 100 | 100 | 0 | 4.44s |

These are local Lighthouse lab results, not field Core Web Vitals. The direct-photo result includes loading the lazy viewer and the full original photograph. Mobile LCP remains above the aspirational 2.5s target under simulated throttling; no fidelity or original-image quality was removed to improve an arbitrary score. Raw reports and summary JSON are included. Preview JPGs are unmodified screenshots extracted from those reports.

Reduced-motion auditing used Chrome's `--force-prefers-reduced-motion` flag; the sheet and slide transitions have corresponding zero-duration fallbacks. Keyboard/screen-reader names were checked in the accessibility tree and Lighthouse. The available input API does not provide physical multi-touch, so real-device pinch and VoiceOver/TalkBack testing remains manual. Native browser zoom shortcuts are not implemented by the in-app browser; the 200% reflow equivalent was checked at a 720 CSS-pixel viewport for a 1440px desktop width, without overflow. This is not claimed as a physical-browser 200% zoom test.

## Shared-checkout boundaries

Concurrent application-form work added application routes, assets, environment documentation and a homepage application link while this gallery task was running. Those changes were preserved, not authored or reverted by this task. `homepage-preservation.json` identifies the exact separately authored CTA replacement so the gallery integrity check remains strict for every other part of the homepage. No gallery backend, email integration, credentials or CMS were added.

No GitHub push or deployment was performed. Review the production preview at http://127.0.0.1:3002/2025-gallery/ while its local server session is running.
