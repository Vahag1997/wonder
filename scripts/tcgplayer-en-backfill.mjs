#!/usr/bin/env node
// scripts/tcgplayer-en-backfill.mjs
//
// Incremental updater: re-scrapes but only INSERTS NEW price points
// (does NOT update existing points). Uses a (card_id, source, series_key, bucket_end_at) key.
//
// Single URL:
//   node scripts/tcgplayer-en-backfill.mjs "https://www.tcgplayer.com/product/123456" --timeframe 3M --no-headless --debug
//
// Batch EN backfill from Supabase (defaults shown):
//   node scripts/tcgplayer-en-backfill.mjs --all-en --table cards --id id --tcg tcgplayer --timeframe 3M --batch 300 --concurrency 4 --no-headless --debug
//
// Page-only listing (no scraping):
//   node scripts/tcgplayer-en-backfill.mjs --all-en --page 1 --list-only --debug
//
// Install:
//   npm i -D playwright @supabase/supabase-js
//   npx playwright install chromium
//
// Requires Node 18+.

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// --------------------- CLI flags (no deps) ---------------------
function parseFlags(argv) {
  const args = { _: [] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      if (v === undefined) {
        const next = argv[i + 1];
        if (next && !next.startsWith('-')) { args[k] = next; i++; }
        else { args[k] = true; }
      } else args[k] = v;
    } else args._.push(a);
  }
  return args;
}
const flags = parseFlags(process.argv);

// Modes
const ALL_EN = Boolean(flags['all-en']);
const urlArg = flags._[0];

// General options
const timeframe = (flags.timeframe || '3M').toUpperCase(); // 1M|3M|6M|1Y
const timeoutSec = Number(flags.timeout || 60);
const debug = Boolean(flags.debug);
const headless = !Boolean(flags['no-headless']);
const WAIT = timeoutSec * 1000;

// Supabase config (kept as in your snippet for drop-in compatibility)
const SUPABASE_URL = "https://orvklxcroobcnwzgiank.supabase.co";
const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";

// Tables/fields for batch mode
const EN_TABLE = String(flags.table || 'cards');
const ID_COL = String(flags.id || 'id');
const TCG_FIELD = String(flags.tcg || 'tcgplayer');

// Batch behavior
const PAGE_SIZE = Math.max(1, Number(flags.batch || 300));
const CONCURRENCY = Math.max(1, Number(flags.concurrency || 4)); // default 4 now
const FORCE = Boolean(flags.force); // still accepted, but "only-new" logic makes it mostly redundant

// Resume / paging / listing
const RESUME = Boolean(flags.resume);
const CHECKPOINT = String(flags.checkpoint || '.tcg-backfill.ckpt.json');
const PAGE = flags.page ? Math.max(1, Number(flags.page)) : null; // 1-indexed
const LIST_ONLY = Boolean(flags['list-only']);

// --------------------- Utilities ---------------------
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugKey(label, fallback) {
  if (!label) return fallback;
  return label.toString()
    .trim()
    .toLowerCase()
    .replace(/\s*-\s*/g, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, '_')
    .replace(/^_+|_+$/g, '');
}

function parseMoney(s) {
  if (!s) return null;
  const cleaned = String(s).replace(/[^\d.,-]/g, '').replace(/,/g, '');
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

// "6/7 to 6/9" -> { m1:6,d1:7,m2:6,d2:9 }
function parsePeriod(period) {
  const m = String(period).match(/^\s*(\d{1,2})\/(\d{1,2})\s+to\s+(\d{1,2})\/(\d{1,2})\s*$/i);
  if (!m) return null;
  return { m1: +m[1], d1: +m[2], m2: +m[3], d2: +m[4] };
}

function toPricePoints(rows, key, { yearHint = new Date().getFullYear(), useBucketEnd = true } = {}) {
  const pts = [];
  let year = yearHint;
  let prevEndMonth = null;

  for (const r of rows) {
    const p = parsePeriod(r.period);
    if (!p) continue;

    const endMonth = p.m2;
    if (prevEndMonth != null && endMonth < prevEndMonth) year += 1; // Dec -> Jan
    prevEndMonth = endMonth;

    const endDate = new Date(Date.UTC(year, p.m2 - 1, p.d2, 12, 0, 0));
    const startDate = new Date(Date.UTC(year, p.m1 - 1, p.d1, 12, 0, 0));
    const x = useBucketEnd ? endDate : startDate;

    const y = parseMoney(r[key]);
    if (y != null) pts.push({ x, y });
  }
  pts.sort((a, b) => +a.x - +b.x);
  return pts;
}

const AFFIL_PARAMS = new Set([
  'irclickid','irpid','irgwc','utm_source','utm_medium','utm_campaign',
  'utm_term','utm_content','clickid','affid','aff','gclid','fbclid','msclkid'
]);

function stripAffiliateParams(u) {
  const url = new URL(u, 'https://www.tcgplayer.com');
  for (const k of AFFIL_PARAMS) url.searchParams.delete(k);
  url.hash = '';
  return url;
}

async function resolveAndSanitizeUrl(raw, language = 'English') {
  try {
    const u = new URL(raw);
    let finalUrl = raw;

    // Follow prices.pokemontcg.io if present (no-browser path)
    if (/\bprices\.pokemontcg\.io\b/i.test(u.hostname)) {
      const res = await fetch(raw, { redirect: 'manual' });
      let loc = res.headers.get('location');

      if (!loc) {
        const html = await res.text().catch(() => '');
        let m = html && html.match(/https?:\/\/www\.tcgplayer\.com\/product\/\d+[^\s"'<>)]*/i);
        if (!m) {
          const m2 = html && html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
          if (m2) loc = m2[1];
        } else {
          loc = m[0];
        }
      }
      if (loc) finalUrl = loc;
    }

    // Clean & enforce Language
    const out = stripAffiliateParams(finalUrl);
    if (language && !out.searchParams.get('Language')) {
      out.searchParams.set('Language', language);
    }
    return out.toString();
  } catch {
    return raw;
  }
}

// --------------------- Playwright scrape ---------------------
const SEL_HISTORY_CONTAINER = '[data-testid="History"],.martech-charts-history';
const SEL_HISTORY_TABLE = `${SEL_HISTORY_CONTAINER}
.martech-charts-chart .chart-container table`;
const SEL_TIMEFRAME_BTN = (label) => `.charts-time-frame
.charts-item:has-text("${label}")`;
const SEL_POINTS_CONDITION = '.price-guide__points-header__condition';

async function acceptCookies(page) {
  const selectors = [
    'button:has-text("Accept All")',
    'button:has-text("Accept all")',
    'button:has-text("Accept")',
    'button:has-text("Agree")',
    'button:has-text("I Accept")',
    '[data-testid="accept-all"]',
    '.cookie-accept-all',
  ];
  for (const sel of selectors) {
    try {
      const el = page.locator(sel).first();
      if (await el.count()) {
        if (await el.isVisible().catch(() => false)) {
          await el.click({ timeout: 1200 }).catch(() => {});
          if (debug) console.error('[debug] clicked cookie button:', sel);
          break;
        }
      }
    } catch {}
  }
}

async function gotoProduct(page, url) {
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (/\b(googletagmanager|google-analytics|doubleclick|optimizely|hotjar|segment|facebook)\b/i.test(u)) {
      return route.abort().catch(() => {});
    }
    route.continue().catch(() => {});
  });

  await page.setDefaultNavigationTimeout(WAIT);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: WAIT });
  await sleep(500);
  await acceptCookies(page);
  await sleep(500);

  try {
    const canon = await page.locator('link[rel="canonical"]').first().getAttribute('href');
    if (canon) page._canonicalUrl = canon;
  } catch {}
}

async function ensureTimeframe(page, label) {
  if (!label) return;
  const btn = page.locator(SEL_TIMEFRAME_BTN(label)).first();
  if (await btn.count()) {
    await btn.scrollIntoViewIfNeeded().catch(() => {});
    await btn.click({ timeout: 1500 }).catch(() => {});
    if (debug) console.error('[debug] timeframe click:', label);
    await sleep(600);
  } else if (debug) {
    console.error('[debug] timeframe button not found:', label);
  }
}

async function waitForHistoryTable(page) {
  const started = Date.now();
  await page.waitForSelector(SEL_HISTORY_CONTAINER, { timeout: WAIT, state: 'attached' });

  for (let i = 0; i < Math.max(1, Math.ceil(WAIT / 1000)); i++) {
    const found = await page.evaluate(({ selTable }) => {
      const t = document.querySelector(selTable);
      if (!t) return { has: false, rows: 0, ths: 0 };
      return {
        has: true,
        rows: t.querySelectorAll('tbody tr').length,
        ths: t.querySelectorAll('thead th').length,
      };
    }, { selTable: SEL_HISTORY_TABLE });

    if (debug) console.error('[debug] history table probe:', found, `elapsed ${Date.now() - started}ms`);
    if (found.has && found.rows > 0) return true;
    await sleep(1000);
  }
  return false;
}

async function extractConditionLabel(page) {
  try {
    const el = page.locator(SEL_POINTS_CONDITION).first();
    if (await el.count()) {
      const text = await el.textContent();
      const clean = (text || '').trim();
      if (clean) return clean; // e.g. "Lightly Played"
    }
  } catch {}
  return null;
}

async function extractHistory(page) {
  return await page.evaluate(({ selTable }) => {
    const t = document.querySelector(selTable);
    if (!t) return { headers: [], rows: [] };
    const headers = Array.from(t.querySelectorAll('thead th')).map(th => (th.textContent || '').trim());
    const rows = Array.from(t.querySelectorAll('tbody tr')).map(tr =>
      Array.from(tr.querySelectorAll('td')).map(td => (td.textContent || '').trim())
    );
    return { headers, rows };
  }, { selTable: SEL_HISTORY_TABLE });
}

function normalizeRows(headers, rows) {
  const keys = headers.map((h, i) => (i === 0 ? 'period' : (slugKey(h, `col_${i}`) || `col_${i}`)));
  const out = rows.map(r => {
    const obj = {};
    for (let i = 0; i < r.length; i++) obj[keys[i] || `col_${i}`] = r[i];
    return obj;
  });
  return { keys, rows: out };
}

function currencyFromRows(rows) {
  const flat = rows.flatMap(r => r);
  const usd = flat.find(v => /^\$\s?\d/.test(v));
  return usd ? 'USD' : 'USD';
}

// scrape ONE raw URL
async function scrapeOne(page, rawUrl, timeframe) {
  const cleanUrl = await resolveAndSanitizeUrl(rawUrl, 'English');
  await gotoProduct(page, cleanUrl);
  await ensureTimeframe(page, timeframe);

  const ok = await waitForHistoryTable(page);
  if (!ok) throw new Error('History table not found or empty');

  const conditionLabel = await extractConditionLabel(page); // e.g. "Lightly Played"
  const conditionKey = conditionLabel ? slugKey(conditionLabel) : null;

  const { headers, rows } = await extractHistory(page);
  const { keys, rows: normalized } = normalizeRows(headers, rows);
  const currency = currencyFromRows(rows);

  return {
    url: cleanUrl,
    meta: {
      source: 'tcgplayer',
      inputUrl: rawUrl,
      resolvedUrl: cleanUrl,
      canonicalUrl: page._canonicalUrl || null,
      currency,
      timeframe,
      columnHeaders: headers,
      keys,
      condition_label: conditionLabel || null,
      condition_key: conditionKey || null
    },
    rows: normalized
  };
}

// --------------------- Supabase helpers ---------------------
function mkSb() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Set SUPABASE_URL and SUPABASE_KEY (service role).');
  }
  return createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
}

function getUrlFromRow(row) {
  const f = row[TCG_FIELD];
  if (!f) return null;
  if (typeof f === 'string') {
    try { const obj = JSON.parse(f); return obj?.url || null; } catch { return null; }
  }
  if (typeof f === 'object') return f?.url || null;
  return null;
}

function pickSeriesKeys(normalizedRows) {
  if (!normalizedRows.length) return [];
  const keys = Object.keys(normalizedRows[0]).filter(k => k !== 'period' && !/^col_/i.test(k));
  return keys.length ? keys : Object.keys(normalizedRows[0]).filter(k => k !== 'period');
}

function makeUpserts(card_id, payload) {
  const yearHint = new Date().getFullYear();
  const out = [];
  const seriesKeys = pickSeriesKeys(payload.rows);

  const condKey = payload.meta.condition_key;   // e.g. "lightly_played"
  const condLabel = payload.meta.condition_label; // e.g. "Lightly Played"

  for (const finishLabel of seriesKeys) {
    const pts = toPricePoints(payload.rows, finishLabel, { yearHint, useBucketEnd: true });

    const finishKey = slugKey(finishLabel, finishLabel);
    const series_key = condKey ? `${condKey}__${finishKey}` : finishKey;  // e.g. lightly_played__holofoil
    const series_label = condLabel ? `${condLabel} ${finishLabel}` : finishLabel;

    for (const p of pts) {
      out.push({
        card_id,
        source: 'tcgplayer',
        series_key,
        series_label,
        currency: payload.meta.currency || 'USD',
        bucket_end_at: p.x.toISOString(),
        value: p.y,
        fetched_at: new Date().toISOString(),
        meta: {
          url: payload.url,
          timeframe: payload.meta.timeframe,
          condition: condLabel || null
        }
      });
    }
  }
  return out;
}

// --- NEW: incremental-only helpers (insert only NEW points) ---
function minMaxISO(upserts) {
  let min = null, max = null;
  for (const u of upserts) {
    const t = u.bucket_end_at;
    if (!t) continue;
    if (!min || t < min) min = t;
    if (!max || t > max) max = t;
  }
  return { minISO: min, maxISO: max };
}

async function fetchExistingForUpserts(supabase, card_id, upserts) {
  if (!upserts.length) return [];
  const seriesKeys = Array.from(new Set(upserts.map(u => u.series_key)));
  const { minISO, maxISO } = minMaxISO(upserts);
  const { data, error } = await supabase
    .from('price_history_points')
    .select('series_key,bucket_end_at')
    .eq('card_id', card_id)
    .eq('source', 'tcgplayer')
    .in('series_key', seriesKeys)
    .gte('bucket_end_at', minISO)
    .lte('bucket_end_at', maxISO);
  if (error) throw error;
  return data || [];
}

function filterOnlyNew(upserts, existingRows) {
  const existingSet = new Set(existingRows.map(r => `${r.series_key}|${r.bucket_end_at}`));
  return upserts.filter(u => !existingSet.has(`${u.series_key}|${u.bucket_end_at}`));
}

async function upsertPointsOnlyNew(supabase, rows) {
  if (!rows.length) return { inserted: 0 };
  const CHUNK = 500;
  let inserted = 0;
  for (let i = 0; i < rows.length; i += CHUNK) {
    const chunk = rows.slice(i, i + CHUNK);
    const { error, count } = await supabase
      .from('price_history_points')
      .upsert(chunk, {
        onConflict: 'card_id,source,series_key,bucket_end_at',
        ignoreDuplicates: true,              // <-- do not update existing rows
        returning: 'minimal',                // reduce payload
      });
    if (error) throw error;
    inserted += chunk.length; // best-effort; returning=minimal doesn't give affected count
  }
  return { inserted };
}

// --------------------- Checkpoint helpers ---------------------
function loadCheckpoint() {
  try { return JSON.parse(fs.readFileSync(CHECKPOINT, 'utf8')); }
  catch { return null; }
}
function saveCheckpoint(obj) {
  try { fs.writeFileSync(CHECKPOINT, JSON.stringify(obj, null, 2)); }
  catch {}
}

// --------------------- Batch EN runner ---------------------
async function runAllEN() {
  const supabase = mkSb();

  // If listing only and no scraping, we don't need a browser
  const needBrowser = !LIST_ONLY;
  const browser = needBrowser ? await chromium.launch({ headless }) : null;
  const context = needBrowser ? await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
    viewport: { width: 1366, height: 900 },
    locale: 'en-US',
  }) : null;

  let totalProcessed = 0, totalInserted = 0, totalSkipped = 0;

  try {
    // ---- Single PAGE mode (offset pagination) ----
    if (PAGE) {
      const offset = (PAGE - 1) * PAGE_SIZE;
      const { data, error } = await supabase
        .from(EN_TABLE)
        .select(`${ID_COL}, ${TCG_FIELD}`)
        .order(ID_COL, { ascending: true })
        .range(offset, offset + PAGE_SIZE - 1);
      if (error) throw error;

      const jobs = (data || [])
        .map(r => ({ card_id: r[ID_COL], url: getUrlFromRow(r) }))
        .filter(j => j.url);

      if (debug) console.error(`[page] ${PAGE} offset=${offset} fetched=${data?.length || 0} withUrl=${jobs.length}`);

      if (LIST_ONLY) {
        for (const j of jobs) console.log(`${j.card_id}\t${j.url}`);
        return;
      }

      let idx = 0;
      const work = async (job) => {
        const page = await context.newPage();
        try {
          // (We no longer skip if any data exists; we always scrape and then insert only NEW rows)
          const payload = await scrapeOne(page, job.url, timeframe);
          const upserts = makeUpserts(job.card_id, payload);

          // diff with existing keys for the scraped span
          const existing = await fetchExistingForUpserts(supabase, job.card_id, upserts);
          const onlyNew = filterOnlyNew(upserts, existing);

          if (!onlyNew.length) {
            totalSkipped++;
            if (debug) console.error(`[ok] ${job.card_id} no NEW points`);
          } else {
            const { inserted } = await upsertPointsOnlyNew(supabase, onlyNew);
            totalInserted += inserted;
            if (debug) console.error(`[ok] ${job.card_id} inserted ${inserted} NEW pts`);
          }
        } catch (e) {
          console.error(`[err] ${job.card_id} -> ${e?.message || e}`);
          try {
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            await page.screenshot({ path: `tcgplayer_backfill_err_${job.card_id}_${ts}.png`, fullPage: true }).catch(() => {});
          } catch {}
        } finally { await page.close().catch(() => {}); }
        await sleep(400 + Math.random() * 400);
      };

      const pool = [];
      while (idx < jobs.length || pool.length) {
        while (pool.length < CONCURRENCY && idx < jobs.length) {
          const p = work(jobs[idx++]);
          pool.push(p);
          p.finally(() => {
            const i = pool.indexOf(p);
            if (i >= 0) pool.splice(i, 1);
          });
        }
        await Promise.race(pool).catch(() => {});
      }

      totalProcessed += jobs.length;
      console.error(`[done page ${PAGE}] processed=${totalProcessed} insertedNEW=${totalInserted} noChange=${totalSkipped}`);
      return;
    }

    // ---- Full run (keyset pagination) with optional --resume ----
    let lastId = null;
    if (RESUME) {
      const ck = loadCheckpoint();
      if (ck && ck.table === EN_TABLE && ck.id_col === ID_COL) {
        lastId = ck.startAfterId || null;
        if (debug) console.error('[resume] continuing after id:', lastId);
      } else if (debug) {
        console.error('[resume] no valid checkpoint found; starting fresh');
      }
    }

    while (true) {
      let q = supabase
        .from(EN_TABLE)
        .select(`${ID_COL}, ${TCG_FIELD}`)
        .order(ID_COL, { ascending: true })
        .limit(PAGE_SIZE);

      if (lastId) q = q.gt(ID_COL, lastId);

      const { data, error } = await q;
      if (error) throw error;
      if (!data || !data.length) break;

      const jobs = data
        .map(r => ({ card_id: r[ID_COL], url: getUrlFromRow(r) }))
        .filter(j => j.url);

      if (debug) console.error(`[debug] startAfterId=${lastId} fetched=${data.length} withUrl=${jobs.length}`);

      if (LIST_ONLY) {
        for (const j of jobs) console.log(`${j.card_id}\t${j.url}`);
        // advance keyset and continue listing
        lastId = data[data.length - 1][ID_COL];
        if (RESUME) saveCheckpoint({
          table: EN_TABLE, id_col: ID_COL, startAfterId: lastId,
          updatedAt: new Date().toISOString(), timeframe, page_size: PAGE_SIZE,
        });
        continue;
      }

      let idx = 0;
      const work = async (job) => {
        const page = await context.newPage();
        try {
          // Always scrape; then insert only NEW keys for that scraped window
          const payload = await scrapeOne(page, job.url, timeframe);
          const upserts = makeUpserts(job.card_id, payload);

          const existing = await fetchExistingForUpserts(supabase, job.card_id, upserts);
          const onlyNew = filterOnlyNew(upserts, existing);

          if (!onlyNew.length) {
            totalSkipped++;
            if (debug) console.error(`[ok] ${job.card_id} no NEW points`);
          } else {
            const { inserted } = await upsertPointsOnlyNew(supabase, onlyNew);
            totalInserted += inserted;
            if (debug) console.error(`[ok] ${job.card_id} inserted ${inserted} NEW pts`);
          }
        } catch (e) {
          console.error(`[err] ${job.card_id} -> ${e?.message || e}`);
          try {
            const ts = new Date().toISOString().replace(/[:.]/g, '-');
            await page.screenshot({ path: `tcgplayer_backfill_err_${job.card_id}_${ts}.png`, fullPage: true }).catch(() => {});
          } catch {}
        } finally { await page.close().catch(() => {}); }
        await sleep(400 + Math.random() * 400);
      };

      const pool = [];
      while (idx < jobs.length || pool.length) {
        while (pool.length < CONCURRENCY && idx < jobs.length) {
          const p = work(jobs[idx++]);
          pool.push(p);
          p.finally(() => {
            const i = pool.indexOf(p);
            if (i >= 0) pool.splice(i, 1);
          });
        }
        await Promise.race(pool).catch(() => {});
      }

      totalProcessed += jobs.length;
      lastId = data[data.length - 1][ID_COL];

      if (RESUME) {
        saveCheckpoint({
          table: EN_TABLE,
          id_col: ID_COL,
          startAfterId: lastId,
          updatedAt: new Date().toISOString(),
          timeframe,
          page_size: PAGE_SIZE,
        });
        if (debug) console.error('[resume] checkpoint saved:', lastId);
      }
    }

    console.error(`[done] processed=${totalProcessed} insertedNEW=${totalInserted} noChange=${totalSkipped}`);
  } finally {
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
  }
}

// --------------------- Main ---------------------
(async () => {
  if (ALL_EN) {
    await runAllEN().catch((e) => {
      console.error('Batch EN error:', e?.message || e);
      process.exit(2);
    });
    return;
  }

  // Single URL mode (unchanged: prints payload JSON)
  if (!urlArg) {
    console.error('Usage:\n  node scripts/tcgplayer-en-backfill.mjs "<tcgplayer-url or prices.pokemontcg.io url>" [--timeframe 1M|3M|6M|1Y] [--no-headless] [--debug]');
    process.exit(1);
  }

  let browser, context, page;
  try {
    browser = await chromium.launch({ headless });
    context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123 Safari/537.36',
      viewport: { width: 1366, height: 900 },
      locale: 'en-US'
    });
    page = await context.newPage();

    const payload = await scrapeOne(page, urlArg, timeframe);
    console.log(JSON.stringify(payload, null, 2));
    await context.close();
    await browser.close();
    process.exit(0);
  } catch (err) {
    try {
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      if (page) {
        await page.screenshot({ path: `tcgplayer_single_err_${ts}.png`, fullPage: true }).catch(() => {});
        const html = await page.content().catch(() => '');
        if (html) {
          const fs2 = await import('fs');
          fs2.writeFileSync(`tcgplayer_single_err_${ts}.html`, html);
        }
        console.error(`DEBUG saved: tcgplayer_single_err_${ts}.png / tcgplayer_single_err_${ts}.html`);
      }
    } catch {}
    console.error('Scrape error:', err?.message || err);
    try { await context?.close(); } catch {}
    try { await browser?.close(); } catch {}
    process.exit(2);
  }
})();
