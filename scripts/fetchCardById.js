import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const supabase = createClient(
  "https://orvklxcroobcnwzgiank.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjY2MTUyOSwiZXhwIjoyMDY4MjM3NTI5fQ.UWUAHGJ3EdkOM8tMZXNS39veEnOQSxlXTocpS0HVNbk"
);

const pokeKey = "96b19782-71f8-4f2d-b594-92674f19363d";

async function fetchPage(page, pageSize = 250) {
  const url = `https://api.pokemontcg.io/v2/cards?page=${page}&pageSize=${pageSize}`;
  const res = await fetch(url, {
    // headers: { "X-Api-Key": pokeKey },
  });
  if (!res.ok) throw new Error(`Fetch error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

async function updateCardPrices(card) {
  const id = card.id;
  const tcgplayer = card.tcgplayer || null;
  const cardmarket = card.cardmarket || null;

  try {
    const { error } = await supabase
      .from("cards")
      .update({ tcgplayer, cardmarket })
      .eq("id", id);

    if (error) {
      console.error(`❌ Failed to update ${id}:`, error.message);
    } else {
      console.log(`✅ Updated ${id}`);
    }
  } catch (err) {
    console.error(`⚠️ Error processing ${id}:`, err.message);
  }
}

async function runUpdater() {
  let page = 1;
  const pageSize = 250;
  const batchSize = 5;
  let totalUpdated = 0;

  while (true) {
    console.log(`📦 Fetching page ${page}...`);
    let cards;

    try {
      cards = await fetchPage(page, pageSize);
    } catch (err) {
      console.error(`❌ Failed to fetch page ${page}:`, err.message);
      console.log("🔁 Retrying in 5 seconds...");
      await new Promise((res) => setTimeout(res, 5000)); // wait 5 seconds before retry
      continue; // try same page again
    }

    if (!cards || cards.length === 0) {
      console.log(`🚫 No cards found on page ${page}, skipping...`);
      page++;
      continue;
    }

    for (let i = 0; i < cards.length; i += batchSize) {
      const batch = cards.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((card) => updateCardPrices(card))
      );

      totalUpdated += results.filter((r) => r.status === "fulfilled").length;

      await new Promise((r) => setTimeout(r, 100)); // slight delay between batches
    }

    console.log(`✅ Page ${page} processed.`);
    page++;
  }

  // This line will never be reached due to the infinite loop
  // But you can optionally add a `maxPages` limit if needed
  // console.log(`🎉 Price update complete. Total updated cards: ${totalUpdated}`);
}

runUpdater().catch(console.error);
