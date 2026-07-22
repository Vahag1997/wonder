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
 * - SUPABASE_EN_SETS_BUCKET=ensets
 */

const SUPABASE_URL = "https://orvklxcroobcnwzgiank.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";

const STORAGE_BUCKET = process.env.SUPABASE_EN_SETS_BUCKET || "ensets";

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
 * SET TO RESTORE
 * ============================================================
 *
 * IMPORTANT ABOUT `id`:
 * I used `mep01` for Mega Evolution Promos.
 *
 * If your deleted row originally used another id,
 * replace it here BEFORE running.
 */

const SET_TO_UPSERT = {
  id: "mep01",
  tcgc_set_id: 11673,
  name: "Mega Evolution Promos",
  code: "MEP",
  series_name: "Mega Evolution Series",
  series_slug: "mega-evolution-series",
  cards_count: 45,
  release_date: "2025-09-13",
  price_usd: 283,
  logo_source_url:
    "https://static.tcgcollector.com/content/images/c0/df/61/c0df61b94b440c85d8c832c5d1e38e95b26a35c6c1f00a3b7bed2897646792ac.webp",
  symbol_source_url:
    "https://static.tcgcollector.com/content/images/86/3b/6f/863b6f89c0d93d3679804a232430e8064dca90909d1c4277b68f495508a02992.webp",
};

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

function guessContentType(url) {
  const lower = url.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function getFileExtensionFromUrl(url) {
  const cleanUrl = url.split("?")[0].toLowerCase();
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
  });

  const symbolUrl = await uploadToSupabaseStorage({
    bucket: STORAGE_BUCKET,
    path: symbolPath,
    sourceUrl: setItem.symbol_source_url,
  });

  return {
    logo_url: logoUrl,
    symbol_url: symbolUrl,
  };
}

async function upsertEnSet(row) {
  const payload = {
    id: row.id,
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
    .from("en_sets")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to upsert set ${row.name}: ${error.message}`);
  }
}

/**
 * ============================================================
 * MAIN
 * ============================================================
 */

async function main() {
  console.log("Starting Mega Evolution Promos restore...");
  console.log(`Bucket: ${STORAGE_BUCKET}`);
  console.log(`Set: ${SET_TO_UPSERT.name} (${SET_TO_UPSERT.id})`);

  const assets = await ensureSetAssets(SET_TO_UPSERT);

  const dbRow = {
    ...SET_TO_UPSERT,
    logo_url: assets.logo_url,
    symbol_url: assets.symbol_url,
  };

  await upsertEnSet(dbRow);

  console.log(`✅ Restored set: ${SET_TO_UPSERT.name}`);
  console.log(`   logo_url: ${dbRow.logo_url}`);
  console.log(`   symbol_url: ${dbRow.symbol_url}`);
  console.log("Done.");
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error);
  process.exit(1);
});