# Site expansion

## Structure
- `/our-work/`: services, application guidance, real before/after photographs, testimonial invitation.
- `/get-involved/`: monthly-giving selection, service-donation inquiry, general contact.
- `/events/`: album index linking to the unchanged year-gallery URLs.
- Shared responsive navigation includes the existing `/application/` route.

## Donations
Uses the foundation's existing QuickClick public button configuration (key ID 14617877), including its existing signed action/description and `allow_recurring=true` setting. The selected USD amount is passed to the hosted checkout with a GET form, matching the working hosted-link flow. The provider rejected POST requests during testing.

The donor must select recurring giving and a monthly schedule at QuickClick and approve the final payment terms there. The website does not collect card numbers or claim a payment succeeded. No new merchant account or recurring plan was created. A live transaction was not made during verification.

Reference: https://support.nmi.com/hc/en-gb/articles/16162258857617-QuickClick
Integration variables: https://secure.nmi.com/merchants/resources/integration/integration_portal.php

## Inquiries
`/api/inquiry/` accepts service offers and contact messages. Server-only `SMTP_API` and `SMTP_CHANNEL` must be configured locally and in Vercel. Uses SMTP.com, authenticated sender `contactforms@citryn.com`, and recipient `citryn.contactforms@gmail.com`, matching the existing application delivery integration.

Input validation, same-origin enforcement, a 20 KB body limit, a honeypot, and best-effort instance-local email throttling are included. Throttling is not a distributed rate limit. Provider errors do not expose credentials or submitted personal details. No real inquiry emails were sent during verification.

## Content
Existing foundation content and real photographs are reused. No testimonial quotes or new eligibility requirements were invented. Approved testimonials can replace the invitation in `/our-work/#testimonials`.

## Validation
- `npm run build`
- `npm run lint`
- `npm run verify`
- `node --experimental-strip-types --test tests/inquiry.test.mjs`
- Browser review at desktop and 390px mobile widths, in both color themes.

Lighthouse mobile audit (Get Involved): performance 93, accessibility 100, best practices 100, SEO 100. Report: lighthouse.json. The same-origin helper uses the public Host header because Next may rewrite its internal request URL to localhost. No live emails or charges were made.
