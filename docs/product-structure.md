# Product structure

**Update 2026-09-13:** the customer journey is now preview-before-payment. The website implementation, two-stage API contract and remaining integration work are documented in [purchase-flow.md](purchase-flow.md). The original payment-first sequence below is superseded: generate only two preview pages before payment, then reuse them when completing the paid book. The confirmed target market is Russia first; provider eligibility and hosting/payment choices still need resolution.

Status: recommended integration plan, not a deployed or verified connection. Russian is the primary website language; an explicit English preference is retained. Sites guidance was used to preserve the existing Next.js structure while localizing the default experience and metadata. Supabase guidance informed the account/storage boundaries below; no remote project was changed.

## Three product parts

1. **Website (`wonder`, Next.js):** Russian-first catalogue, sample viewer, child name/photo/consent, checkout, progress and final downloads. Its server-side routes verify identity and order ownership; the browser never receives generation credentials.
2. **Customer platform (Supabase, subject to region/provider confirmation):** authentication, customer/order/payment records and private files. Parent access is restricted to their own records and objects. Downloads use authorization or short-lived signed links, never public child-photo URLs.
3. **Existing generation service (`ChildBook`):** FastAPI, Redis/Celery workers, Gemini editing, prepared templates, automatic checks, bounded retries/spend, PDF assembly and cleanup. Long-running generation stays in this worker, outside a website HTTP request.

## Reuse what exists

ChildBook already implements `/api/personalize`, job status, PDF/ZIP delivery, cancellation and resume. The one-shot endpoint accepts `child_name`, photos, illustrations, consent and an idempotency key. Its signed job token is a service capability, not customer/payment authorization.

The existing engine keeps job state in Postgres and files in local or S3 storage. Initially preserve that internal implementation; Supabase owns customer/orders data and the mapping to internal job IDs. Do not create another queue or rewrite generation. Consolidating engine tables into a private Supabase schema or configuring its S3-compatible storage is a separate migration requiring compatibility and deletion tests, not something already connected.

## Order flow to implement

1. Parent selects an approved book, enters the child's name, supplies a validated photo and gives informed consent. Book language is separate from website language.
2. The website server creates an order tied to a verified customer. Price and template are resolved on the server, not trusted from the browser.
3. A verified payment event marks the order paid and records a durable dispatch request. A reconciliation process recovers undelivered requests after crashes.
4. Dispatch submits one stable order idempotency key to the existing generation API. Retries reuse it; duplicate payment events or lost responses must not create a second chargeable generation job.
5. The worker processes only approved templates, reports progress and costs, and releases only a completed verified artifact. Closing the browser does not stop the job.
6. The website presents a customer-owned download. Failed jobs show a recoverable failure/refund path, not a fake completed book.

The backend must source the approved designer PDF from its own catalogue; customers do not supply arbitrary replacement books or template settings.

## Deployment and safety

- Keep the two existing repositories. They are one product, not two competing workflows.
- Next.js and the existing API/worker can initially run as separate processes/containers on a normal CPU server behind HTTPS; Supabase is the external customer platform if appropriate for the target market. No GPU/Vast or n8n dependency is required for the current Gemini path.
- Keep the generation API, Redis, engine database and job tokens private. Check ownership again for status, retry, cancellation and download actions.
- Keep provider secrets only in the worker. Restrict privileged Supabase credentials to server-side code and apply RLS/least-privilege policies to customer-accessible tables/files.
- Explicitly reconcile storage deletion and retention across systems. The current engine has a 72-hour job retention policy; copying files elsewhere must not silently bypass it. Longer customer-book retention requires an agreed product/privacy policy and corresponding implementation.
- Monitor failed dispatches, stuck jobs, spending, queue depth and failed deletion. Retry budgets and order idempotency are still required when pages run in parallel.
- Confirm whether the market is residents of Russia or Russian-speaking families elsewhere before choosing production hosting, payment provider and data region. Language alone does not answer that question.

## Current versus next

The website preview and generation code exist separately. The live Wonder account project, payment/order entitlement, secure job bridge and private delivery are not connected or end-to-end verified. The next integration milestone is one test customer completing a mock order through the real job/status/download interface with a stub generation provider and zero paid image calls. A budget-approved real generation test follows only after that integration works.

References: [Supabase server-side authentication](https://supabase.com/docs/guides/auth/server-side/creating-a-client?queryGroups=framework&framework=nextjs), [private storage and access controls](https://supabase.com/docs/guides/storage/buckets/fundamentals). Local implementation evidence: ChildBook `README.md`, `childbook/api/app.py`, `childbook/tasks/celery_app.py`, `docker-compose.yml` and `childbook/config.py`.
