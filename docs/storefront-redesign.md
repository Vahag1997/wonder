# Wonder storefront redesign

## September 15: closer bookshop revision

The client requested a substantially closer Wonderwraps direction. The reference
homepage and product page were inspected live. This revision replaces the generic
forest hero with the actual Amir source cover on a CSS lavender display, makes
cover cards edge-to-edge, uses quieter labels and rectangular calls to action,
and adds pictorial process steps and an expanded source-page/detail FAQ section.
Shared catalog, forms, account, support and footer styling is updated through
`src/app/bookshop.css`. Golos Text and Manrope are self-hosted by Next/font with
Cyrillic subsets; a more-specific legacy Russian font rule was corrected.

No reference-site assets, reviews, sales figures or prices were copied. Existing
supplied reference books remain labeled as samples and blocked for personalization.
No paid generation, email, payment or real customer upload occurred. This is a UI
revision, not completion of the production integrations.

Checks: lint, 20 unit tests, production build; Russian/default/invalid-cookie/English
HTTP checks on 12 routes and localized 404; 21 fail-closed purchase API requests.
Browser inspection covered desktop homepage/cards, mobile homepage/cards, desktop
and mobile details, desktop registration and mobile photo form. Six key routes at
320, 768 and 1440px had no horizontal overflow, one h1 and no detected broken loaded
images. Gallery next/expand/Escape, catalog filter/reset and empty-name validation
were exercised. Foreground/background contrast of announcement and step numbers
was adjusted to >4.5:1. Full axe and legacy browser suites were not run in this
revision. Chrome extension errors were seen in logs, unrelated to the site.

Earlier revision notes follow.

## Direction

Reference inspected in browser: https://wonderwraps.com/ and its book-detail
page. The new design uses a white shopping navigation, lavender split hero,
purple calls to action, rounded sans-serif typography, large book artwork,
pastel sections, four illustrated steps, theme browsing, FAQ cards, and a
reading-focused closing section. Wonder keeps its own identity, copy, icons,
and existing site illustrations; no new competitor assets were downloaded.

Russian remains the default. English remains available from the language
switch. Catalog, book details, personalization, account forms, library,
orders, support and error pages share the new storefront styling.

## Implementation

- Rebuilt homepage composition and shared header/footer.
- Added the visual-system layer in `src/app/storefront.css`; the existing
  base CSS retains structural/form states. Removed the unused serif font
  download and updated the favicon.
- Retained responsive image optimization, CSS-only cover effects, native
  FAQ disclosure controls, keyboard focus, reduced-motion behavior, and
  mobile menu Escape handling.
- Added a catalog search shortcut and corrected Russian count inflections.
- Added a cover-size regression assertion and updated old browser-test
  selectors to reflect the new header/card layout.
- No auth logic, database permissions, payment endpoints, or generation
  workflow was changed. Account artwork only received image priority.
- No paid image calls, real photo uploads, account creation, or email sends.

## Review

Visually inspected desktop homepage, catalog cards, illustrated steps,
featured spread, book-detail page, personalization, FAQ and registration;
phone homepage, catalog, photo step, menu, registration and support.
The first browser pass caught collapsed catalog covers and a joined mobile
headline. Both were corrected and visually rechecked.

Browser checks confirmed theme filtering, sample navigation/modal/Escape,
required name validation, name-and-age progression, mobile menu open/Escape,
and FAQ expansion. Layout checks found no horizontal overflow on checked
routes at 320, 390, 768 and desktop width. This is viewport simulation, not
a physical iOS/Android certification.

Production build, lint, 20 unit tests, language HTTP checks on 12 routes
(new visitor, invalid cookie, RU, EN), and disabled-purchase HTTP checks
passed during implementation. The full legacy Playwright/axe suites were
not executed in this turn; browser checks used the connected browser.

## Launch boundary

This is a UI redesign, not completion of the commerce backend. The website
continues to disclose that generation and payment are unavailable. Reference
book labeling stays in place. Production email, uploads, worker integration,
payments and final PDF delivery remain separate pending work.
