/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DEFAULT_FILES = {
  singles: path.join(DATA_DIR, "products_singles_6.json"),
  nonsingles: path.join(DATA_DIR, "products_nonsingles_6.json"),
  prices: path.join(DATA_DIR, "price_guide_6.json"),
};

function parseArgs(argv) {
  const options = {
    type: "singles",
    limit: 20,
    set: null,
    out: null,
    listExpansions: 0,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--type") {
      options.type = String(argv[i + 1] || "").toLowerCase();
      i += 1;
      continue;
    }

    if (arg === "--limit") {
      options.limit = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--set") {
      options.set = Number(argv[i + 1]);
      i += 1;
      continue;
    }

    if (arg === "--out") {
      options.out = argv[i + 1] || null;
      i += 1;
      continue;
    }

    if (arg === "--list-expansions") {
      const next = argv[i + 1];
      if (next && !next.startsWith("--")) {
        options.listExpansions = Number(next);
        i += 1;
      } else {
        options.listExpansions = 20;
      }
    }
  }

  if (!["singles", "nonsingles", "all"].includes(options.type)) {
    throw new Error("--type must be one of: singles, nonsingles, all");
  }

  if (!Number.isInteger(options.limit) || options.limit < 0) {
    throw new Error("--limit must be a number >= 0");
  }

  if (options.set !== null && (!Number.isInteger(options.set) || options.set <= 0)) {
    throw new Error("--set must be a positive integer");
  }

  if (
    options.listExpansions &&
    (!Number.isInteger(options.listExpansions) || options.listExpansions < 0)
  ) {
    throw new Error("--list-expansions must be a number >= 0");
  }

  return options;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function getProductsByType(type, singles, nonsingles) {
  if (type === "all") {
    return [...singles, ...nonsingles];
  }

  if (type === "nonsingles") {
    return nonsingles;
  }

  return singles;
}

function buildOutputPath(options) {
  if (options.out) {
    return path.isAbsolute(options.out)
      ? options.out
      : path.join(process.cwd(), options.out);
  }

  if (options.set) {
    return path.join(DATA_DIR, `cardmarket_set_${options.set}_${options.type}.json`);
  }

  return path.join(DATA_DIR, `cardmarket_sample_${options.limit}_${options.type}.json`);
}

function mergeProductsWithPrices(products, priceMap) {
  return products.map((product) => ({
    ...product,
    priceGuide: priceMap.get(product.idProduct) || null,
  }));
}

function listExpansionCounts(products, limit) {
  const counts = new Map();

  for (const product of products) {
    const current = counts.get(product.idExpansion) || 0;
    counts.set(product.idExpansion, current + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([idExpansion, count]) => ({
      idExpansion,
      count,
    }));
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  const singlesData = readJson(DEFAULT_FILES.singles);
  const nonsinglesData = readJson(DEFAULT_FILES.nonsingles);
  const pricesData = readJson(DEFAULT_FILES.prices);

  const singles = singlesData.products || [];
  const nonsingles = nonsinglesData.products || [];
  const prices = pricesData.priceGuides || [];

  const selectedProducts = getProductsByType(options.type, singles, nonsingles);

  if (options.listExpansions) {
    const expansions = listExpansionCounts(selectedProducts, options.listExpansions);
    console.log(JSON.stringify(expansions, null, 2));
    return;
  }

  const priceMap = new Map(prices.map((row) => [row.idProduct, row]));

  let filtered = selectedProducts;

  if (options.set !== null) {
    filtered = filtered.filter((product) => product.idExpansion === options.set);
  }

  filtered = filtered.sort((a, b) => a.idProduct - b.idProduct);

  if (options.limit > 0) {
    filtered = filtered.slice(0, options.limit);
  }

  const items = mergeProductsWithPrices(filtered, priceMap);
  const outPath = buildOutputPath(options);

  const payload = {
    generatedAt: new Date().toISOString(),
    filters: {
      type: options.type,
      set: options.set,
      limit: options.limit,
    },
    counts: {
      singles: singles.length,
      nonsingles: nonsingles.length,
      prices: prices.length,
      selected: items.length,
    },
    sourceFiles: DEFAULT_FILES,
    items,
  };

  fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(`Wrote ${items.length} records to ${outPath}`);

  if (items.length === 0) {
    console.log("No records matched the current filters.");
    return;
  }

  console.log("First record:");
  console.log(JSON.stringify(items[0], null, 2));
}

main();
