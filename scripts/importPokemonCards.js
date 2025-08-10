import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";
import sharp from "sharp";

const supabaseUrl = "https://orvklxcroobcnwzgiank.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk";
const pokeKey = "96b19782-71f8-4f2d-b594-92674f19363d";
const supabase = createClient(supabaseUrl, supabaseKey);

const failedCards = [];

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

  if (res.status === 404) {
    console.warn(`⚠️ Skipping image download for ${filename} (404 Not Found)`);
    return null;
  }

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
  const id = card.id;

  const { data: existing, error: checkError } = await supabase
    .from("cards")
    .select("id")
    .eq("id", id)
    .maybeSingle();

  if (checkError) {
    console.error(`❌ Supabase check failed for ${id}:`, checkError.message);
    return false;
  }

  if (existing) {
    console.log(`⏭️ Skipping ${id} (already exists in Supabase)`);
    return false;
  }

  const cardStart = Date.now();

  try {
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

    if (error) {
      console.error(`❌ Error inserting ${id}:`, error.message);
      failedCards.push(id);
      return false;
    }

    console.log(
      `✅ [${id}] large: ${largeTime}ms, small: ${smallTime}ms, db: ${dbTime}ms, total: ${totalTime}ms`
    );

    return true;
  } catch (err) {
    console.error(`⚠️ Error processing card ${id}:`, err.message);
    failedCards.push(id);
    return false;
  }
}

async function importAllCards() {
  let page = 57; // ✅ Start from page 57
  const pageSize = 250;
  let totalImported = 0;

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

    for (let i = 0; i < cards.length; i++) {
      const success = await processSingleCard(cards[i]);
      if (success) totalImported++;
    }

    console.log(`✅ Page ${page} imported (${cards.length} cards)`);
    page++;
  }

  console.log(`🎉 Finished. Total cards imported: ${totalImported}`);

  if (failedCards.length > 0) {
    console.log("⚠️ Failed card IDs:");
    failedCards.forEach(id => console.log(` - ${id}`));
  }
}

importAllCards().catch(console.error);
















// import fetch from 'node-fetch'; // if using CommonJS, use: const fetch = require('node-fetch');

// const pokeKey = '96b19782-71f8-4f2d-b594-92674f19363d'; // your API key
// const cardId = 'xy5-1'; // change this to test other IDs

// async function fetchCardById(id) {
//   const url = `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(id)}`;

//   try {
//     const res = await fetch(url, {
//       headers: {
//         'X-Api-Key': pokeKey,
//       },
//     });

//     if (!res.ok) {
//       console.warn(`❌ Card not found (${id}): ${res.status}`);
//       const body = await res.text();
//       console.log('Response:', body);
//       return;
//     }

//     const json = await res.json();
//     console.log('🎴 Card data:', json.data);
//   } catch (err) {
//     console.error(`⚠️ Fetch error:`, err.message);
//   }
// }

// // Run it
// fetchCardById(cardId);
