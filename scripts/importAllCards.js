import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import sharp from "sharp";

const supabaseUrl = "https://orvklxcroobcnwzgiank.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";
const pokeKey = "96b19782-71f8-4f2d-b594-92674f19363d";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`Fetch error: ${res.statusText}`);
      const json = await res.json();
      return json;
    } catch (err) {
      console.warn(`⚠️ Attempt ${i + 1} failed: ${err.message}`);
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error("❌ All retries failed.");
}

async function downloadAndCompressImage(url, filename, quality, width) {
  const downloadStart = Date.now();
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const buffer = await res.buffer();
  const downloadTime = Date.now() - downloadStart;

  const compressStart = Date.now();
  const compressed = await sharp(buffer)
    .resize({ width })
    .webp({ quality })
    .toBuffer();
  const compressTime = Date.now() - compressStart;

  const uploadStart = Date.now();
  const { error } = await supabase.storage
    .from("cards")
    .upload(filename, compressed, {
      contentType: "image/webp",
      upsert: true,
    });
  const uploadTime = Date.now() - uploadStart;

  if (error) {
    console.error(`❌ Upload failed for ${filename}:`, error.message);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from("cards")
    .getPublicUrl(filename);

  console.log(
    `🖼️ ${filename} → download: ${downloadTime}ms, compress: ${compressTime}ms, upload: ${uploadTime}ms`
  );

  return publicUrlData.publicUrl;
}

async function processSingleCard(card) {
  const cardStart = Date.now();
  try {
    const id = card.id;

    const largeStart = Date.now();
    const largeImageUrl = card.images?.large
      ? await downloadAndCompressImage(
          card.images.large,
          `${id}_large.webp`,
          80,
          1024
        )
      : null;
    const largeTime = Date.now() - largeStart;

    const smallStart = Date.now();
    const smallImageUrl = card.images?.small
      ? await downloadAndCompressImage(
          card.images.small,
          `${id}_small.webp`,
          50,
          320
        )
      : null;
    const smallTime = Date.now() - smallStart;

    const payload = {
      id,
      name: card.name || null,
      supertype: card.supertype || null,
      subtypes: card.subtypes || [],
      level: card.level || null,
      hp: parseInt(card.hp, 10) || null,
      types: card.types || [],
      evolvesfrom: card.evolvesFrom || null,
      evolvesto: card.evolvesTo || [],
      rules: card.rules || [],
      attacks: card.attacks || null,
      abilities: card.abilities || null,
      weaknesses: card.weaknesses || null,
      resistances: card.resistances || null,
      retreatcost: card.retreatCost || [],
      convertedretreatcost: card.convertedRetreatCost || null,
      set: card.set || null,
      number: card.number || null,
      artist: card.artist || null,
      rarity: card.rarity || null,
      flavortext: card.flavorText || null,
      nationalpokedexnumbers: card.nationalPokedexNumbers || [],
      regulationmark: card.regulationMark || null,
      legalities: card.legalities || null,
      images: {
        small: smallImageUrl,
        large: largeImageUrl,
      },
      tcgplayer: card.tcgplayer || null,
      cardmarket: card.cardmarket || null,
    };

    const dbStart = Date.now();
    const { error } = await supabase.from("cards").upsert(payload);
    const dbTime = Date.now() - dbStart;

    const totalTime = Date.now() - cardStart;

    console.log(
      `✅ [${id}] large: ${largeTime}ms, small: ${smallTime}ms, db: ${dbTime}ms, total: ${totalTime}ms`
    );

    if (error) {
      console.error(`❌ Error inserting ${id}:`, error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`⚠️ Error processing card ${card.id}:`, err.message);
    return false;
  }
}

async function importAllCards() {
  let page = 8;
  const pageSize = 250;
  let totalImported = 0;
  const parallelLimit = 5;

  while (true) {
    const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`;
    let json;

    try {
      json = await fetchWithRetry(url, {
        headers: { "X-Api-Key": pokeKey },
      });
    } catch (err) {
      console.error(`❌ Fetch failed on page ${page}: ${err.message}`);
      break;
    }

    const cards = json?.data;
    if (!cards || cards.length === 0) break;

    for (let i = 0; i < cards.length; i += parallelLimit) {
      const batch = cards.slice(i, i + parallelLimit);
      const results = await Promise.allSettled(batch.map(processSingleCard));

      results.forEach((result, index) => {
        const cardId = batch[index].id;
        if (result.status === "fulfilled" && result.value) {
          totalImported++;
        } else {
          console.error(`❌ Failed to import card ${cardId}`);
        }
      });
    }

    console.log(`✅ Page ${page} imported (${cards.length} cards)`);
    page++;
  }

  console.log(`🎉 Finished. Total cards imported: ${totalImported}`);
}

importAllCards().catch(console.error);
