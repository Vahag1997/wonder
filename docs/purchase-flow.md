# Preview before payment — website implementation

2026-09-13. **Website UI and API contract prepared; live commerce integration is NOT implemented.** No real generation, uploads, payment, database changes or deployment were performed. Sites building guidance was used to extend the existing Next.js design, preserve its Node runtime, and distinguish test screens from real order fulfillment. Existing illustrations are reused; no new art was generated.

## Customer journey

1. Choose an eligible designer book. Reference-only books remain blocked.
2. Enter a first name and age (1–12 years for this first UI version; no birth date), choose a validated photo and give guardian consent.
3. Review details. Future live integration generates exactly two approved preview pages, not a full book. The UI already includes queued, generating, ready, expired and failed states.
4. View both images and approve the result. Checkout is disabled if images fail, approval is absent, or the server quote/preview expires.
5. Review the total and digital-PDF format. No subscription, printing or shipping. Actual pricing is not configured; 1,990 RUB is labelled as an example **only in the demo**.
6. Go to the payment provider. Payment pending/cancelled/failed is not a completed purchase. Only a verified server payment event can start the remaining pages.
7. The worker reuses the preview artifacts, completes the remaining pages, checks the result and assembles the final PDF. The UI supports waiting, paid-generation failure and authorized download.

Current default behavior stops at an honest unavailable state, not fake personalized images. Photo bytes remain in the tab. `?paid=true` cannot unlock anything. Unpaid/unfinished download responses and unexpected image/redirect URLs are rejected by the client contract; these checks supplement, and do not replace, server authorization.

## Zero-cost demonstration

Start the existing production preview with:

```sh
WONDER_BUILD_DIR=.next-production WONDER_FLOW_DEMO=true npm run start -- --hostname 127.0.0.1 --port 3001
```

Open `/books/amir-and-new-friends/personalize?demo=1`. The flag is server-controlled and off by default. The query alone cannot enable it. The demo uses local original illustrations and local transient state; no request is made with a child’s photo. It is intentionally not durable and clearly resets on reload. It is not a live order system.

The demo can show cancelled and successful payment, continue to completion, and demonstrate the PDF delivery screen without manufacturing a downloadable “personalized” PDF. Every stage labels the source artwork, illustrative price and simulated payment. Keep the flag unset on public deployments.

## Server contract to implement next

All paths below currently fail closed with HTTP 503 and `Cache-Control: private, no-store`. The handler does not read/store the uploaded body, make external requests or create orders. A query or environment flag cannot enable live generation.

| Endpoint | Required future behavior |
| --- | --- |
| `POST /api/personalizations` | Verify session/consent, revalidate photo, strip metadata, enforce per-customer and global preview budgets; resolve licensed book and price server-side; atomically create/reuse draft keyed by customer + Idempotency-Key + request fingerprint; queue only the two-page preview. |
| `GET /api/personalizations/:id` | Check ownership, return public state, exact two preview media references, server quote, expiration and (only on paid verified completion) download endpoint. Never expose engine tokens. |
| `GET /api/personalizations/:id/pages/:pageId` | Check ownership/retention and that this is one of the two released previews. Stream private image with no-store headers. Never expose the whole book here. |
| `POST /api/personalizations/:id/checkout` | Check owner, preview readiness/approval, frozen revision and unexpired server quote. Reuse checkout idempotency key. Client supplies quote ID, not price. Return only the same-origin checkout redirect route. |
| `GET /api/personalizations/:id/checkout/redirect` | Verify owner; redirect to an allowlisted payment-provider session previously created by POST. GET must not create a payment or generation job. |
| Payment webhook (provider-specific) | Verify signature and merchant account, amount/currency/order reference; atomically deduplicate payment event and persist one completion-dispatch request. Reconcile lost dispatches. |
| `GET /api/personalizations/:id/download` | Verify owner, payment, release checks and retention again; stream or redirect to a short-lived private PDF URL. Reject unpaid, failed or expired jobs even if a URL is guessed. |

`purchase-flow.js` validates the public response shape. IDs are opaque, not authorization. Media paths must belong to that order. Amounts are integer minor units, current currency RUB. `purchase-client.js` separates network calls from the UI and preserves idempotency keys on retry. Its timeout is not proof a server action failed; reconcile uncertain operations before changing input or creating a new draft.

Return path for checkout: `/books/:slug/personalize?order=:id`. It only fetches server status; it ignores payment-success claims in the URL. Link this same customer-owned order from **Мои книги** once account/order storage is connected. Restore child/book details from the verified server record, not browser storage. Displayed book slug must be checked against that record by the backend integration.

## Necessary integration work — not solved by adding a key

- Resolve production customer identity, private storage region, retention/deletion and supported payment provider for **Russia first**. Replace the current demo consent text with the actual processing notice before any upload is enabled.
- Confirm an image-provider arrangement permitted for the target customers. The current Gemini Developer API’s available-region and API-client restrictions need resolution for Russia; do not treat foreign hosting alone as approval. See [available regions](https://ai.google.dev/gemini-api/docs/available-regions) and [terms](https://ai.google.dev/gemini-api/terms).
- Extend the existing worker with preview-only and paid-completion stages. **Do not connect free preview to the existing full-book `/api/personalize` endpoint.** Freeze child identity anchor, name, age, template version, style settings and exact preview output hashes. Resume that snapshot after payment; never regenerate approved preview pages as a side effect.
- Enforce retry/abuse limits and a global daily spend cap on the server, not browser counters. Changes to photo/name/book after preview require a new revision and count toward the allowance. Never charge twice after payment failure or a lost response.
- Add verified payment recovery/refund, customer-owned My Books records and actual support/privacy/terms information. The current support screen is not a staffed recovery service.
- Verify the entire real connection in sandbox with a stub image provider, then a separately budget-approved real book. No production-readiness or quality guarantee is implied by the UI tests.

## Verification

`npm test` covers age, public response validation, payment gates, expiry, media isolation, safe checkout redirect, idempotency transport, errors and a complete simulated journey. `npm run test:purchase` checks Russian/English server-rendered controls and fail-closed HTTP routes. Set `WONDER_EXPECT_DEMO=true` when testing a demo-enabled server. Existing browser test selectors are updated for the new age and preview steps; a fresh browser/visual review remains necessary before release.

Native Next.js hosting is preserved. This is not a Cloudflare Worker build or a published Sites deployment; moving it to that runtime would be a separate migration, not a prerequisite to connecting the agreed server workflow.
