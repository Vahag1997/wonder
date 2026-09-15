import assert from "node:assert/strict";
import { mkdir, writeFile, stat } from "node:fs/promises";
import { chromium } from "playwright";
import path from "node:path";

const baseURL = process.env.WONDER_TEST_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const checks = [];
const errors = [];
let completed = false;
await mkdir("artifacts/website", { recursive: true });
function record(name) {
  checks.push(name);
  console.log(`PASS ${name}`);
}
async function assertPage(page) {
  await page.locator("h1").first().waitFor();
  assert.equal(await page.locator("h1").count(), 1, "One primary heading");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 1,
  );
  assert.equal(overflow, false, "No horizontal overflow");
  const collapsedCovers = await page
    .locator(".book-card-art .book-object")
    .evaluateAll(
      (covers) =>
        covers.filter((cover) => cover.getBoundingClientRect().width < 20)
          .length,
    );
  assert.equal(collapsedCovers, 0, "Book covers have a visible layout size");
  await page.evaluate(() => document.fonts.ready);
}
async function capture(page, name) {
  for (
    let y = 0;
    y < (await page.evaluate(() => document.body.scrollHeight));
    y += 600
  ) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({
    path: `artifacts/website/${name}.png`,
    fullPage: true,
  });
}
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await context.addCookies([
    { name: "wonder-language", value: "en", url: baseURL },
  ]);
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !message.text().includes("404"))
      errors.push(message.text());
  });
  const response = await page.goto(baseURL, { waitUntil: "networkidle" });
  assert.equal(response.status(), 200);
  assert.equal(response.headers()["x-content-type-options"], "nosniff");
  assert.equal(response.headers()["x-frame-options"], "DENY");
  assert(
    response
      .headers()
      ["content-security-policy"]?.includes("frame-ancestors 'none'"),
  );
  assert.equal(response.headers()["x-powered-by"], undefined);
  await assertPage(page);
  assert(
    (
      await page.locator('meta[name="robots"]').getAttribute("content")
    ).includes("noindex"),
  );
  record("Homepage, production security headers, preview indexing policy");
  await capture(page, "home-desktop");
  const broken = await page
    .locator("img")
    .evaluateAll((images) =>
      images
        .filter((img) => !img.complete || img.naturalWidth === 0)
        .map((img) => img.currentSrc),
    );
  assert.deepEqual(broken, []);
  record("All homepage images load");
  await page.getByRole("button", { name: /Переключить на русский/ }).click();
  await page.waitForFunction(() => document.documentElement.lang === "ru");
  assert.match(await page.locator("h1").innerText(), /Маленький/);
  await page.reload();
  assert.equal(await page.locator("html").getAttribute("lang"), "ru");
  await page.getByRole("button", { name: /Switch to English/ }).click();
  await page.waitForFunction(() => document.documentElement.lang === "en");
  record("English/Russian switch survives reload without hydration errors");
  await page
    .getByRole("link", { name: "Find their story", exact: true })
    .first()
    .click();
  await page.waitForURL("**/books");
  await assertPage(page);
  assert.equal(await page.locator(".book-card").count(), 3);
  await page.getByRole("button", { name: "Friendship", exact: true }).click();
  await page.waitForURL("**theme=friendship");
  assert.equal(await page.locator(".book-card").count(), 1);
  await page.goBack();
  await page.waitForURL("**/books");
  assert.equal(await page.locator(".book-card").count(), 3);
  record("Catalogue themes and browser back navigation");
  await page
    .getByRole("textbox", { name: "Search stories", exact: true })
    .fill("no matching story xyz");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page
    .getByRole("heading", { name: "That story is still hiding." })
    .waitFor();
  await page.getByRole("button", { name: "Show all stories" }).click();
  await page.waitForURL("**/books");
  assert.equal(await page.locator(".book-card").count(), 3);
  record("Search, empty state, and reset");
  await capture(page, "catalog-desktop");
  await page.locator(".book-card-art").first().click();
  await page.waitForURL("**/books/amir-and-new-friends");
  await assertPage(page);
  await page
    .getByRole("button", { name: "Next sample", exact: true })
    .first()
    .click();
  assert.match(
    await page.locator(".gallery-controls").first().innerText(),
    /2 \/ 3/,
  );
  await page.getByRole("button", { name: "Enlarge sample" }).click();
  assert.equal(await page.locator("dialog").evaluate((el) => el.open), true);
  await page.keyboard.press("ArrowRight");
  assert.match(
    await page.locator("dialog .gallery-controls").innerText(),
    /3 \/ 3/,
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("dialog").evaluate((el) => el.open), false);
  assert.equal(
    await page.evaluate(() => document.documentElement.style.overflow),
    "",
  );
  record(
    "Book samples, full-screen viewer, arrows, Escape, and scroll restoration",
  );
  await capture(page, "story-desktop");
  await page.getByRole("link", { name: "Make it their story" }).click();
  await page.waitForURL("**/personalize");
  await assertPage(page);
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.locator("#wizard-error").waitFor();
  assert.match(await page.locator("#wizard-error").innerText(), /enter/);
  await page.getByLabel("Child’s first name").fill("Amir123");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.match(await page.locator("#wizard-error").innerText(), /letters/);
  await page.getByLabel("Child’s first name").fill("  Émile  ");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.match(await page.locator("#wizard-error").innerText(), /age/);
  await page.getByLabel("Child’s age", { exact: true }).selectOption("5");
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("heading", { name: "Let’s meet that little smile." })
    .waitFor();
  record("Name validation and Unicode normalization");
  const outbound = [];
  const track = (request) => {
    if (["POST", "PUT", "PATCH"].includes(request.method()))
      outbound.push(request.url());
  };
  page.on("request", track);
  await page.locator("#child-photo").setInputFiles({
    name: "fake.png",
    mimeType: "image/png",
    buffer: Buffer.from("not an image"),
  });
  await page.locator("#wizard-error").waitFor();
  assert.match(await page.locator("#wizard-error").innerText(), /valid/);
  record("Renamed non-images are refused");
  await page
    .locator("#child-photo")
    .setInputFiles(path.resolve("public/images/reading-together.webp"));
  await page.locator(".photo-selected").waitFor();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.match(await page.locator("#wizard-error").innerText(), /parent/);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page
    .getByRole("heading", { name: "It’s all coming together." })
    .waitFor();
  assert.equal(await page.locator(".review-details h2").innerText(), "Émile");
  await page.getByRole("button", { name: "Continue to preview" }).click();
  assert.equal(
    await page
      .getByRole("button", { name: "Preview coming soon" })
      .isDisabled(),
    true,
  );
  assert.deepEqual(outbound, []);
  assert.equal(
    await page.evaluate(() => localStorage.length + sessionStorage.length),
    0,
  );
  record("Photo, consent, review, and zero network uploads or paid calls");
  await capture(page, "personalization-review-desktop");
  await page.getByRole("button", { name: "Edit their details" }).click();
  assert.equal(
    await page.getByLabel("Child’s first name").inputValue(),
    "Émile",
  );
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  assert.equal(await page.locator(".photo-selected").count(), 1);
  await page.getByRole("button", { name: "Remove photo" }).click();
  assert.equal(await page.locator(".photo-selected").count(), 0);
  record("Back/edit retain state; removing photo clears its preview");
  page.on("dialog", (dialog) => dialog.accept());
  for (const route of [
    "/login",
    "/register",
    "/reset",
    "/my-books",
    "/orders",
    "/account",
  ]) {
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    await assertPage(page);
    // Both a configured, signed-out backend and a disconnected preview must
    // render an auth form, never fabricated customer records.
    await page.locator(".auth-card").waitFor();
    assert.equal(await page.locator(".record-list article").count(), 0);
  }
  record("Signed-out account routes show auth forms without customer records");
  await page.goto(baseURL + "/support", { waitUntil: "networkidle" });
  await assertPage(page);
  await page
    .getByRole("searchbox", { name: "Search help questions" })
    .fill("photo");
  assert((await page.locator(".support-faq details").count()) > 0);
  await page.getByRole("searchbox").fill("zzzzzz");
  await page.getByRole("button", { name: "Show all answers" }).click();
  assert.equal(await page.locator(".support-faq details").count(), 9);
  record("Help search, empty state, and reset");
  for (const route of ["/books/maksim-and-fluffy", "/books/the-abc-journey"]) {
    await page.goto(baseURL + route, { waitUntil: "networkidle" });
    assert.match(
      await page.locator("main").innerText(),
      /reference.*not a Wonder book/s,
    );
    assert.equal(
      await page.getByRole("link", { name: "Make it their story" }).count(),
      0,
    );
  }
  record("Branded reference books cannot enter personalization");
  await page.goto(baseURL + "/books/maksim-and-fluffy/personalize");
  await page.waitForURL("**/books/maksim-and-fluffy");
  record("Unsupported personalization URL redirects safely");
  const missing = await page.goto(baseURL + "/books/does-not-exist");
  assert.equal(missing.status(), 404);
  await page.getByRole("heading", { name: /wandered/ }).waitFor();
  record("Unknown books return a real 404");
  const missingWizard = await page.goto(
    baseURL + "/books/does-not-exist/personalize",
  );
  assert.equal(missingWizard.status(), 404);
  record("Unknown personalization routes return a real 404");
  for (const route of ["/supabase-test", "/telegram", "/does-not-exist"]) {
    const unavailable = await page.goto(baseURL + route);
    assert.equal(unavailable.status(), 404);
  }
  record("Legacy demos, diagnostics, and unknown routes are not public pages");
  const retired = await page.goto(baseURL + "/books/space-cadet-dreams");
  assert(retired.url().endsWith("/books"));
  record("Retired catalogue links redirect to the current collection");
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 320, height: 700 },
  ]) {
    await page.setViewportSize(viewport);
    for (const route of [
      "/",
      "/books",
      "/books/amir-and-new-friends",
      "/books/amir-and-new-friends/personalize",
      "/support",
      "/login",
    ]) {
      await page.goto(baseURL + route, { waitUntil: "networkidle" });
      await assertPage(page);
    }
    record(`No horizontal overflow on six routes at ${viewport.width}px`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(baseURL);
  await page.getByRole("button", { name: "Open menu" }).click();
  assert.equal(await page.locator("#mobile-navigation").isVisible(), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.locator("#mobile-navigation").isVisible(), false);
  assert.equal(
    await page
      .getByRole("button", { name: "Open menu" })
      .evaluate((el) => document.activeElement === el),
    true,
  );
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .locator("#mobile-navigation")
    .getByRole("link", { name: "Books", exact: true })
    .click();
  await page.waitForURL("**/books");
  assert.equal(await page.locator("#mobile-navigation").isVisible(), false);
  record("Mobile menu, Escape focus restoration, and navigation");
  await page.goto(baseURL);
  await capture(page, "home-mobile");
  await page.goto(baseURL + "/books");
  await capture(page, "catalog-mobile");
  await page.goto(baseURL + "/books/amir-and-new-friends/personalize");
  await capture(page, "personalization-mobile");
  await page.goto(baseURL);
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  await assertPage(page);
  record("Homepage stays within viewport at 200% text size");
  assert.deepEqual(errors, [], "No browser runtime or console errors");
  record("No browser runtime or console errors");
  const bytes = (
    await Promise.all(
      [
        "public/images/storybook-forest.webp",
        "public/images/reading-together.webp",
      ].map((f) => stat(f)),
    )
  ).map((s) => s.size);
  assert(bytes.every((size) => size < 300000));
  record("Generated marketing images below 300 KB each");
  const motionContext = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "no-preference",
  });
  const motionPage = await motionContext.newPage();
  await motionContext.addCookies([
    { name: "wonder-language", value: "en", url: baseURL },
  ]);
  motionPage.on("pageerror", (error) => errors.push(error.message));
  await motionPage.goto(baseURL, { waitUntil: "networkidle" });
  const bookLink = motionPage.locator(".book-card-art").first();
  const cover = bookLink.locator(".book-object");
  const resting = await cover.evaluate((el) => getComputedStyle(el).transform);
  await bookLink.hover();
  await motionPage.waitForTimeout(750);
  assert.notEqual(
    await cover.evaluate((el) => getComputedStyle(el).transform),
    resting,
  );
  const bookBox = await cover.boundingBox();
  assert(bookBox.width > 20 && bookBox.height > 20, "Cover is visibly sized");
  await capture(motionPage, "home-desktop-motion");
  await motionPage.screenshot({
    path: "artifacts/website/home-desktop-viewport.png",
  });
  assert.equal(
    await motionPage.locator(".will-reveal:not(.is-visible)").count(),
    0,
  );
  await motionPage.setViewportSize({ width: 390, height: 844 });
  await motionPage.goto(baseURL);
  await motionPage.screenshot({
    path: "artifacts/website/home-mobile-viewport.png",
  });
  await motionContext.close();
  record(
    "Book hover responds; scroll reveals finish with standard motion enabled",
  );
  const noJsContext = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJsContext.newPage();
  await noJsContext.addCookies([
    { name: "wonder-language", value: "en", url: baseURL },
  ]);
  await noJsPage.goto(baseURL);
  assert.match(await noJsPage.locator("h1").innerText(), /A little person/);
  assert.equal(await noJsPage.locator(".book-card").count(), 3);
  assert.match(
    await noJsPage.locator("noscript p").innerText(),
    /Enable JavaScript/,
  );
  await noJsContext.close();
  assert.deepEqual(errors, []);
  record("Server-rendered home remains readable without JavaScript");
  await context.close();
  completed = true;
} finally {
  await browser.close();
  await writeFile(
    "artifacts/website/browser-checks.json",
    JSON.stringify(
      {
        baseURL,
        completed,
        checkedAt: new Date().toISOString(),
        checks,
        errors,
      },
      null,
      2,
    ),
  );
}
console.log(`Verified ${checks.length} browser checks.`);
