# Clarity revision

Supersedes the tabbed layout described in PROJECT-BROWSER.md after user feedback that it was confusing.

- Removed category tabs, thumbnail selection, and collapsed project explanations.
- Used explicit project titles: Ralph's bathroom renovation and Edmond's home remodel.
- Made What we did visible for each project.
- Ralph's Before and After groups appear beside each other on desktop and mobile, with all four captioned photos visible.
- Edmond's six photos remain grouped under Kitchen before the remodel, Home access, and Bathroom accessibility. No unverified matched comparisons were introduced.
- Preserved the original ten project photographs, portraits, viewer sequence, modal accessibility, section anchors, and metadata.
- Rebuilt the homepage invitation with a concrete headline, two named project previews, and one See Our Work link.

Reviewed at 390px and 1440px, including the light/dark Our Work themes. Confirmed ten visible photo entries, no horizontal overflow at 390px, photo enlargement/Escape, and the homepage CTA destination. Lint, strict TypeScript, HTTP/asset verification, and production build pass. Historical Lighthouse reports describe their corresponding earlier design, not this revision.

No push or deployment performed. Current preview remains on port 3001.
