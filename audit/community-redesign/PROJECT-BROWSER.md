# Project photo browser redesign

## Design audit and direction

The previous layout stacked all ten large project photos, repeated headings, and long explanatory blocks. On mobile this separated the project introduction from later photos and required excessive scrolling.

Preserved: local Jost, navy brand, semantic light/dark tokens, the foundation logo, project copy, original photo files and viewer ordering, `/our-work/`, metadata, and existing project/section anchors. The homepage and other Our Work sections are unchanged.

Applied design-taste-frontend and ui-ux-pro-max. Design dials: variance 5, motion 3, density 4. Native CSS evolves the existing brand instead of adding a second design system. Original documentary photography is used, without generated assets. Panels use 16px corners; controls and portraits use 8px corners.

## Implemented

- Separate project panels with compact veteran identification and expandable project details.
- Desktop introduction/photo split; a single-column mobile panel.
- Ralph: Before/After tabs, finished bathroom shown initially.
- Edmond: Interior/Access/Bathroom tabs. Different rooms are never presented as a matched comparison.
- One uncropped image at a time, two selectable thumbnails per group, descriptive captions, actual project photo totals, full-size controls.
- Native modal becomes a rounded mobile sheet, retaining close, previous/next, keyboard controls, focus restoration, and scroll locking.
- Tab keyboard navigation supports arrows, Home and End. Native details preserve the complete project text in server-rendered HTML.
- Reserved image frames, contextual loading, retry UI for failed stage images, restrained state transitions gated by reduced-motion preference.

## Verification

Reviewed 375px, 390px, 768px, 1440px, and phone landscape. Both light and dark themes were visually reviewed. All ten photos were selected through the corresponding group and thumbnail, then opened and closed in the viewer with the correct caption and project sequence. Keyboard tab selection, Escape, details expansion, and landscape control visibility were checked. No horizontal overflow was observed.

Lint, strict TypeScript, original asset/route HTTP verification, and production build pass. Mobile Lighthouse against the production build: performance 88, accessibility 100, best practices 100, SEO 100. The report is `lighthouse-project-browser.json`; performance is a whole-page laboratory score, not a field measurement. A loading-label diagnostic found in this run was corrected by excluding the visual loading text from the photo button's accessible name.

The original community redesign validation remains historical. No GitHub push or deployment performed. Preview uses port 3001.
