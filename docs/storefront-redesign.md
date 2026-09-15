# Wonder storefront redesign

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
