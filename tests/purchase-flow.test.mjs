import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePurchase,
  canCheckout,
  purchaseStep,
  formatPrice,
  safeId,
} from "../src/lib/purchase-flow.js";
import { createPurchaseClient } from "../src/lib/purchase-client.js";
import { createDemoPurchaseClient } from "../src/lib/purchase-demo.js";
import { validateAge } from "../src/lib/personalization.js";
import { books } from "../src/lib/catalog.js";

function fixture(overrides = {}) {
  return {
    id: "order-123",
    status: "preview_ready",
    paid: false,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
    pages: [1, 2].map((i) => ({
      id: `page-${i}`,
      url: `/api/personalizations/order-123/pages/page-${i}`,
    })),
    quote: {
      id: "quote-123",
      amountMinor: 199000,
      currency: "RUB",
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    },
    download: null,
    ...overrides,
  };
}
test("age must be a whole number from 1 to 12, with no birth date collected", () => {
  for (const age of [1, "5", 12])
    assert.equal(validateAge(age).value, Number(age));
  for (const age of [
    null,
    "",
    "1.5",
    "2e0",
    "-1",
    0,
    13,
    "2020-01-01",
    Infinity,
  ])
    assert.equal(validateAge(age).error, "age");
});
test("checkout needs a complete preview and an unexpired server price", () => {
  const job = parsePurchase(fixture());
  assert(canCheckout(job));
  assert(!canCheckout({ ...job, paid: true }));
  assert(!canCheckout({ ...job, pages: [] }));
  assert(!canCheckout({ ...job, status: "payment_pending" }));
  assert(!canCheckout({ ...job, quote: null }));
  assert(!canCheckout({ ...job, expiresAt: new Date(0).toISOString() }));
  assert(!canCheckout(job, Date.parse(job.quote.expiresAt)));
  assert.match(formatPrice(job.quote), /1\s990/);
});
test("unpaid or unfinished books can never include a download", () => {
  for (const status of ["paid", "book_generating", "book_failed", "completed"])
    assert.throws(() => parsePurchase(fixture({ status, paid: false })));
  assert.throws(() =>
    parsePurchase(
      fixture({ download: "/api/personalizations/order-123/download" }),
    ),
  );
  assert.throws(() =>
    parsePurchase(fixture({ status: "completed", paid: true })),
  );
  const complete = parsePurchase(
    fixture({
      status: "completed",
      paid: true,
      download: "/api/personalizations/order-123/download",
    }),
  );
  assert.equal(complete.status, "completed");
  assert.equal(purchaseStep(complete.status), 2);
});
test("strict preview contract rejects third-party media, foreign orders, and extra pages", () => {
  for (const url of [
    "https://evil.example/child.jpg",
    "//evil.example",
    "javascript:alert(1)",
    "/api/personalizations/other/pages/page-1",
    "/images/books/amir-3.webp",
  ]) {
    const job = fixture();
    job.pages[0].url = url;
    assert.throws(() => parsePurchase(job));
  }
  assert.throws(() => parsePurchase(fixture({ pages: [] })));
  const extra = fixture();
  extra.pages.push({
    id: "page-3",
    url: "/api/personalizations/order-123/pages/page-3",
  });
  assert.throws(() => parsePurchase(extra));
  const duplicate = fixture();
  duplicate.pages[1] = duplicate.pages[0];
  assert.throws(() => parsePurchase(duplicate));
});
test("invalid amounts, states, IDs, dates and entitlements are rejected", () => {
  for (const amountMinor of [
    0,
    -1,
    19.9,
    Infinity,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    const job = fixture();
    job.quote.amountMinor = amountMinor;
    assert.throws(() => parsePurchase(job));
  }
  for (const update of [
    { status: "success" },
    { paid: "true" },
    { id: "../order" },
    { expiresAt: "tomorrow" },
  ])
    assert.throws(() => parsePurchase(fixture(update)));
  assert(!safeId("order?paid=true"));
  assert(!safeId("x".repeat(81)));
  assert.equal(
    parsePurchase({
      ...fixture(),
      providerKey: "secret",
      access_token: "private",
    }).access_token,
    undefined,
  );
});
test("demo performs the complete two-stage journey without fetching or producing a fake PDF", async () => {
  const demo = createDemoPurchaseClient(books[0]);
  const queued = await demo.create();
  assert.equal(queued.status, "preview_queued");
  assert.equal(queued.pages.length, 0);
  const preview = await demo.get();
  assert.equal(preview.pages.length, 2);
  assert.equal(preview.status, "preview_ready");
  assert.equal((await demo.checkout()).status, "payment_pending");
  assert.equal((await demo.get()).paid, false);
  const failed = await demo.simulatePayment(false);
  assert.equal(failed.status, "payment_failed");
  assert(canCheckout(failed));
  await demo.checkout();
  assert.equal((await demo.simulatePayment(true)).status, "book_generating");
  const completed = await demo.get();
  assert.equal(completed.status, "completed");
  assert.deepEqual(completed.pages, preview.pages);
  assert.equal(completed.download, null);
});
test("client sends only photo/details/consent, never a price or arbitrary designer book", async () => {
  const calls = [];
  const client = createPurchaseClient(async (url, options) => {
    calls.push({ url, options });
    return Response.json(
      fixture({ status: "preview_queued", pages: [], quote: null }),
    );
  });
  const details = {
    name: "Иван",
    age: 5,
    consent: true,
    photo: { file: new File(["fixture"], "photo.jpg", { type: "image/jpeg" }) },
  };
  await client.create(details, books[0], "stable-key");
  await client.create(details, books[0], "stable-key");
  assert.equal(calls[0].url, "/api/personalizations");
  assert.equal(
    calls[0].options.headers["Idempotency-Key"],
    calls[1].options.headers["Idempotency-Key"],
  );
  assert.deepEqual([...calls[0].options.body.keys()].sort(), [
    "bookSlug",
    "childAge",
    "childName",
    "consent",
    "photo",
  ]);
  assert.equal(calls[0].options.cache, "no-store");
  assert.equal(calls[0].options.credentials, "same-origin");
});
test("checkout uses quote ID and stable key, blocks arbitrary redirects", async () => {
  let request;
  const client = createPurchaseClient(async (url, options) => {
    request = { url, options };
    return Response.json({
      redirect: "/api/personalizations/order-123/checkout/redirect",
    });
  });
  await client.checkout(fixture(), "checkout-key");
  assert.deepEqual(JSON.parse(request.options.body), { quoteId: "quote-123" });
  assert.equal(request.options.headers["Idempotency-Key"], "checkout-key");
  for (const redirect of [
    "https://evil.example",
    "//evil.example",
    "/api/personalizations/other/checkout/redirect",
  ]) {
    const unsafe = createPurchaseClient(async () =>
      Response.json({ redirect }),
    );
    await assert.rejects(unsafe.checkout(fixture(), "key"), /invalid_response/);
  }
});
test("client handles limits, disabled services and ownership failures without auto-retrying paid actions", async () => {
  for (const [status, code] of [
    [401, "sign_in"],
    [403, "forbidden"],
    [404, "not_found"],
    [409, "conflict"],
    [410, "expired"],
    [429, "limit"],
    [503, "unavailable"],
  ]) {
    let calls = 0;
    const client = createPurchaseClient(async () => {
      calls++;
      return new Response("", { status });
    });
    await assert.rejects(client.get("order-123"), new RegExp(code));
    assert.equal(calls, 1);
  }
});
