/* eslint-disable no-console */

const { createClient } = require("@supabase/supabase-js");

/**
 * ============================================================
 * ENV
 * ============================================================
 * Required:
 * - SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional:
 * - SUPABASE_JP_SETS_BUCKET=jpsets
 */

const SUPABASE_URL = "https://orvklxcroobcnwzgiank.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";

const STORAGE_BUCKET = process.env.SUPABASE_JP_SETS_BUCKET || "jpsets";

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing env vars. Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
  );
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

/**
 * ============================================================
 * SET TO UPSERT
 * ============================================================
 *
 * We use tcgc_set_id conflict handling because your table has:
 * - primary key on id
 * - unique key on tcgc_set_id
 *
 * If the row already exists with another id, this script will still update it.
 */

const SET_TO_UPSERT = {
  id: "m3",
  tcgc_set_id: 11684,
  name: "Nullifying Zero",
  code: "M3",
  cards_count: 117,
  release_date: "2026-01-23",
  price_usd: 757,
  logo_source_url:
    "https://static.tcgcollector.com/content/images/91/0e/f9/910ef9abfbfb389a10dbbbe206cb055a94b122f7bb895cbc791453d892ea0df1.webp",
  symbol_source_url:
    "https://static.tcgcollector.com/content/images/0c/b1/81/0cb1817c32d3971f1b95158d5b052919ba33669a1291a240fb924fdff3e33262.webp",

  /**
   * Set these 2 exactly how you want in db.
   * If you use another jp series naming style, just change them here.
   */
  series_name: "Mega Evolution Era",
  series_slug: "mega-evolution-era",
};

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function guessContentType(url) {
  const lower = String(url || "").toLowerCase().split("?")[0];
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function getFileExtensionFromUrl(url) {
  const cleanUrl = String(url || "").split("?")[0].toLowerCase();
  if (cleanUrl.endsWith(".png")) return "png";
  if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) return "jpg";
  if (cleanUrl.endsWith(".webp")) return "webp";
  if (cleanUrl.endsWith(".svg")) return "svg";
  return "bin";
}

async function downloadFileAsBuffer(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0",
      accept: "*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${url} (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function uploadToSupabaseStorage({
  bucket,
  path,
  sourceUrl,
  upsert = true,
}) {
  const fileBuffer = await downloadFileAsBuffer(sourceUrl);
  const contentType = guessContentType(sourceUrl);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, fileBuffer, {
      contentType,
      upsert,
    });

  if (uploadError) {
    throw new Error(
      `Storage upload failed for ${path}: ${uploadError.message}`
    );
  }

  const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);

  if (!publicUrlData?.publicUrl) {
    throw new Error(`Could not get public URL for ${path}`);
  }

  return publicUrlData.publicUrl;
}

async function ensureSetAssets(setItem) {
  const logoExt = getFileExtensionFromUrl(setItem.logo_source_url);
  const symbolExt = getFileExtensionFromUrl(setItem.symbol_source_url);

  const logoPath = `${setItem.id}/logo.${logoExt}`;
  const symbolPath = `${setItem.id}/symbol.${symbolExt}`;

  console.log(`Uploading assets for ${setItem.name}...`);

  const logoUrl = await uploadToSupabaseStorage({
    bucket: STORAGE_BUCKET,
    path: logoPath,
    sourceUrl: setItem.logo_source_url,
    upsert: true,
  });

  const symbolUrl = await uploadToSupabaseStorage({
    bucket: STORAGE_BUCKET,
    path: symbolPath,
    sourceUrl: setItem.symbol_source_url,
    upsert: true,
  });

  return {
    logo_url: logoUrl,
    symbol_url: symbolUrl,
  };
}

async function findExistingRowByTcgcSetId(tcgcSetId) {
  const { data, error } = await supabase
    .from("jp_sets")
    .select("id, tcgc_set_id, name")
    .eq("tcgc_set_id", tcgcSetId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Failed checking existing jp_sets row by tcgc_set_id: ${error.message}`
    );
  }

  return data || null;
}

async function upsertJpSet(row) {
  const existing = await findExistingRowByTcgcSetId(row.tcgc_set_id);

  const payload = {
    id: existing?.id || row.id,
    tcgc_set_id: row.tcgc_set_id,
    name: row.name,
    logo_url: row.logo_url,
    symbol_url: row.symbol_url,
    series_name: row.series_name,
    series_slug: row.series_slug,
    cards_count: row.cards_count,
    release_date: row.release_date,
    price_usd: row.price_usd,
  };

  const { error } = await supabase
    .from("jp_sets")
    .upsert(payload, { onConflict: "tcgc_set_id" });

  if (error) {
    throw new Error(`Failed to upsert set ${row.name}: ${error.message}`);
  }

  return payload;
}

/**
 * ============================================================
 * MAIN
 * ============================================================
 */

async function main() {
  console.log("Starting JP set updater...");
  console.log(`Bucket: ${STORAGE_BUCKET}`);
  console.log(`Set: ${SET_TO_UPSERT.name} (${SET_TO_UPSERT.id})`);

  const existing = await findExistingRowByTcgcSetId(SET_TO_UPSERT.tcgc_set_id);
  if (existing) {
    console.log(
      `Existing row found for tcgc_set_id=${SET_TO_UPSERT.tcgc_set_id}: id=${existing.id}, name=${existing.name}`
    );
  } else {
    console.log("No existing row found by tcgc_set_id. A new row will be inserted.");
  }

  const assets = await ensureSetAssets(SET_TO_UPSERT);

  const dbRow = {
    ...SET_TO_UPSERT,
    logo_url: assets.logo_url,
    symbol_url: assets.symbol_url,
  };

  const saved = await upsertJpSet(dbRow);

  console.log(`✅ Upserted JP set: ${saved.name}`);
  console.log(`   id: ${saved.id}`);
  console.log(`   tcgc_set_id: ${saved.tcgc_set_id}`);
  console.log(`   logo_url: ${saved.logo_url}`);
  console.log(`   symbol_url: ${saved.symbol_url}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error);
  process.exit(1);
});