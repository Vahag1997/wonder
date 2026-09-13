import assert from "node:assert/strict";
const base = process.env.WONDER_TEST_URL || "http://127.0.0.1:3001";
const route = "/books/amir-and-new-friends/personalize";
for (const locale of ["ru", "en"]) {
  const response = await fetch(base + route, {
    headers: { Cookie: `wonder-language=${locale}` },
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /id="child-age"/);
  assert.match(html, /id="child-name"/);
  assert.match(html, /noindex/);
  console.log(`PASS ${locale}: server-rendered name/age form and noindex`);
}
for (const path of [
  "",
  "/order-123",
  "/order-123/checkout",
  "/order-123/checkout/redirect",
  "/order-123/pages/page-1",
  "/order-123/download",
  "/order-123?paid=true&demo=1",
]) {
  for (const method of ["GET", "POST", "DELETE"]) {
    const response = await fetch(`${base}/api/personalizations${path}`, {
      method,
      ...(method === "POST"
        ? {
            body: JSON.stringify({
              paid: true,
              amountMinor: 1,
              status: "completed",
            }),
          }
        : {}),
    });
    assert.equal(response.status, 503, `${method} ${path}`);
    assert.match(response.headers.get("cache-control"), /no-store/);
    assert.equal((await response.json()).error.code, "unavailable");
  }
}
console.log(
  "PASS 21 API requests: default-closed uploads, payment, pages and PDF, including forged paid query/body",
);
assert.equal((await fetch(`${base}${route}?order=..%2Fother`)).status, 404);
assert.equal(
  (
    await fetch(`${base}/books/the-abc-journey/personalize?demo=1`, {
      redirect: "manual",
    })
  ).status,
  307,
);
const demo = await (await fetch(`${base}${route}?demo=1`)).text();
assert.equal(
  demo.includes("Демо покупки:"),
  process.env.WONDER_EXPECT_DEMO === "true",
);
console.log(
  "PASS invalid order ID, reference-book gating and server-controlled demo flag",
);
