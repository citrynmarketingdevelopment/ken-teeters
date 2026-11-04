# Community project redesign — November 4, 2026

## Approved changes

- Removed the homepage Upcoming Events section (formerly `et_pb_section_4`).
- Replaced community coverage and the two project slideshows (formerly sections 5–7) with an image-led See Our Work CTA pointing to `/our-work/#before-afters`.
- Moved community coverage, both veteran portraits, and all ten project photographs to Our Work. All twelve original local assets remain unchanged.
- Preserved the existing yearly event albums and other homepage content. Historical migration and gallery comparisons remain in their existing audit folders. Verification now excludes only the four intentionally retired homepage sections from the old section hashes.

## Project content

- Ralph J. Lopez: four photographs organized as Before and After, with a bathroom renovation summary and captions describing the tub, repairs, seating, and rails visible in the photographs.
- Edmond Sweeney Jr.: six photographs organized as Interior before the remodel, Home access, and Bathroom accessibility. The user requested a general paragraph and excerpt based on the existing information. Copy describes his 30 years of service and assistance through the Gifter Remodel program without assigning unconfirmed installation work to the foundation or presenting different rooms as matched before-and-after images.
- The original third-party 23ABC player and article remain available in a separate coverage section. The player reported that media could not be played during local testing; a visible article fallback is provided. Player availability remains controlled by the publisher.

## Local browser review

Reviewed at 1440×1000, 768×1024, 390×844, and 844×390. Confirmed:

- Desktop CTA uses a split image/copy layout; mobile CTA stacks without horizontal overflow.
- CTA reaches the project section on Our Work, below the fixed navigation.
- Both light and dark themes display project copy and photo groups correctly.
- All ten photograph buttons open their corresponding original image and caption.
- Project viewers stay within their own four- or six-photo sequence and wrap at either end.
- Previous/Next controls work; Escape closes the dialog.
- Close returns focus to the originating photo and restores body scrolling.
- Shift+Tab from Close wraps to Next, keeping keyboard focus inside the modal.
- Landscape photo, caption, and controls fit within the viewport.
- No broken project images were reported by the browser.
- Upcoming Events is absent from the rendered homepage.

## Automated checks

`npm run lint`, `npm run typecheck`, `npm run verify`, and `npm run build` pass. HTTP verification checks the homepage CTA/removal, both Our Work project anchors, existing album routes, canonicals, sitemap, robots, PDF, and 404 behavior. Original asset checksum verification remains enabled.

No push or deployment was performed.
