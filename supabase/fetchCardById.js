const pokeKey = "96b19782-71f8-4f2d-b594-92674f19363d";

export default async function fetchCardById(id) {
  const url = `https://api.pokemontcg.io/v2/cards/${encodeURIComponent(id)}`;

  try {
    const res = await fetch(url, {
      headers: {
        "X-Api-Key": pokeKey,
      },
    });

    if (!res.ok) {
      console.warn(`❌ Card not found (${id}): ${res.status}`);
      return;
    }

    const json = await res.json();
    console.log("🎴 Card data:", json.data);
  } catch (err) {
    console.error(`⚠️ Error fetching card ${id}:`, err.message);
  }
}


