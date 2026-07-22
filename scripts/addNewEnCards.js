// scripts/import-scrydex-ascended-heroes-test10.mjs

import axios from "axios";
import * as cheerio from "cheerio";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

/* ---------------- Config ---------------- */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36";

const SET = {
  dbSetId: "me03",
  tcgc_set_id: 11680,
  name: "Ascended Heroes",
  sourceUrl: "https://scrydex.com/pokemon/expansions/ascended-heroes/me2pt5",
  sourceSetCode: "me2pt5",
  language: "en",
};

const STORAGE_BUCKET = "cards";
const PROFILE_DIR = "./playwright-scrydex-profile";
const DELAY_MS = 900;
const MAX_CARDS = null;

const FRONTEND_FOIL_ORDER = [
  "holofoil",
  "reverseHolofoil",
  "normal",
  "unlimitedHolofoil",
  "1stEditionHolofoil",
  "1stEditionNormal",
  "etchedHolofoil",
  "promoHolofoil",
  "parallelHolofoil",
  "radiantHolofoil",
  "preReleaseHolofoil",
  "1stEdition",
  "unlimited",
  "normalolo",
  "pokallolo",
  "reverseolo",
  "masterallolo",
  "nonolo",
  "mirroreverseolo",
  "promo",
  "holo",
  "normalinderace",
  "normalikachu",
  "mirageolo",
  "normalewtwo",
  "normalyranitar",
  "normalaichu",
  "normalharizard",
  "normaloloaichu",
  "normaloloewtwo",
  "normalewtwo16",
  "normaloloharizard",
  "normaloloikachu",
  "unpeeledardidoof",
  "unpeeledardpinarak",
  "unpeeledardumel",
];

const SUPABASE_URL = "https://orvklxcroobcnwzgiank.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
  );
}

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/* ---------------- Utils ---------------- */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function abs(url, base = "https://scrydex.com") {
  try {
    return new URL(url, base).href;
  } catch {
    return url || null;
  }
}

function toMoney(value) {
  if (value == null) return null;
  const n = parseFloat(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeSeg(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/\//g, "-")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function camelKey(value) {
  return String(value || "variant")
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => (c || "").toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, "")
    .replace(/^([A-Z])/, (m) => m.toLowerCase());
}

function normalizePrintedNumber(raw) {
  if (!raw) return null;
  return cleanText(raw);
}

function normalizeSimpleNumber(raw) {
  if (!raw) return null;
  const m = String(raw).match(/^0*([0-9]+)(?:\/[0-9]+)?$/);
  return m ? m[1] : String(raw).split("/")[0].replace(/^0+/, "") || "0";
}

function normalizeSupertype(raw) {
  if (!raw) return null;
  const clean = removeFieldMarkers(raw);
  if (/^pok[eé]mon$/i.test(clean)) return "Pokemon";
  return clean;
}

function normalizeSubtype(raw) {
  if (!raw) return null;
  const clean = removeFieldMarkers(raw);
  if (/^mega$/i.test(clean)) return "MEGA";
  if (/^pok[eé]mon$/i.test(clean)) return "Pokemon";
  return clean;
}

function removeFieldMarkers(text) {
  return cleanText(
    String(text || "")
      .replace(/attacks\.cost/gi, "")
      .replace(/attacks\.name/gi, "")
      .replace(/attacks\.text/gi, "")
      .replace(/attacks\.damage/gi, "")
      .replace(/rules/gi, "")
      .replace(/weaknesses/gi, "")
      .replace(/retreat_cost/gi, "")
      .replace(/artist/gi, "")
      .replace(/rarity/gi, "")
      .replace(/printed_number/gi, "")
      .replace(/expansion\.name/gi, "")
      .replace(/expansion\.series/gi, "")
      .replace(/language/gi, "")
      .replace(/supertype/gi, "")
      .replace(/subtypes/gi, "")
      .replace(/name/gi, "")
      .replace(/hp/gi, "")
      .replace(/types/gi, "")
  );
}

function typeFromAssetUrl(src) {
  const s = String(src || "").toLowerCase();

  if (s.includes("grass")) return "Grass";
  if (s.includes("fire")) return "Fire";
  if (s.includes("water")) return "Water";
  if (s.includes("lightning")) return "Lightning";
  if (s.includes("electric")) return "Lightning";
  if (s.includes("psychic")) return "Psychic";
  if (s.includes("fighting")) return "Fighting";
  if (s.includes("darkness")) return "Darkness";
  if (s.includes("metal")) return "Metal";
  if (s.includes("steel")) return "Metal";
  if (s.includes("dragon")) return "Dragon";
  if (s.includes("fairy")) return "Fairy";
  if (s.includes("colorless")) return "Colorless";

  return null;
}

function parseSupertypeAndSubtypes($root) {
  const chips = $root
    .find(".border.border-mono-2")
    .map((_, el) => removeFieldMarkers($root.find(el).text()))
    .get()
    .filter(Boolean);

  if (!chips.length) {
    return { supertype: null, subtypes: null };
  }

  return {
    supertype: normalizeSupertype(chips[0] || null),
    subtypes: chips.slice(1).length
      ? chips.slice(1).map(normalizeSubtype).filter(Boolean)
      : null,
  };
}

function parseRetreatCost($section) {
  const types = $section
    .find("img")
    .map((_, img) => typeFromAssetUrl($section.find(img).attr("src")))
    .get()
    .filter(Boolean);

  return {
    retreatCost: types.length ? types : null,
    convertedRetreatCost: types.length || null,
  };
}

function parseWeaknesses($section) {
  const types = $section
    .find("img")
    .map((_, img) => typeFromAssetUrl($section.find(img).attr("src")))
    .get()
    .filter(Boolean);

  const text = removeFieldMarkers($section.text());
  const valueMatch = text.match(/([x×]\s*\d+|-\s*\d+)/i);
  const value = valueMatch ? valueMatch[1].replace(/\s+/g, "") : "×2";

  return types.map((type) => ({ type, value }));
}

function parseResistances($section) {
  const text = removeFieldMarkers($section.text());
  if (!text || text === "-") return [];

  const types = $section
    .find("img")
    .map((_, img) => typeFromAssetUrl($section.find(img).attr("src")))
    .get()
    .filter(Boolean);

  const valueMatch = text.match(/([x×]\s*\d+|-\s*\d+)/i);
  const value = valueMatch ? valueMatch[1].replace(/\s+/g, "") : null;

  return types.map((type) => ({ type, value }));
}

function parseRules($, $section) {
  const rules = $section
    .find(".text-mono-4 span, .text-mono-4 p, .text-mono-4")
    .map((_, el) => removeFieldMarkers($(el).text()))
    .get()
    .filter(Boolean);

  const unique = [...new Set(rules)];
  return unique.length ? unique : null;
}

function parseAttacksFromSection($, $section) {
  const attacks = [];

  $section.find("table tbody").each((_, tbody) => {
    const $tbody = $(tbody);
    const rows = $tbody.find("tr");
    if (!rows.length) return;

    const firstRow = rows.eq(0);
    const secondRow = rows.eq(1);
    const cells = firstRow.find("td");

    const cost = cells
      .eq(0)
      .find("img")
      .map((__, img) => typeFromAssetUrl($(img).attr("src")))
      .get()
      .filter(Boolean);

    let name = removeFieldMarkers(cells.eq(1).find("span.text-white").first().text());
    if (!name) name = removeFieldMarkers(cells.eq(1).text());

    let damage = removeFieldMarkers(cells.eq(2).find(".text-body-20").first().text());
    if (!damage) damage = removeFieldMarkers(cells.eq(2).text());
    damage = damage || null;

    let text = removeFieldMarkers(secondRow.find("p.text-mono-4").first().text());
    if (!text) text = removeFieldMarkers(secondRow.text());
    text = text || null;

    if (!name && !damage && !text) return;

    attacks.push({
      cost: cost.length ? cost : [],
      name: name || null,
      text,
      damage,
      convertedEnergyCost: cost.length,
    });
  });

  return attacks.length ? attacks : null;
}

function normalizeFoilVariant(rawVariant) {
  const v = cleanText(rawVariant || "");
  const lower = v.toLowerCase();

  const directMap = {
    holofoil: "holofoil",
    reverseholofoil: "reverseHolofoil",
    normal: "normal",
    unlimitedholofoil: "unlimitedHolofoil",
    "1steditionholofoil": "1stEditionHolofoil",
    "1steditionnormal": "1stEditionNormal",
    etchedholofoil: "etchedHolofoil",
    promoholofoil: "promoHolofoil",
    parallelholofoil: "parallelHolofoil",
    radiantholofoil: "radiantHolofoil",
    prereleaseholofoil: "preReleaseHolofoil",
    "1stedition": "1stEdition",
    unlimited: "unlimited",
    promo: "promo",
    holo: "holo",
    nonholo: "nonolo",
    nonholofoil: "nonolo",
    mirrorreverseholofoil: "mirroreverseolo",
    miragereverseholofoil: "mirageolo",
  };

  if (directMap[lower]) return directMap[lower];

  if (lower === "energyreverseholofoil") return "reverseolo";
  if (lower === "pokeballreverseholofoil") return "pokallolo";
  if (lower === "masterballreverseholofoil") return "masterallolo";

  if (FRONTEND_FOIL_ORDER.includes(v)) return v;

  const camel = camelKey(v);
  if (FRONTEND_FOIL_ORDER.includes(camel)) return camel;

  return camel;
}

function parseVariantPrices($) {
  const out = [];

  $('[data-prices-target="pricesContainer"]').each((_, el) => {
    const $container = $(el);
    const company = cleanText($container.attr("data-company") || "") || null;
    const variantRaw = cleanText($container.attr("data-variant") || "normal") || "normal";
    const variant = normalizeFoilVariant(variantRaw);

    const conditions = {};
    $container.find(".grid > div").each((__, block) => {
      const $block = $(block);
      const label = removeFieldMarkers($block.find(".mb-1 span").last().text());
      const value = toMoney($block.find(".text-heading-20").first().text());

      if (!label || value == null) return;
      conditions[camelKey(label)] = value;
    });

    if (Object.keys(conditions).length === 0) return;

    out.push({
      company,
      variantRaw,
      variant,
      conditions,
      market: conditions.nearMint ?? null,
      low: conditions.lightlyPlayed ?? null,
      mid: conditions.nearMint ?? null,
      high: null,
    });
  });

  return out;
}

function sortFoilKeys(keys) {
  return [...keys].sort((a, b) => {
    const ia = FRONTEND_FOIL_ORDER.indexOf(a);
    const ib = FRONTEND_FOIL_ORDER.indexOf(b);

    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

function buildTcgplayerLikeJson(variantPrices) {
  const rawOnly = (variantPrices || []).filter(
    (v) => String(v.company || "").toLowerCase() === "raw"
  );

  if (!rawOnly.length) return null;

  const deduped = new Map();

  for (const variant of rawOnly) {
    deduped.set(variant.variant, {
      low: variant.low ?? null,
      mid: variant.mid ?? null,
      high: variant.high ?? null,
      market: variant.market ?? null,
      conditions: variant.conditions || {},
    });
  }

  const prices = {};
  for (const key of sortFoilKeys([...deduped.keys()])) {
    prices[key] = deduped.get(key);
  }

  return {
    url: null,
    updatedAt: new Date().toISOString(),
    prices,
  };
}

async function withRetry(fn, tries = 3, delayMs = 1200) {
  let lastError;
  for (let i = 0; i < tries; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i < tries - 1) {
        await sleep(delayMs * (i + 1));
      }
    }
  }
  throw lastError;
}

/* ---------------- DB helpers ---------------- */
async function getEnSetRow() {
  let q = await sb
    .from("en_sets")
    .select("*")
    .eq("tcgc_set_id", SET.tcgc_set_id)
    .maybeSingle();

  if (q.error) {
    throw new Error(`Failed reading en_sets by tcgc_set_id: ${q.error.message}`);
  }
  if (q.data) return q.data;

  q = await sb.from("en_sets").select("*").eq("id", SET.dbSetId).maybeSingle();

  if (q.error) {
    throw new Error(`Failed reading en_sets by id: ${q.error.message}`);
  }
  if (q.data) return q.data;

  throw new Error(`Set row not found in en_sets for ${SET.name}`);
}

/* ---------------- Scrape set page ---------------- */
async function collectCardLinks(context) {
  const page = await context.newPage();

  try {
    console.log(`Opening set page: ${SET.sourceUrl}`);

    await withRetry(
      () =>
        page.goto(SET.sourceUrl, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        }),
      3,
      1500
    );

    await page.waitForTimeout(3000);

    const cardSelector = 'a[href*="/pokemon/cards/"]';
    await page.waitForSelector(cardSelector, { timeout: 45000 });

    const count = await page.locator(cardSelector).count();
    console.log(`Found ${count} raw card links on page.`);

    if (!count) {
      throw new Error("Set page opened but no card links were found.");
    }

    const cards = await page.locator(cardSelector).evaluateAll((nodes) => {
      const seen = new Set();
      const out = [];

      for (const a of nodes) {
        const href = a.getAttribute("href") || "";
        if (!href || seen.has(href)) continue;
        seen.add(href);

        const title =
          a.querySelector("span.text-body-12.text-white.text-center")?.textContent?.trim() ||
          "";

        const price =
          a.querySelector(".font-bold")?.textContent?.trim() || "";

        const img = a.querySelector("img")?.getAttribute("src") || "";
        const cardId = a.querySelector(".card")?.getAttribute("data-id") || "";

        out.push({
          href,
          title,
          price,
          img,
          cardId,
        });
      }

      return out;
    });

    return cards.map((c) => ({
      ...c,
      url: abs(c.href),
      image: abs(c.img, "https://images.scrydex.com"),
    }));
  } finally {
    await page.close().catch(() => {});
  }
}

/* ---------------- Scrape one card ---------------- */
async function scrapeCard(context, cardUrl, enSetRow) {
  const page = await context.newPage();

  try {
    await withRetry(
      () =>
        page.goto(cardUrl, {
          waitUntil: "domcontentloaded",
          timeout: 90000,
        }),
      3,
      1500
    );

    await page.waitForTimeout(2500);
    await page.waitForSelector("h1.text-heading-32.text-white", {
      timeout: 45000,
    });

    const html = await page.content();
    const $ = cheerio.load(html);

    const name = removeFieldMarkers($("h1.text-heading-32.text-white").first().text()) || null;

    const image =
      abs($('img[data-card-target="image"]').attr("src")) ||
      abs($('img[id^="card-image-"]').attr("src")) ||
      abs($(".xl\\:w-1\\/3 img").first().attr("src")) ||
      null;

    const hpContainerText = removeFieldMarkers(
      $('div[data-field="hp"]').prev().text() ||
        $('span:contains("HP")').first().text()
    );
    const hp = hpContainerText
      ? parseInt(hpContainerText.replace(/\D+/g, ""), 10) || null
      : null;

    const types = $('div[data-field="types"]')
      .prev()
      .find("img")
      .map((_, img) => typeFromAssetUrl($(img).attr("src")))
      .get()
      .filter(Boolean);

    const topSubtypeRoot = $('div[data-field="supertype"]').first().parent().parent().parent();
    const { supertype, subtypes } = parseSupertypeAndSubtypes(topSubtypeRoot);

    const detailsBlock = $("h2")
      .filter((_, el) => cleanText($(el).text()) === "Details")
      .next(".border-1");

    const sections = {};
    detailsBlock.children("div").each((_, block) => {
      const $block = $(block);
      const label = removeFieldMarkers($block.find(".mb-2.text-sm.text-white").first().text());
      if (!label) return;
      sections[label] = $block;
    });

    const rules = sections["Rules"] ? parseRules($, sections["Rules"]) : null;
    const attacks = sections["Attacks"] ? parseAttacksFromSection($, sections["Attacks"]) : null;

    const detailsGrid = detailsBlock.find(".grid.grid-cols-2.gap-y-4");
    const gridSections = {};
    detailsGrid.children("div").each((_, block) => {
      const $block = $(block);
      const label = removeFieldMarkers($block.find(".mb-2.text-sm").first().text());
      if (!label) return;
      gridSections[label] = $block;
    });

    const weaknesses = gridSections["Weakness"]
      ? parseWeaknesses(gridSections["Weakness"])
      : null;

    const resistances = gridSections["Resistance"]
      ? parseResistances(gridSections["Resistance"])
      : [];

    const retreat = gridSections["Retreat Cost"]
      ? parseRetreatCost(gridSections["Retreat Cost"])
      : { retreatCost: null, convertedRetreatCost: null };

    const artist = gridSections["Artist"]
      ? removeFieldMarkers(gridSections["Artist"].find(".text-body-16").text()) || null
      : null;

    const rarity = gridSections["Rarity"]
      ? removeFieldMarkers(gridSections["Rarity"].find(".text-body-16").text()) || null
      : null;

    const printedNumber = gridSections["Number"]
      ? normalizePrintedNumber(
          removeFieldMarkers(gridSections["Number"].find(".text-body-16").text())
        )
      : null;

    const expansionName = gridSections["Expansion"]
      ? removeFieldMarkers(gridSections["Expansion"].find(".text-body-16").text()) || enSetRow.name
      : enSetRow.name;

    const scrapedSeriesName = gridSections["Series"]
      ? removeFieldMarkers(gridSections["Series"].find(".text-body-16").text()) || null
      : null;

    const variantPrices = parseVariantPrices($);
    const tcgplayer = buildTcgplayerLikeJson(variantPrices);

    const cardNumberSimple = normalizeSimpleNumber(printedNumber);
    const rowId = `scrydex:en:${enSetRow.id}:${safeSeg(cardNumberSimple)}`;

    const rawPrices = (variantPrices || []).filter(
      (v) => String(v.company || "").toLowerCase() === "raw"
    );

    const firstRawMarket =
      rawPrices.find((v) => v.market != null)?.market ?? null;

    const setJson = {
      id: enSetRow.id,
      url: SET.sourceUrl,
      name: expansionName || enSetRow.name,
      price: firstRawMarket,
      total: enSetRow.cards_count ?? null,
      images: {
        logo: enSetRow.logo_url || null,
        symbol: enSetRow.symbol_url || null,
      },
      series: enSetRow.series_name || scrapedSeriesName || null,
      releaseDate: enSetRow.release_date
        ? String(enSetRow.release_date).replace(/-/g, "/")
        : null,
    };

    return {
      id: rowId,
      name,
      supertype,
      subtypes,
      level: null,
      hp,
      types: types.length ? types : null,
      evolvesfrom: null,
      evolvesto: null,
      rules,
      attacks,
      abilities: null,
      weaknesses,
      resistances,
      retreatcost: retreat.retreatCost,
      convertedretreatcost: retreat.convertedRetreatCost,
      set: setJson,
      number: printedNumber,
      artist,
      rarity,
      flavortext: null,
      nationalpokedexnumbers: null,
      regulationmark: null,
      legalities: null,
      images: image
        ? {
            small: image,
            large: image,
          }
        : null,
      tcgplayer,
      cardmarket: null,
    };
  } finally {
    await page.close().catch(() => {});
  }
}

/* ---------------- Images ---------------- */
async function downloadBuffer(url) {
  const { data } = await axios.get(url, {
    responseType: "arraybuffer",
    headers: {
      "User-Agent": UA,
      Accept: "image/*",
      Referer: "https://scrydex.com/",
    },
    timeout: 60000,
  });

  return Buffer.from(data);
}

async function uploadToStorage(key, buffer) {
  const { error } = await sb.storage.from(STORAGE_BUCKET).upload(key, buffer, {
    contentType: "image/webp",
    upsert: true,
    cacheControl: "31536000",
  });

  if (error) {
    throw new Error(`Storage upload failed (${key}): ${error.message}`);
  }

  const { data } = sb.storage.from(STORAGE_BUCKET).getPublicUrl(key);
  return data?.publicUrl || null;
}

async function ensureUploadedImages(row) {
  const originalUrl = row?.images?.large || row?.images?.small || null;
  if (!originalUrl) return row;

  try {
    const buf = await downloadBuffer(originalUrl);
    const img = sharp(buf);

    const largeBuf = await img.clone().webp({ quality: 85 }).toBuffer();
    const smallBuf = await img
      .clone()
      .resize({ width: 600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const numTail = safeSeg(normalizeSimpleNumber(row.number) || "unknown");
    const baseKey = `cards/en/${safeSeg(row.set?.id || SET.dbSetId)}/${numTail}`;
    const smallKey = `${baseKey}-small.webp`;
    const largeKey = `${baseKey}-large.webp`;

    const [smallUrl, largeUrl] = await Promise.all([
      uploadToStorage(smallKey, smallBuf),
      uploadToStorage(largeKey, largeBuf),
    ]);

    return {
      ...row,
      images: {
        small: smallUrl || row.images?.small || null,
        large: largeUrl || row.images?.large || null,
      },
    };
  } catch (err) {
    console.warn(`⚠️ Image upload skipped for ${row.id}: ${err.message}`);
    return row;
  }
}

/* ---------------- Upsert ---------------- */
async function upsertCard(row) {
  const { error } = await sb.from("cards").upsert(row, { onConflict: "id" });
  if (error) {
    throw new Error(`Supabase upsert error for ${row.id}: ${error.message}`);
  }
}

/* ---------------- Main ---------------- */
async function main() {
  console.log("Reading en_sets row...");
  const enSetRow = await getEnSetRow();
  console.log(`Found set row: ${enSetRow.name} (${enSetRow.id})`);

  console.log("Launching Chrome persistent context...");
  const context = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: "chrome",
    headless: false,
    viewport: null,
    userAgent: UA,
    locale: "en-US",
    timezoneId: "Asia/Yerevan",
    args: [
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
    ],
  });

  try {
    const allCards = await collectCardLinks(context);
    const cards = MAX_CARDS ? allCards.slice(0, MAX_CARDS) : allCards;

    console.log(`Found ${allCards.length} cards on set page.`);
    console.log(`Test mode enabled, processing first ${cards.length}.`);

    if (!cards.length) {
      throw new Error("No card links found on Scrydex set page.");
    }

    let ok = 0;
    let failed = 0;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      console.log(`\n[${i + 1}/${cards.length}] ${card.title || card.url}`);

      try {
        let row = await scrapeCard(context, card.url, enSetRow);
        row = await ensureUploadedImages(row);
        await upsertCard(row);

        ok += 1;
        console.log(`✅ Imported ${row.name} (${row.number}) -> ${row.id}`);
      } catch (err) {
        failed += 1;
        console.error(`❌ Failed: ${card.url}`);
        console.error(err.message);
      }

      await sleep(DELAY_MS);
    }

    console.log("\nDone.");
    console.log(`Success: ${ok}`);
    console.log(`Failed : ${failed}`);
  } finally {
    await context.close().catch(() => {});
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});