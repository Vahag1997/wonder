# Wonder website

A Next.js App Router storefront and personalization **private preview**. The book-generation engine lives separately in `/Users/macrpo/ChildBook`.

## Run locally

Use Node.js 22 or newer (verified with 24.13.1) and the committed npm lockfile.

```sh
npm ci
npm run dev -- --hostname 127.0.0.1
```

Open http://127.0.0.1:3000. No API keys are required for the preview.

For a production-mode preview alongside the development server:

```sh
WONDER_BUILD_DIR=.next-production npm run build
WONDER_BUILD_DIR=.next-production npm run start -- --hostname 127.0.0.1 --port 3001
```

Stop the production server before rebuilding that directory. For hosting, the ordinary `npm run build` and `npm start` commands work with the default `.next` directory.

## What works

- Russian-first website: new visitors and invalid language cookies default to Russian. An explicit English choice is remembered. Page titles and metadata follow the selected language.
- Responsive home, catalogue, URL-based filters/search, book details, keyboard-accessible sample viewer, help centre and account screens.
- CSS 3D book covers, lightweight scroll reveals, page-viewer transitions, reduced-motion handling.
- Amir personalization setup: first name, age, local photo validation, parent/guardian consent, editable review. Photos use temporary browser object URLs; no upload, browser storage, payment or generation occurs.
- Two-page-preview → checkout → payment confirmation → book-progress/download UI, with expired/failed/unavailable states and an explicit zero-cost demo. See [purchase-flow implementation and remaining integration](docs/purchase-flow.md).
- Explicit disconnected/empty account states, error recovery UI and actual HTTP 404 responses.
- Optimized local images and fonts, security headers, separate route bundles, preview-only indexing policy.

The website language does **not** translate the source book. The Amir sample is Russian. Fluffy and ABC are English, branded reference samples, and cannot be personalized here.

## What is not connected

This is not yet a live selling or book-generation service. The Supabase account/database foundation is now connected: verified-session account/library APIs, owner-only database access, an Amir catalog entry and private storage buckets. See [applied backend setup and verification](docs/supabase-setup.md). Production email delivery and full inbox-based registration/recovery tests are still pending. The personalization API remains HTTP 503: payment, uploads, worker jobs and customer PDF delivery are not connected yet.

Do not turn the review confirmation into a fake success state. Default mode says the service is unavailable. Demo mode explicitly labels original illustrations, example prices and simulated payment; it never offers a fake personalized PDF.

Before launch:

1. Approve original/licensed artwork and replace branded reference books. Confirm ownership and permitted use of every source, including Amir.
2. Finish SMTP and real-account signup/recovery tests; connect private uploads with a child-photo retention/deletion policy. Account sessions and database ownership rules are already prepared.
3. Add a server-side order/job API and a separate worker connected to the existing ChildBook workflow. Never expose generation credentials to the browser.
4. Add payment confirmation, idempotent job creation, per-book spend limits, bounded retries, page-level resume, progress, failures and authenticated final downloads.
5. Run real payment/auth/generation end-to-end tests, concurrent-job tests, provider-outage tests and real iOS/Safari/Android checks.
6. Publish privacy/terms/support details, deploy to the chosen domain and measure real-user performance.

## Environment

No secret was added to the repository.

- `NEXT_PUBLIC_SITE_URL`: final HTTPS origin for metadata and HSTS; rebuild after setting it.
- `WONDER_PUBLIC_INDEXING=true`: allows catalogue indexing. Leave unset until launch requirements above are met. This is a build-time deployment decision for robots.txt.
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (or legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY`): account connection, configured locally in ignored `.env.local`. Use only a public anon/publishable key in browser code; never a service-role secret. The current CSP accepts an HTTPS standard project domain ending in `.supabase.co`. Custom domains need a reviewed CSP update.
- `WONDER_LEGACY_DEMOS=true`: explicitly exposes the unrelated old Telegram mockup for local development. Leave unset on a public deployment. The original source is preserved.
- `WONDER_BUILD_DIR`: optional separate output directory for build/test isolation.
- `WONDER_FLOW_DEMO=true`: enables the zero-cost purchase demonstration at `/books/amir-and-new-friends/personalize?demo=1`. Off by default; leave unset on public deployments. It does not enable paid calls or uploads.
- `WONDER_EXPECT_DEMO=true`: use for the HTTP purchase test when the target server enables the demo.
- `WONDER_TEST_URL`: browser-test target, default http://127.0.0.1:3001.

The old Supabase diagnostic route is not exposed. Client UI is not an authorization boundary; future sensitive reads/writes must be checked on the server.

## Repeatable verification

Start the production preview first. Browser checks use Playwright with a locally installed Chrome; they create an isolated headless profile, not your signed-in browser.

```sh
npm run lint
npm test
npm run test:purchase
npm run test:e2e
npm run test:a11y
npm audit --audit-level=low
```

Browser screenshots and reports are generated under `artifacts/website/` (gitignored). Browser tests use fictional marketing artwork as a local file-validation fixture, not a real child's photo, and assert that the wizard sends no POST/PUT/PATCH requests.

See [website verification and launch status](docs/website-redesign.md) for measured results and limitations, and [asset provenance](docs/website-assets.md) for exact generation prompts and source artwork.

## Structure

- `src/app/`: server-rendered routes, metadata, global styling and error boundaries.
- `src/components/wonder/`: new design system and isolated interactive components.
- `src/lib/catalog.js`: three source-book definitions and personalization eligibility.
- `src/lib/personalization.js`: pure name/file/dimension validation.
- `scripts/prepare-book-assets.mjs`: optional local PDF-to-WebP preparation; requires Poppler and the designer PDFs. Runtime does not need those PDFs.
- `tests/` and `scripts/test-*.mjs`: repeatable verification.

Legacy unreferenced components and unrelated import scripts are preserved. Public pages no longer mount the old global Chakra/auth loading stack. CSS handles decorative depth without a WebGL engine or autoplay video.

## Technical notes

Next.js is pinned to 15.5.25 with matching ESLint config; compatible security fixes are locked for React, PostCSS and Sharp. Node runtime is intentional; this is not a static export. Metadata is resolved before streaming. There is no root loading boundary: it caused a footer layout jump and turned missing-book responses into streamed HTTP 200s. Loading UI is scoped where needed.

CSP still permits inline Next.js bootstrap scripts/styles. A strict nonce-based CSP can be added when the production auth/payment domains and hosting strategy are settled; it must be verified with those integrations.

References: [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist), [loading and streaming semantics](https://nextjs.org/docs/14/app/building-your-application/routing/loading-ui-and-streaming).
