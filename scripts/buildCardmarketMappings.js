/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const FILES = {
  singles: path.join(DATA_DIR, "products_singles_6.json"),
  nonsingles: path.join(DATA_DIR, "products_nonsingles_6.json"),
  prices: path.join(DATA_DIR, "price_guide_6.json"),
};

const STRONG_NAME_PATTERNS = [
  {
    source: "prefix_before_colon",
    score: 10,
    regex: /^(.+?):\s+.+$/,
  },
  {
    source: "booster_bundle_display",
    score: 9,
    regex: /^(.+?)\s+Booster Bundle Display(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "booster_box",
    score: 9,
    regex: /^(.+?)\s+Booster Box(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "booster_bundle",
    score: 9,
    regex: /^(.+?)\s+Booster Bundle(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "booster",
    score: 9,
    regex: /^(.+?)\s+Booster(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "elite_trainer_box",
    score: 9,
    regex: /^(.+?)\s+Elite Trainer Box(?:\s+Plus)?(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "build_and_battle",
    score: 8,
    regex: /^(.+?)\s+Build & Battle(?:\s+Box|\s+Stadium)?(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "theme_deck",
    score: 8,
    regex: /^(.+?)\s+Theme Deck(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "sleeved_booster",
    score: 8,
    regex: /^(.+?)\s+Sleeved Booster(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "display",
    score: 7,
    regex: /^(.+?)\s+Display(?:\s*\([^)]*\))?$/i,
  },
  {
    source: "fun_pack",
    score: 7,
    regex: /^(.+?)\s+Fun Pack(?:\s*\([^)]*\))?$/i,
  },
];

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function groupBy(items, getKey) {
  const map = new Map();

  for (const item of items) {
    const key = getKey(item);
    const list = map.get(key);

    if (list) {
      list.push(item);
    } else {
      map.set(key, [item]);
    }
  }

  return map;
}

function parseCardName(name) {
  const text = cleanText(name);
  const match = text.match(/^(.*?)\s*\[([^\]]+)\]\s*$/);

  if (!match) {
    return {
      baseName: text,
      variantLabel: null,
    };
  }

  return {
    baseName: cleanText(match[1]),
    variantLabel: cleanText(match[2]),
  };
}

function collectCandidatesFromName(name) {
  const text = cleanText(name);
  const candidates = [];

  for (const pattern of STRONG_NAME_PATTERNS) {
    const match = text.match(pattern.regex);

    if (!match) {
      continue;
    }

    const label = cleanText(match[1]);

    if (!label || label.length < 2) {
      continue;
    }

    candidates.push({
      label,
      source: pattern.source,
      score: pattern.score,
      productName: text,
    });
  }

  return candidates;
}

function inferSetName(products) {
  const votes = new Map();

  for (const product of products) {
    const candidates = collectCandidatesFromName(product.name);

    for (const candidate of candidates) {
      const existing = votes.get(candidate.label);

      if (existing) {
        existing.totalScore += candidate.score;
        existing.hits += 1;
        existing.sources.add(candidate.source);
        if (existing.examples.length < 3) {
          existing.examples.push(candidate.productName);
        }
      } else {
        votes.set(candidate.label, {
          label: candidate.label,
          totalScore: candidate.score,
          hits: 1,
          sources: new Set([candidate.source]),
          examples: [candidate.productName],
        });
      }
    }
  }

  const ranked = [...votes.values()].sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }

    if (b.hits !== a.hits) {
      return b.hits - a.hits;
    }

    return a.label.localeCompare(b.label);
  });

  if (ranked.length === 0) {
    return {
      inferredSetName: null,
      confidence: "unknown",
      sourceExamples: [],
      alternatives: [],
    };
  }

  const best = ranked[0];
  let confidence = "low";

  if (best.totalScore >= 18 || best.hits >= 3) {
    confidence = "high";
  } else if (best.totalScore >= 9 || best.hits >= 2) {
    confidence = "medium";
  }

  return {
    inferredSetName: best.label,
    confidence,
    sourceExamples: best.examples,
    alternatives: ranked.slice(1, 4).map((item) => ({
      label: item.label,
      hits: item.hits,
      totalScore: item.totalScore,
    })),
  };
}

function buildMetacardIndex(singles) {
  const grouped = groupBy(singles, (item) => item.idMetacard);
  const index = new Map();

  for (const [idMetacard, items] of grouped.entries()) {
    const nameCounts = new Map();

    for (const item of items) {
      const parsed = parseCardName(item.name);
      const current = nameCounts.get(parsed.baseName) || 0;
      nameCounts.set(parsed.baseName, current + 1);
    }

    const metacardName = [...nameCounts.entries()]
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }

        return a[0].localeCompare(b[0]);
      })[0][0];

    index.set(idMetacard, {
      metacardName,
      printCount: items.length,
      expansionCount: new Set(items.map((item) => item.idExpansion)).size,
    });
  }

  return index;
}

function summarizeCategories(products) {
  return [...new Set(products.map((item) => item.categoryName))].sort();
}

function main() {
  const singles = readJson(FILES.singles).products || [];
  const nonsingles = readJson(FILES.nonsingles).products || [];
  const priceGuides = readJson(FILES.prices).priceGuides || [];

  const singlesByExpansion = groupBy(singles, (item) => item.idExpansion);
  const nonsinglesByExpansion = groupBy(nonsingles, (item) => item.idExpansion);
  const priceByProductId = new Map(priceGuides.map((item) => [item.idProduct, item]));
  const metacardIndex = buildMetacardIndex(singles);

  const expansionIds = new Set([
    ...singlesByExpansion.keys(),
    ...nonsinglesByExpansion.keys(),
  ]);

  const setMappings = [...expansionIds]
    .sort((a, b) => a - b)
    .map((idExpansion) => {
      const singleItems = singlesByExpansion.get(idExpansion) || [];
      const nonsingleItems = nonsinglesByExpansion.get(idExpansion) || [];
      const inference = inferSetName(nonsingleItems);

      return {
        idExpansion,
        inferredSetName: inference.inferredSetName,
        confidence: inference.confidence,
        singlesCount: singleItems.length,
        nonsinglesCount: nonsingleItems.length,
        totalCount: singleItems.length + nonsingleItems.length,
        singleCategories: summarizeCategories(singleItems),
        nonsingleCategories: summarizeCategories(nonsingleItems),
        sampleSingles: singleItems.slice(0, 5).map((item) => item.name),
        sampleNonsingles: nonsingleItems.slice(0, 5).map((item) => item.name),
        sourceExamples: inference.sourceExamples,
        alternatives: inference.alternatives,
      };
    });

  const setMapByExpansion = new Map(
    setMappings.map((item) => [item.idExpansion, item])
  );

  const cardMappings = singles
    .slice()
    .sort((a, b) => a.idProduct - b.idProduct)
    .map((item) => {
      const parsedName = parseCardName(item.name);
      const setInfo = setMapByExpansion.get(item.idExpansion) || null;
      const metacardInfo = metacardIndex.get(item.idMetacard) || null;
      const price = priceByProductId.get(item.idProduct) || null;

      return {
        idProduct: item.idProduct,
        idExpansion: item.idExpansion,
        inferredSetName: setInfo ? setInfo.inferredSetName : null,
        setNameConfidence: setInfo ? setInfo.confidence : "unknown",
        name: item.name,
        baseName: parsedName.baseName,
        variantLabel: parsedName.variantLabel,
        idMetacard: item.idMetacard,
        metacardName: metacardInfo ? metacardInfo.metacardName : parsedName.baseName,
        metacardPrintCount: metacardInfo ? metacardInfo.printCount : 1,
        metacardExpansionCount: metacardInfo ? metacardInfo.expansionCount : 1,
        dateAdded: item.dateAdded,
        priceGuide: price,
      };
    });

  const summary = {
    generatedAt: new Date().toISOString(),
    totals: {
      singles: singles.length,
      nonsingles: nonsingles.length,
      priceGuides: priceGuides.length,
      expansions: setMappings.length,
      expansionsWithInferredName: setMappings.filter(
        (item) => item.inferredSetName
      ).length,
      expansionsWithUnknownName: setMappings.filter(
        (item) => !item.inferredSetName
      ).length,
      cardMappings: cardMappings.length,
    },
    confidenceBreakdown: {
      high: setMappings.filter((item) => item.confidence === "high").length,
      medium: setMappings.filter((item) => item.confidence === "medium").length,
      low: setMappings.filter((item) => item.confidence === "low").length,
      unknown: setMappings.filter((item) => item.confidence === "unknown").length,
    },
  };

  const setsOutputPath = path.join(DATA_DIR, "cardmarket_sets_map.json");
  const cardsOutputPath = path.join(DATA_DIR, "cardmarket_cards_map.json");
  const summaryOutputPath = path.join(DATA_DIR, "cardmarket_mapping_summary.json");

  fs.writeFileSync(
    setsOutputPath,
    `${JSON.stringify({ summary, sets: setMappings }, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    cardsOutputPath,
    `${JSON.stringify({ summary, cards: cardMappings }, null, 2)}\n`,
    "utf8"
  );
  fs.writeFileSync(
    summaryOutputPath,
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8"
  );

  console.log(`Wrote sets map to ${setsOutputPath}`);
  console.log(`Wrote cards map to ${cardsOutputPath}`);
  console.log(`Wrote summary to ${summaryOutputPath}`);
  console.log(JSON.stringify(summary, null, 2));
}

main();
