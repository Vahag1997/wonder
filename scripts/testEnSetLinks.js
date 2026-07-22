/* eslint-disable no-console */

const axios = require("axios");
const cheerio = require("cheerio");

const BASE = "https://www.tcgcollector.com";
const SETS_URL =
  "https://www.tcgcollector.com/sets/intl?cardCountMode=anyCardVariant&releaseDateOrder=newToOld&displayAs=images";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

function abs(u) {
  try {
    return new URL(u, BASE).href;
  } catch {
    return u || null;
  }
}

async function fetchHtml(url) {
  const response = await axios.get(url, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html",
    },
  });

  return response.data;
}

async function main() {
  console.log("Opening sets page...");
  const setsHtml = await fetchHtml(SETS_URL);
  const $sets = cheerio.load(setsHtml);

  const setLinks = [];

  $sets(".set-logo-grid-item-name").each((_, el) => {
    const $el = $sets(el);
    const name = $el.text().trim();
    const href = $el.attr("href");
    const code = $el
      .closest(".set-logo-grid-item-header")
      .find(".set-logo-grid-item-code")
      .text()
      .trim();

    setLinks.push({
      name,
      code,
      href: abs(href),
    });
  });

  console.log(`Found ${setLinks.length} set links on sets page.`);

  const ascendedSet = setLinks.find(
    (s) =>
      s.name.toLowerCase() === "ascended heroes" ||
      s.code.toUpperCase() === "ASC"
  );

  if (!ascendedSet) {
    throw new Error("Ascended Heroes set link not found.");
  }

  console.log("\nAscended Heroes set found:");
  console.log(ascendedSet);

  console.log("\nOpening Ascended Heroes set page...");
  const setHtml = await fetchHtml(ascendedSet.href);
  const $set = cheerio.load(setHtml);

  const cards = [];

  $set("#card-image-grid .card-image-grid-item").each((_, el) => {
    const $el = $set(el);

    const cardId = $el.attr("data-card-id") || null;

    const $link = $el.find("a.card-image-grid-item-link").first();
    const href = $link.attr("href") || null;
    const title = $link.attr("title") || null;

    const image = $el.find("img.card-image-grid-item-image").first().attr("src") || null;

    const number = $el
      .find(".card-image-grid-item-info-overlay-number")
      .first()
      .text()
      .trim() || null;

    const priceText = $el
      .find(".card-price-details-modal-show-button")
      .first()
      .text()
      .trim() || null;

    cards.push({
      cardId,
      title,
      href: abs(href),
      image: abs(image),
      number,
      priceText,
    });
  });

  console.log(`Found ${cards.length} cards in #card-image-grid.`);

  console.log("\nFirst 10 cards:");
  console.log(cards.slice(0, 10));

  if (cards.length > 0) {
    console.log("\nFirst card URL test:");
    console.log(cards[0].href);
  }

  console.log("\nDone.");
}

main().catch((error) => {
  console.error("Fatal error:");
  console.error(error.response?.status || error.message);
  if (error.response?.data) {
    const text =
      typeof error.response.data === "string"
        ? error.response.data.slice(0, 500)
        : error.response.data;
    console.error(text);
  }
  process.exit(1);
});