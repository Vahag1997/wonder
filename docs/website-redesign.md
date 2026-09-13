# Website redesign — 13 September 2026

Later update: [preview-before-payment implementation](purchase-flow.md) adds age, preview, checkout and completion screens plus a zero-cost demo. The browser/performance results below are historical evidence for the earlier redesign, not a new visual certification of those screens.

## Delivery status

The redesigned website is implemented in `/Users/macrpo/wonder` and runs as a local Next.js production preview. It has not been publicly deployed. No generation-engine code was changed as part of this website redesign.

The visual/front-end experience is ready for review. The paid book service is **not launch-ready** until its backend, payments, artwork permissions, privacy handling and real-device tests are completed. Passing the checks below is not a guarantee of zero bugs or universal accessibility.

## Implemented experience

- Warm paper/forest-green visual system, Onest and Fraunces typography, responsive layouts and consistent controls.
- Real book samples, CSS 3D covers, keyboard-operable enlarged page viewer and smooth transitions. Reduced-motion preferences are respected; no WebGL or autoplay video payload is needed.
- Two original fictional marketing images. Generated originals and exact prompts are documented in `website-assets.md`.
- Catalogue themes/search kept in the URL, useful empty states and working browser-back navigation.
- Name → photo → review preview with Unicode name validation, file signatures/type/size/dimensions, parent/guardian consent, edit/back/remove actions and temporary object-URL cleanup.
- English/Russian UI, help search, coherent account screens, loading/error/not-found states and legacy-link redirects.
- Honest source-language, original-hero and reference-book labels. No invented review scores, customer testimonials, prices, shipping promises, completed orders or generated results.

## Next.js and technical work

- Preserved App Router and npm lockfile; upgraded within the Next.js 15 line to 15.5.25 and matching ESLint configuration. Applied compatible dependency security updates.
- Server-rendered page content, isolated client interactions, local optimized WebP images and self-hosted `next/font` assets. Main home first-load JavaScript is approximately 111 kB according to `next build`.
- Removed the no-op middleware and global Chakra/auth loading wrappers from the new public-page path. Original legacy components are retained.
- Scoped loading UI instead of a root loading boundary. Verified that missing books return HTTP 404 rather than a streamed 200, and eliminated the measured footer layout shift.
- Added production security headers and restricted local image paths. No keys added. Search indexing remains off for the private preview.
- Retained unrelated Telegram mockup source but disabled its route by default; the old Supabase diagnostic page is also unavailable.

## Verification

Detailed generated reports and screenshots are in `artifacts/website/`. Commands are in the project README. The browser suite is run against `next start`, not the development server.

- Production build and ESLint: pass.
- Pure validation/catalogue tests: 8 pass.
- Browser flows: 27 checks covering navigation, filters/search, locale reload, sample viewer, validation, consent/edit/review, disconnected states, redirects/404s, 320/390/768px layouts, 200% homepage text size, real hover/reveal animations and readable server HTML without JavaScript.
- Accessibility: 34 desktop/mobile route and form-state scans with axe (WCAG 2 A/AA, 2.1 AA and best-practice tags), zero reported violations.
- Dependency audit: zero known vulnerabilities reported by npm audit on this date. This is not a penetration test or a guarantee against unknown vulnerabilities.
- Desktop and phone screenshots visually inspected, including the homepage, catalogue, book viewer and personalization review. Browser tests use isolated headless Chrome, not a real iPhone or Safari.
- Additional Russian-language check: six main routes at 320px, correct document language and no horizontal overflow; the Russian mobile homepage was visually inspected.
- Personalization tests assert no POST/PUT/PATCH requests and no localStorage/sessionStorage. No Gemini/Vast book-generation calls were made. The only generated visuals were the two explicitly requested marketing assets.

Final Lighthouse 13.4.1 measurements on the production build, run sequentially without parallel browser tests:

| Check | Mobile simulation | Desktop simulation |
| --- | ---: | ---: |
| Performance | 97/100 | 100/100 |
| Accessibility | 100/100 | 100/100 |
| Best practices | 100/100 | 100/100 |
| SEO | 66/100 | 66/100 |
| First contentful paint | 1.1 s | 0.3 s |
| Largest contentful paint | 2.6 s | 0.6 s |
| Total blocking time | 10 ms | 0 ms |
| Cumulative layout shift | 0 | 0 |

Local lab scores are not production real-user measurements. Preview SEO is intentionally reduced because `noindex` and robots.txt prevent indexing; the description and metadata checks pass. Do not remove the preview safeguards to inflate this score. Mobile LCP remains slightly above the 2.5-second good threshold in this simulated run; measure and tune on the final hosting environment.

## Launch boundary

Auth UI retains the existing account client, but live sign-in/sign-up/recovery and database authorization were not verified or configured. The existing database queries are not evidence that RLS or ownership rules are safe. Do not enable a public service by simply adding credentials.

Amir is the only enabled personalization preview. Fluffy and ABC are branded reference samples, not Wonder products for sale. Source artwork rights still require approval. Website language does not change the book language.

The remaining service work is a secure upload/order API, private storage and retention, verified payment webhook, queued ChildBook worker, spend/retry limits, page-level recovery, authenticated delivery, operational monitoring and end-to-end provider tests. This is described in the README launch checklist; none of those steps are silently simulated in the UI.
