import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
const baseURL = process.env.WONDER_TEST_URL || "http://127.0.0.1:3001";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const reports = [];
async function scan(page, route, width) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
    .analyze();
  reports.push({
    route,
    width,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
  console.log(`${width} ${route}: ${result.violations.length} violations`);
}
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await context.addCookies([
      { name: "wonder-language", value: "en", url: baseURL },
    ]);
    for (const route of [
      "/",
      "/books",
      "/books/amir-and-new-friends",
      "/books/amir-and-new-friends/personalize",
      "/support",
      "/login",
      "/register",
      "/reset",
      "/my-books",
      "/orders",
      "/account",
    ]) {
      await page.goto(baseURL + route, { waitUntil: "networkidle" });
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze();
      reports.push({
        route,
        width,
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
      console.log(`${width} ${route}: ${result.violations.length} violations`);
    }
    await page.goto(baseURL + "/books/amir-and-new-friends");
    await page.getByRole("button", { name: "Enlarge sample" }).click();
    await scan(page, "sample-dialog-open", width);
    await page.keyboard.press("Escape");
    await page.goto(baseURL + "/books/amir-and-new-friends/personalize");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await scan(page, "wizard-name-error", width);
    await page.getByLabel("Child’s first name").fill("Émile");
    await page.getByLabel("Child’s age", { exact: true }).selectOption("5");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await scan(page, "wizard-photo-empty", width);
    await page
      .locator("#child-photo")
      .setInputFiles(path.resolve("public/images/reading-together.webp"));
    await page.locator(".photo-selected").waitFor();
    await scan(page, "wizard-photo-selected", width);
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await scan(page, "wizard-review", width);
    await page.getByRole("button", { name: "Continue to preview" }).click();
    await scan(page, "preview-unavailable", width);
    await context.close();
  }
} finally {
  await browser.close();
  await mkdir("artifacts/website", { recursive: true });
  await writeFile(
    "artifacts/website/accessibility.json",
    JSON.stringify(reports, null, 2),
  );
}
if (reports.some((r) => r.violations.length)) process.exitCode = 1;
