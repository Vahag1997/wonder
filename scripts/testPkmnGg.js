/* eslint-disable no-console */

const axios = require("axios");
const cheerio = require("cheerio");
const { chromium } = require("playwright");

const TARGET_URL =
  "https://www.pkmn.gg/series/mega-evolution/ascended-heroes";
const BASE_URL = "https://www.pkmn.gg";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";
const CARD_PATH_RE = /^\/series\/mega-evolution\/ascended-heroes\/\d+$/i;

function abs(url) {
  if (!url) {
    return null;
  }

  try {
    return new URL(url, BASE_URL).href;
  } catch {
    return url || null;
  }
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function detectCloudflare(html, status) {
  const lower = String(html || "").toLowerCase();
  const markers = [
    "attention required! | cloudflare",
    "just a moment...",
    "cf-browser-verification",
    "cf-challenge",
    "challenge-platform",
    "/cdn-cgi/challenge-platform/",
    "ray id",
  ];

  return (
    status === 403 ||
    status === 429 ||
    markers.some((marker) => lower.includes(marker))
  );
}

function extractCardsFromHtml(html) {
  const $ = cheerio.load(html);
  const seen = new Set();
  const cards = [];

  $("a[href]").each((_, el) => {
    const $link = $(el);
    const href = $link.attr("href");

    if (!href || !CARD_PATH_RE.test(href) || seen.has(href)) {
      return;
    }

    seen.add(href);

    const $cardRoot =
      $link.closest("div[class]") ||
      $link.parent() ||
      $link;

    const name = cleanText($link.text());
    const image =
      $cardRoot.find("img").first().attr("src") ||
      $link.closest("a").find("img").first().attr("src") ||
      null;

    const rarity =
      cleanText(
        $cardRoot
          .find('img[alt]:not([alt=""])')
          .last()
          .attr("alt")
      ) || null;

    const textBits = $cardRoot
      .text()
      .split("\n")
      .map(cleanText)
      .filter(Boolean);

    const number =
      textBits.find((part) => /^#?\d{1,3}$/i.test(part)) ||
      textBits.find((part) => /^#\d{1,3}$/i.test(part)) ||
      null;

    const price =
      textBits.find((part) => /^\$\d+(?:\.\d+)?$/.test(part)) || null;

    cards.push({
      name: name || null,
      number,
      price,
      rarity,
      href: abs(href),
      image: abs(image),
    });
  });

  return cards;
}

async function extractCardsFromPage(page) {
  return page.$$eval(
    "a[href^='/series/mega-evolution/ascended-heroes/']",
    (anchors) => {
      const pathRe = /^\/series\/mega-evolution\/ascended-heroes\/\d+$/i;
      const cleanText = (value) => String(value || "").replace(/\s+/g, " ").trim();
      const seen = new Set();

      function hasRealCardImage(node, cardName) {
        return [...node.querySelectorAll("img")].some((img) => {
          const src = img.currentSrc || img.src || "";
          const alt = cleanText(img.getAttribute("alt"));

          return alt === cardName || src.includes("assets.pkmn.gg");
        });
      }

      function findCardRoot(anchor, cardName) {
        let node = anchor;
        let fallback = anchor.parentElement || anchor;

        while (node && node !== document.body) {
          const text = cleanText(node.textContent);
          const hasCardImage = hasRealCardImage(node, cardName);
          const hasPrice = /\$\d+(?:\.\d+)?/.test(text);
          const hasNumber = /#\d{1,3}\b/.test(text);

          if (hasPrice && hasNumber) {
            fallback = node;
          }

          if (hasCardImage && hasPrice && hasNumber) {
            return node;
          }

          node = node.parentElement;
        }

        return fallback;
      }

      function pickImage(root, cardName) {
        const candidates = [...root.querySelectorAll("img")]
          .map((img) => {
            const src = img.currentSrc || img.src || "";
            const alt = cleanText(img.getAttribute("alt"));

            return { src, alt };
          })
          .filter((item) => item.src && !item.src.startsWith("data:image/svg+xml"));

        return (
          candidates.find((item) => item.alt === cardName)?.src ||
          candidates.find((item) => item.src.includes("assets.pkmn.gg"))?.src ||
          candidates[0]?.src ||
          null
        );
      }

      return anchors
        .map((anchor) => {
          const href = anchor.getAttribute("href");

          if (!href || !pathRe.test(href) || seen.has(href)) {
            return null;
          }

          seen.add(href);

          const name = cleanText(anchor.textContent) || null;
          const root = findCardRoot(anchor, name);
          const text = cleanText(root.textContent);
          const priceMatch = text.match(/\$\d+(?:\.\d+)?/);
          const numberMatch = text.match(/#\d{1,3}\b/);

          const rarity = [...root.querySelectorAll("img[alt]")]
            .map((img) => cleanText(img.getAttribute("alt")))
            .find((alt) => alt && alt !== name);

          return {
            name,
            number: numberMatch ? numberMatch[0] : null,
            price: priceMatch ? priceMatch[0] : null,
            rarity: rarity || null,
            href,
            image: pickImage(root, name),
          };
        })
        .filter(Boolean);
    }
  );
}

async function fetchViaAxios() {
  const response = await axios.get(TARGET_URL, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml",
      "Accept-Language": "en-US,en;q=0.9",
    },
    validateStatus: () => true,
  });

  const html = typeof response.data === "string" ? response.data : "";
  const cards = extractCardsFromHtml(html);

  return {
    method: "axios",
    status: response.status,
    cloudflare: detectCloudflare(html, response.status),
    htmlLength: html.length,
    cards,
  };
}

async function fetchViaPlaywright() {
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      userAgent: UA,
      viewport: { width: 1440, height: 1200 },
    });

    const response = await page.goto(TARGET_URL, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    await page.waitForSelector(
      "a[href^='/series/mega-evolution/ascended-heroes/']",
      { timeout: 45000 }
    );
    await page.waitForTimeout(2000);

    const html = await page.content();
    const cards = await extractCardsFromPage(page);

    return {
      method: "playwright",
      status: response ? response.status() : null,
      cloudflare: detectCloudflare(html, response ? response.status() : null),
      htmlLength: html.length,
      cards,
    };
  } finally {
    await browser.close();
  }
}

function printResult(result) {
  console.log(`Method: ${result.method}`);
  console.log(`HTTP status: ${result.status}`);
  console.log(`Cloudflare markers: ${result.cloudflare ? "YES" : "NO"}`);
  console.log(`Cards found: ${result.cards.length}`);

  if (result.cards.length) {
    console.log("\nSample cards:");
    console.log(result.cards.slice(0, 5));
  }
}

async function main() {
  console.log(`Testing ${TARGET_URL}`);
  console.log("Step 1: plain HTTP request");

  const axiosResult = await fetchViaAxios();
  printResult(axiosResult);

  if (!axiosResult.cloudflare && axiosResult.cards.length >= 3) {
    console.log("\nPlain HTTP request already returned card data.");
    return;
  }

  console.log("\nStep 2: browser request with Playwright");
  const playwrightResult = await fetchViaPlaywright();
  printResult(playwrightResult);

  if (playwrightResult.cards.length) {
    console.log("\nBrowser request returned card data.");
    return;
  }

  console.log("\nNo cards were extracted with either method.");
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error.response?.status || error.message);

  if (error.response?.data) {
    const text =
      typeof error.response.data === "string"
        ? error.response.data.slice(0, 600)
        : error.response.data;
    console.error(text);
  }

  process.exit(1);
});
