// scripts/import-first-jp-set.mjs
// 1) Finds the FIRST JP set on the sets index page
// 2) Opens that set and collects ALL card links
// 3) For each card: scrapes details (Cheerio) + prices modal (Playwright)
// 4) Normalizes to your public.cards schema + language 'jp'
// 5) Downloads card image, converts to WebP (small+large), uploads to Supabase Storage (bucket "jpcards")
// 6) UPSERTS rows into public.cards_test with YOUR image URLs
//
// REQUIREMENTS:
//   npm i axios cheerio @supabase/supabase-js playwright sharp
//   npx playwright install chromium
//
// RUN:
//   node scripts/import-first-jp-set.mjs

import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

/* ---------- Config ---------- */
const BASE = "https://www.tcgcollector.com";
const SETS_INDEX = `${BASE}/sets/jp?setMode=anyCardVariant&releaseDateOrder=newToOld&displayAs=logos`;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

// polite rate limit between card pages (ms)
const DELAY_MS = 900;

// Supabase Storage
const STORAGE_BUCKET = "jpcards"; // <- you said you created this bucket

/* ---------- Supabase ---------- */
const SUPABASE_URL = "https://orvklxcroobcnwzgiank.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";

const sb =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: { persistSession: false },
      })
    : null;

/* ---------- Utils ---------- */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const abs = (u) => {
  try {
    return new URL(u, BASE).href;
  } catch {
    return u || null;
  }
};
const toMoney = (s) => {
  if (!s) return null;
  const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
};
const camelKey = (s) =>
  (s || "variant")
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c) => (c || "").toUpperCase())
    .replace(/[^a-z0-9]/g, "");

// strip affiliate wrapper: https://partner.tcgplayer.com/... ?u=<encoded real URL>
function stripAffiliate(u) {
  try {
    const url = new URL(u);
    const inner = url.searchParams.get("u");
    return inner ? decodeURIComponent(inner) : u;
  } catch {
    return u || null;
  }
}

// tiny retry helper (for flaky navigation)
async function withRetry(fn, tries = 3, delayMs = 1000) {
  let lastErr;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
    }
    await sleep(delayMs * (i + 1));
  }
  throw lastErr;
}

const safeSeg = (s) =>
  String(s || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");

/* ---------- 1) First JP set URL ---------- */
async function getFirstSetUrl() {
  const { data: html } = await axios.get(SETS_INDEX, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  const $ = cheerio.load(html);

  const firstLink =
    $("a.set-logo-grid-item-set-name").first().attr("href") ||
    $(".set-logo-grid-item-body a.set-logo-grid-item-set-logo-container")
      .first()
      .attr("href");

  if (!firstLink) throw new Error("No set link found on JP sets index.");
  const setUrl = abs(firstLink);

  const setName = $("a.set-logo-grid-item-set-name").first().text().trim() || null;
  const setCode = $("span.set-logo-grid-item-set-code").first().text().trim() || null;

  return { setUrl, setName, setCode };
}

/* ---------- 2) Card links from a set ---------- */
async function getCardLinksFromSet(setUrl) {
  const url = setUrl.includes("?")
    ? `${setUrl}&displayAs=images`
    : `${setUrl}?displayAs=images`;

  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  const $ = cheerio.load(html);

  const links = new Set();
  $("a[href^='/cards/']").each((_, a) => {
    const href = $(a).attr("href");
    if (href && /^\/cards\/\d+\//.test(href)) links.add(abs(href));
  });

  return [...links];
}

/* ---------- helpers ---------- */
function normalizeSupertypeFrom(typeTextArr) {
  const parts = (typeTextArr || []).map((s) => (s || "").toLowerCase());
  const joined = parts.join(" ");
  const has = (re) => re.test(joined) || parts.some((p) => re.test(p));

  // "Trainer's Pokémon" still counts as Pokémon
  if (has(/trainer['’]s?\s+pok[eé]mon/)) return "Pokemon";

  // Pokémon (covers ex, V, VMAX, GX, SV, ME, etc.)
  if (has(/pok[eé]mon/)) return "Pokemon";

  // Trainer buckets (Stadium, Item, Supporter, Pokémon Tool, Technical Machine, ACE SPEC)
  if (
    has(/\btrainer\b/) ||
    has(/\b(stadium|item|supporter|ace\s*spec|technical\s*machine|pok[eé]mon\s*tool|tool)\b/)
  ) {
    return "Trainer";
  }

  // Energy (Basic/Special/etc.)
  if (has(/\benergy\b/)) return "Energy";

  return null;
}
function normalizeRarity(raw) {
  if (!raw) return null;
  const clean = raw.replace(/\s*\(.*?\)\s*$/, "").trim(); // drop "(RR)" etc
  if (clean === "—" || clean === "-") return null;
  return clean || null;
}
function parseEvolution($, $status) {
  if (!$status || !$status.length) return { from: null, to: [] };
  let mode = null;
  let from = null;
  const to = [];
  $status.contents().each((_, node) => {
    if (node.type === "text") {
      const t = ($(node).text() || "").replace(/\s+/g, " ").trim().toLowerCase();
      if (!t) return;
      if (t.includes("evolves from")) mode = "from";
      else if (t.includes("evolves to")) mode = "to";
    } else if (node.name === "a") {
      const txt = $(node).text().trim();
      if (!txt) return;
      if (mode === "from") from = txt;
      else if (mode === "to") to.push(txt);
    }
  });
  return { from: from || null, to };
}

/* ---------- 3) Details (Cheerio) ---------- */
async function fetchDetailsCheerio(cardUrl) {
  const { data: html } = await axios.get(cardUrl, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  const $ = cheerio.load(html);

  // name & image
  const name =
    $("#card-info-title").text().trim() ||
    $("h1#card-info-title a").text().trim() ||
    $("h1").first().text().trim() ||
    null;

  const og = $('meta[property="og:image"]').attr("content");
  const image =
    abs(og) || abs($("#card-image-container img").first().attr("src")) || null;

  // types header (supertype + subtypes as printed)
  const typeText = $("#card-type-containers .card-type-container")
    .map((_, el) => $(el).text().trim().replace(/,\s*$/, ""))
    .get()
    .filter(Boolean);

  const supertype = normalizeSupertypeFrom(typeText);
  const subtypes =
    typeText
      .filter((t) => !/^(pok[eé]mon|trainer|energy)$/i.test(t))
      .filter(Boolean) || null;

  // HP & energy types
  const hpTxt = $("#card-hit-points").first().text().trim();
  const hp = hpTxt ? parseInt(hpTxt.replace(/\D+/g, ""), 10) : null;

  const types = $("#card-energy-types img[alt]")
    .map((_, img) => $(img).attr("alt"))
    .get();

  // footer map (Card number, Rarity, Expansion, Illustrators, etc.)
  const footer = {};
  $("#card-info-footer .card-info-footer-item").each((_, el) => {
    const $el = $(el);
    const title = $el.find(".card-info-footer-item-title").text().trim();
    if (!title) return;
    const textParts = $el
      .find(".card-info-footer-item-text-part")
      .map((__, t) => $(t).text().trim())
      .get();
    const text =
      textParts.join(" ").trim() ||
      $el.find(".card-info-footer-item-text").text().trim() ||
      null;
    const link = $el.find(".card-info-footer-item-text a").attr("href");
    footer[title] = { text, link: link ? abs(link) : null, $el };
  });

  // Weakness → [{ type, value }]
  const weaknesses = [];
  if (footer["Weakness"]?.$el) {
    const wtypes = footer["Weakness"].$el
      .find(".card-info-footer-item-entry img[alt]")
      .map((_, img) => $(img).attr("alt"))
      .get();
    const mult =
      footer["Weakness"].$el
        .find(".card-info-footer-item-entry-text")
        .text()
        .trim() || null;
    wtypes.forEach((t) => weaknesses.push({ type: t, value: mult || "×2" }));
  }

  // Resistance → [{ type, value }]
  const resistances = [];
  if (footer["Resistance"]?.$el) {
    const rtypes = footer["Resistance"].$el
      .find(".card-info-footer-item-entry img[alt]")
      .map((_, img) => $(img).attr("alt"))
      .get();
    const text =
      footer["Resistance"]?.$el
        .find(".card-info-footer-item-text")
        .text()
        .trim() || null;
    rtypes.forEach((t) => resistances.push({ type: t, value: text || "-30" }));
  }

  // Retreat cost
  let retreatCost = [];
  let convertedRetreatCost = null;
  if (footer["Retreat Cost"]?.$el) {
    const symbols = footer["Retreat Cost"].$el
      .find(".card-info-footer-item-entry-symbol[alt]")
      .map((_, img) => $(img).attr("alt"))
      .get();
    retreatCost = symbols;
    convertedRetreatCost = symbols.length;
  }

  // Expansion (name/code/link)
  let expansionName = null,
    expansionCode = null;
  const expansionLink = footer["Expansion"]?.link || null;
  if (footer["Expansion"]?.$el) {
    expansionName =
      footer["Expansion"].$el
        .find("#card-info-footer-item-text-part-expansion-name")
        .text()
        .trim() || footer["Expansion"].text || null;
    expansionCode =
      footer["Expansion"].$el
        .find("#card-info-footer-item-text-part-expansion-code")
        .text()
        .trim() || null;
  }

  // Illustrators → string
  const illustrators = footer["Illustrators"]?.$el
    ? footer["Illustrators"].$el
        .find(".card-info-footer-item-text-part a")
        .map((_, a) => $(a).text().trim())
        .get()
        .filter(Boolean)
        .join(", ")
    : null;

  // Rarity normalized
  const rarity = normalizeRarity(footer["Rarity"]?.text || null);

  const number = footer["Card number"]?.text || null;
  const regulationMark =
    footer["Regulation mark"]?.text || footer["Regulation"]?.text || null;

  // Abilities
  const abilities = $(".card-effect")
    .map((_, el) => {
      const $el = $(el);
      const type =
        $el.find(".card-effect-badge").first().text().trim() || "Ability";
      const effectName =
        $el.find(".card-effect-name").first().text().trim() || null;
      const effectText =
        $el.find(".card-effect-description").first().text().trim() || null;
      if (!effectName && !effectText) return null;
      return { type, name: effectName, text: effectText };
    })
    .get()
    .filter(Boolean);

  // Rules
  const rules = $("#card-rules .card-rule-description")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter(Boolean);

  // Attacks (with description)
  const attacks = $(".card-attack")
    .map((_, atk) => {
      const $atk = $(atk);
      const nm = $atk.find(".card-attack-name").first().text().trim() || null;
      const dmg = $atk.find(".card-attack-damage").first().text().trim() || "";
      const energies = $atk
        .find(".card-attack-energies img[alt]")
        .map((__, img) => $(img).attr("alt"))
        .get();
      const desc =
        $atk.find(".card-attack-description").first().text().trim() || null;
      return {
        name: nm,
        cost: energies,
        convertedEnergyCost: energies.length,
        damage: dmg,
        text: desc,
      };
    })
    .get();

  // Evolves From / Evolves To
  const evo = parseEvolution($, $("#card-evolution-status"));

  // price button preview (may be null)
  const $btn = $(".card-price-details-modal-show-button.card-image-controls-item-price").first();
  const cardId = $btn.attr("data-card-id") || null;
  const pricePreview = toMoney($btn.text());

  return {
    link: cardUrl,
    image, // original remote image URL (we'll replace with our own later)
    name,
    supertype, // normalized
    subtypes: subtypes && subtypes.length ? subtypes : null,
    level: null,
    hp,
    types,
    evolvesFrom: evo.from,
    evolvesTo: evo.to.length ? evo.to : null,
    rules: rules.length ? rules : null,
    attacks,
    abilities: abilities.length ? abilities : null,
    weaknesses,
    resistances,
    retreatCost,
    convertedRetreatCost,
    set: { id: expansionCode || null, name: expansionName || null, url: expansionLink || null },
    number,
    artist: illustrators,
    rarity, // normalized
    flavorText: null,
    nationalPokedexNumbers: null,
    regulationMark,
    legalities: null,
    images: { small: image, large: image }, // temp; will be replaced by our storage URLs
    cardId,
    pricePreview,
  };
}

/* ---------- 4) Prices modal (Playwright) ---------- */
async function fetchPricesPlaywright(cardUrl, browser) {
  const page = await browser.newPage({ userAgent: UA });

  await withRetry(
    () => page.goto(cardUrl, { waitUntil: "domcontentloaded", timeout: 60000 }),
    3,
    1000
  );

  const btn = page
    .locator(".card-price-details-modal-show-button.card-image-controls-item-price")
    .first();

  const visible = await btn.isVisible().catch(() => false);
  if (!visible) {
    await page.close();
    return { cardId: null, pricePreview: null, prices: [] };
  }

  const cardId = await btn.getAttribute("data-card-id");
  const pricePreview = toMoney((await btn.textContent())?.trim());
  await btn.click();

  await page
    .waitForSelector(
      "#card-price-details-modal.shown #card-price-details-modal-entries",
      { timeout: 15000 }
    )
    .catch(() => {});

  const prices = await page.evaluate(() => {
    const toMoney = (s) => {
      if (!s) return null;
      const n = parseFloat(String(s).replace(/[^0-9.]/g, ""));
      return Number.isFinite(n) ? n : null;
    };
    const out = [];
    document
      .querySelectorAll(
        "#card-price-details-modal-entries .card-price-details-modal-entry"
      )
      .forEach((entry) => {
        const variant =
          entry
            .querySelector(
              ".card-price-details-modal-entry-card-variant-type-name-container"
            )
            ?.textContent?.replace(/\s+/g, " ")
            .trim() || null;

        const obj = { variant };
        entry.querySelectorAll(".card-price-details-modal-entry-price").forEach((p) => {
          const label = p
            .querySelector(".card-price-details-modal-entry-price-label")
            ?.textContent?.trim()
            .toLowerCase();
          const value = toMoney(
            p
              .querySelector(".card-price-details-modal-entry-price-value")
              ?.textContent?.trim()
          );
          if (label) obj[label] = value;
        });

        const sourceUrl =
          entry.querySelector("a.card-price-details-modal-entry-source-button")
            ?.href || null;
        if (sourceUrl) obj.sourceUrl = sourceUrl;

        out.push(obj);
      });
    return out;
  });

  // Clean affiliate wrappers on price URLs
  const cleaned = (prices || []).map((p) => ({
    ...p,
    sourceUrl: p.sourceUrl ? (function (u) {
      try {
        const url = new URL(u);
        const inner = url.searchParams.get("u");
        return inner ? decodeURIComponent(inner) : u;
      } catch {
        return u || null;
      }
    })(p.sourceUrl) : null,
  }));

  await page.close();
  return { cardId, pricePreview, prices: cleaned };
}

/* ---------- Image download/convert/upload ---------- */
async function downloadBuffer(url) {
  const { data } = await axios.get(url, {
    responseType: "arraybuffer",
    headers: { "User-Agent": UA, Accept: "image/*" },
  });
  return Buffer.from(data);
}

async function uploadToStorage(key, buffer) {
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(key, buffer, {
    contentType: "image/webp",
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`storage upload failed (${key}): ${error.message}`);
  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return data?.publicUrl || null;
}

/**
 * Given the scraped image URL + normalized row, create two WebP variants and upload.
 * Returns { small, large } with public URLs; or null on failure.
 */
async function ensureUploadedImages(originalUrl, row) {
  if (!sb) return null; // no storage client
  if (!originalUrl) return null;

  try {
    const buf = await downloadBuffer(originalUrl);
    const img = sharp(buf);

    // large: keep original dimensions, just convert to webp
    const largeBuf = await img.clone().webp({ quality: 85 }).toBuffer();

    // small: width 600 (no upscaling), webp
    const smallBuf = await img
      .clone()
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    // Build deterministic keys
    const setCode = row.set?.id || "unknown";
    // Prefer the stable tail (number or cardId), fall back to sanitized id
    const tail =
      (row.number || "").replace(/\s+/g, "") ||
      (row.id || "").split(":").pop() ||
      "unknown";

    const baseKey = `cards/jp/${safeSeg(setCode)}/${safeSeg(tail)}`;
    const smallKey = `${baseKey}-small.webp`;
    const largeKey = `${baseKey}-large.webp`;

    const [smallUrl, largeUrl] = await Promise.all([
      uploadToStorage(smallKey, smallBuf),
      uploadToStorage(largeKey, largeBuf),
    ]);

    return { small: smallUrl, large: largeUrl };
  } catch (e) {
    console.warn("⚠️  Image pipeline skipped:", e.message);
    return null;
  }
}

/* ---------- 5) Normalize to public.cards shape (+ language) ---------- */
function toCardsRow(scraped) {
  const lang = "jp";
  const setCode = scraped.set?.id || "unknown";
  const num = (scraped.number || "").replace(/\s+/g, "");
  const tail = num || scraped.cardId || "unknown";
  const id = `tcgc:${lang}:${setCode}:${tail}`;

  // pick first cleaned price URL (if any)
  const firstUrlRaw = (scraped.prices && scraped.prices[0]?.sourceUrl) || null;
  const firstUrl = firstUrlRaw ? stripAffiliate(firstUrlRaw) : null;

  const tpPrices = {};
  (scraped.prices || []).forEach((p) => {
    const key = camelKey(p.variant);
    tpPrices[key] = {
      low: p.low ?? null,
      mid: p.mid ?? null,
      high: p.high ?? null,
      market: p.market ?? null,
    };
  });
  const tcgplayer =
    Object.keys(tpPrices).length > 0
      ? { url: firstUrl, updatedAt: new Date().toISOString(), prices: tpPrices }
      : null;

  // IMPORTANT: keys must be lower_case to match your DB columns
  return {
    id,
    language: lang,

    name: scraped.name || null,
    supertype: scraped.supertype || null, // Pokemon | Trainer | Energy
    subtypes: scraped.subtypes || null,
    level: scraped.level || null,
    hp: scraped.hp ?? null,
    types: scraped.types || null,

    evolvesfrom: scraped.evolvesFrom || null, // snake_case for your table
    evolvesto: scraped.evolvesTo || null,
    rules: scraped.rules || null,

    attacks: scraped.attacks || null,
    abilities: scraped.abilities || null,
    weaknesses: scraped.weaknesses || null,
    resistances: scraped.resistances || null,

    retreatcost: scraped.retreatCost || null,
    convertedretreatcost: scraped.convertedRetreatCost ?? null,

    set: scraped.set || null,
    number: scraped.number || null,
    artist: scraped.artist || null,
    rarity: scraped.rarity || null, // normalized (no "(RR)" etc)
    flavortext: scraped.flavorText || null,
    nationalpokedexnumbers: scraped.nationalPokedexNumbers || null,
    regulationmark: scraped.regulationMark || null,
    legalities: scraped.legalities || null,

    // We'll overwrite with our storage URLs if upload succeeds
    images: scraped.images || null,

    tcgplayer, // only tcgplayer prices
    cardmarket: null,
  };
}

/* ---------- 6) Main ---------- */
async function main() {
  console.log("JP sets index:", SETS_INDEX);
  const { setUrl, setName, setCode } = await getFirstSetUrl();
  console.log("➡️  First set:", setName, `(${setCode || "?"})`, "->", setUrl);

  const cardLinks = await getCardLinksFromSet(setUrl);
  if (!cardLinks.length) throw new Error("No card links found in first set.");
  console.log(`Found ${cardLinks.length} card links in first set.`);

  const browser = await chromium.launch({ headless: true });

  let inserted = 0,
    failed = 0;
  for (let i = 0; i < cardLinks.length; i++) {
    const link = cardLinks[i];
    process.stdout.write(`\n[${i + 1}/${cardLinks.length}] ${link}\n`);

    try {
      const details = await fetchDetailsCheerio(link);
      const pricesInfo = await fetchPricesPlaywright(link, browser);
      const combined = { ...details, ...pricesInfo };
      let row = toCardsRow(combined);

      // Download -> WebP -> Upload to Supabase Storage -> replace image URLs
      if (sb && details.image) {
        const uploaded = await ensureUploadedImages(details.image, row);
        if (uploaded) {
          row = {
            ...row,
            images: {
              small: uploaded.small || row.images?.small || null,
              large: uploaded.large || row.images?.large || null,
            },
          };
        }
      }

      console.log("•", row.name, "#", row.number, "set", row.set?.id, "→", row.id);

      if (sb) {
        const { error } = await sb.from("cards_jp").upsert(row, {
          onConflict: "id",
        });
        if (error) throw new Error(`Supabase upsert error: ${error.message}`);
        inserted++;
      } else {
        console.dir(row, { depth: null });
      }
    } catch (err) {
      failed++;
      console.error("✖ Error:", err.message);
    }

    await sleep(DELAY_MS);
  }

  await browser.close();

  if (sb) {
    console.log(`\n✅ Done. Inserted/updated: ${inserted}, failed: ${failed}`);
  } else {
    console.log(`\nℹ️ No DB write (env missing). Scrape finished. Failed: ${failed}`);
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
