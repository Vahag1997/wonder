# Wonder backend foundation — 2026-09-13

## Connected and applied

Target project: `uvosriooywkdckotnvsv`, Stockholm, Free plan. The website's ignored `.env.local` holds only its public URL and existing public anon key. No service-role credential is in the website/browser, and no generation request was made.

- Browser and Next.js server use compatible Supabase SSR cookie sessions (`@supabase/ssr` 0.12.7, supabase-js 2.116.0). Middleware refreshes sessions; server APIs verify identity using `getUser()` and never trust `getSession()` for authorization.
- Registration, sign-in, sign-out, password-reset request, PKCE callback and recovery form are wired. Redirect destinations are explicitly allowed internal routes; account responses are private/no-store. Recovery requires a session, not merely a URL flag.
- `/api/account` exposes the verified current account. `/api/library` returns only the owner's book/order summaries. It never returns arbitrary stored file URLs or the private data JSON.
- Database row-level security enabled on products, profiles, orders and my_books. Anonymous clients may read active product metadata only. Signed-in clients may read their own profile, orders and books only. No direct customer insert/update/delete/truncate privileges; payment and generation state are server-controlled.
- Existing new-user profile trigger hardened, missing profile backfilled, ownership/FK indexes added, provider-payment unique key prepared. Existing users preserved.
- Amir catalog entry: `amir-and-new-friends`, workflow template `amir-new-cover-20x20`, 19 pages, Russian. Zero price is an **unset placeholder**, not a free offer. `checkout_enabled=false`. Other website books remain reference-only.
- Four private buckets: `child-photos` (10 MB image limit), `book-previews`, `finished-books` (PDF only), `book-templates`. No browser storage access policies. Buckets are empty: the source PDF/template bundle has not yet been uploaded, and no child photos were transferred.
- Columns prepared for consent version/time, expiry, template version, private media paths, linked orders and payment identifiers. These do not constitute a running retention job or generation queue.
- Auth: email confirmation now required; minimum password length 12; email link lifetime 1,800 seconds; secure password change enabled. Anonymous sign-in and manual account linking remain off; secure email change remains on. Existing passwords are not changed. Leaked-password protection requires a paid Supabase plan and was not purchased.

## Verification

- `npm run lint`, production build, and all 19 unit tests passed during setup.
- Applied database audit: RLS on all four tables; only intended SELECT grants; all four buckets private; no storage client policies; zero missing profiles.
- `supabase/setup/verify-ownership.sql` passed against the actual database: own records readable, another identity sees no customer records, attempts to mark books/orders paid denied. All temporary test rows were rolled back.
- Public REST requests returned Amir metadata and denied anonymous access to profiles/orders/my_books with permission errors.
- Website account/library APIs reject unauthenticated requests and do not cache private responses.
- The complete read-only Supabase connection smoke script passed after fixing a global header override so authentication callbacks use `Referrer-Policy: no-referrer`.
- Browser checks on the new production build: Russian registration renders, required empty fields block submission, unauthenticated recovery is disabled with an explanatory message, and the private library asks for sign-in. No browser warnings/errors were captured in these checks. No real account/password was entered.
- Purchase HTTP regression: Russian/English forms and all 21 disabled upload/payment/media/PDF requests passed. npm audit reported zero known dependency vulnerabilities.
- Repeat read-only checks with `node --env-file=.env.local scripts/test-supabase-connection.mjs` (set `WONDER_TEST_URL` if using another port).
- Callback follow-up: connection smoke checks passed again; signup and reset subjects/bodies changed to Russian, retaining `{{ .ConfirmationURL }}` and adding same-browser PKCE instructions. Both persisted templates were verified by revisiting/reloading the dashboard. Reproducible bodies are in `supabase/templates/`; subjects are «Подтвердите email — Wonder» and «Восстановление пароля — Wonder». All **20** unit tests now pass, including the auth-email link preservation test. No delivery test is implied by these checks.

## Deferred / not production-ready

1. **Email delivery:** dashboard still uses Supabase's built-in test sender, not custom SMTP. It is not a production sender and restricts recipients/rates. Full signup → inbox confirmation → login and reset → inbox → password change have **not** been end-to-end verified. Do not claim registration is production-ready. Default PKCE links must be opened in the browser that started the request.
2. **Temporary URL:** Site URL remains `http://localhost:3000`. On the follow-up authorization, `http://localhost:3000/auth/callback**` was saved and visibly verified in the dashboard (one redirect entry). This supports the callback's encoded internal `next` parameter without allowing other hosts. Use **localhost**, not the alternative 127.0.0.1 hostname, for email-flow testing. Replace this development pattern with the final exact HTTPS callback at launch. The user explicitly deferred choosing a domain/email provider.
3. **Uploads and generation:** `/api/personalizations` deliberately remains HTTP 503. Before enabling: server-only credentials, owned drafts, MIME/size verification, consent, rate limits, retention/cleanup, versioned Amir assets, durable worker queue, idempotency, spend caps, bounded retries, signed worker callbacks, private preview delivery. Existing ChildBook/Gemini workflow remains separate and unchanged.
4. **Payment and PDF:** provider/price/currency approval, verified idempotent payment webhook and paid-owner PDF delivery still need implementation. A paid flag in the browser is never authorization.
5. **Launch:** hosting, SMTP, real-account recovery testing, payment/generation end-to-end tests, backups/restore test, monitoring, privacy/support details and final security review.

## Reproducible changes

`supabase/setup/wonder-foundation.sql` records the reviewed dashboard transaction (not a fabricated CLI migration). It preserves existing rows. Future migrations should be generated through the project's migration workflow and checked against this already-applied baseline before execution.

Local verified preview currently uses `http://localhost:3000`, served by `WONDER_BUILD_DIR=.next-supabase-check npm run start -- --hostname 127.0.0.1 --port 3000`. Stop that server before rebuilding the same output directory. The older port-3001 preview is not this updated build. Local callback allowlisting is saved.

### Inbox-dependent acceptance test (still pending)

1. Open `http://localhost:3000/register` and register using an email belonging to a member of this Supabase organization. The built-in sender rejects other recipients. The user enters their own password; never share it in chat.
2. Open the confirmation link in the **same browser** that started registration (PKCE verifier cookie). Confirm it returns to the local website and the private library opens.
3. Sign out, then sign back in. Confirm account identity and an empty private library, not someone else's data.
4. Request password recovery at `/reset`, open the new email link in the same browser, set a new password, sign out and verify the new password works.
5. The built-in sender currently permits only two emails per hour; do not repeatedly resend. Stop on a rate-limit error. This test proves the local flow for a permitted recipient, not production delivery to arbitrary customers.

No user was created and no email/password request was submitted by the agent during the callback follow-up. Custom SMTP still requires the user's email-provider account and sender setup; nothing was purchased or silently configured.

Guidance used: [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [custom SMTP requirements](https://supabase.com/docs/guides/auth/auth-smtp), [row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security).
