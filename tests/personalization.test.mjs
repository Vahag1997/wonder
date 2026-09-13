import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import {
  validateName,
  validatePhotoHeader,
  validatePhotoDimensions,
  MAX_PHOTO_BYTES,
} from "../src/lib/personalization.js";
import { books, getBook, languageName } from "../src/lib/catalog.js";

test("names support Unicode without changing spelling", () => {
  for (const name of [
    "Amir",
    "Иван",
    "Émile",
    "李明",
    "عمر",
    "O’Neil",
    "Anna-Maria",
  ])
    assert.deepEqual(validateName(name), { value: name });
});
test("names normalize whitespace and combining marks", () => {
  assert.equal(validateName("  Anna   Maria ").value, "Anna Maria");
  assert.equal(validateName("E\u0301mile").value, "Émile");
});
test("invalid names fail clearly", () => {
  assert.equal(validateName("  ").error, "required");
  assert.equal(validateName("a".repeat(41)).error, "length");
  for (const name of [
    "<script>",
    "Amir123",
    "😊",
    "Amir\u202E",
    "-Amir",
    "Amir--Ali",
    "\u0301",
  ])
    assert.equal(validateName(name).error, "characters");
});
test("image signatures and MIME types must agree", () => {
  const jpg = Uint8Array.of(255, 216, 255);
  const png = Uint8Array.of(137, 80, 78, 71, 13, 10, 26, 10);
  const webp = new TextEncoder().encode("RIFF1234WEBP");
  assert.equal(validatePhotoHeader(jpg, "image/jpeg", 200), null);
  assert.equal(validatePhotoHeader(png, "image/png", 200), null);
  assert.equal(validatePhotoHeader(webp, "image/webp", 200), null);
  assert.equal(validatePhotoHeader(png, "image/jpeg", 200), "type");
  assert.equal(
    validatePhotoHeader(new TextEncoder().encode("<svg>"), "image/png", 200),
    "type",
  );
});
test("empty, oversized, tiny and huge images are refused", () => {
  assert.equal(validatePhotoHeader([], "image/jpeg", 0), "size");
  assert.equal(
    validatePhotoHeader([], "image/jpeg", MAX_PHOTO_BYTES + 1),
    "size",
  );
  assert.equal(validatePhotoDimensions(319, 1000), "small");
  assert.equal(validatePhotoDimensions(10001, 320), "large");
  assert.equal(validatePhotoDimensions(6000, 5000), "large");
  assert.equal(validatePhotoDimensions(1024, 1536), null);
});
test("catalogue assets exist and local manifest page counts match when available", () => {
  const ids = new Set();
  for (const book of books) {
    assert(!ids.has(book.slug));
    ids.add(book.slug);
    assert.equal(getBook(book.slug), book);
    assert(book.samples.length > 1);
    for (const asset of [book.cover, ...book.samples])
      assert(existsSync(new URL(`../public${asset}`, import.meta.url)));
    const manifestPath = new URL(
      `../../ChildBook/book_templates/${book.templateId}.json`,
      import.meta.url,
    );
    if (existsSync(manifestPath)) {
      const manifest = JSON.parse(readFileSync(manifestPath));
      assert.equal(manifest.page_count, book.spreads);
    }
  }
  assert.equal(getBook("unknown"), undefined);
});
test("reference books are not offered for personalization", () => {
  assert.equal(books.filter((book) => book.supported).length, 1);
  for (const book of books.filter((book) => book.sourceNotice))
    assert.equal(book.supported, false);
  assert.equal(languageName("ru", "en"), "Russian");
  assert.equal(languageName("en", "ru"), "Английский");
});
test("preview wizard contains no network or durable photo storage", () => {
  const source = readFileSync(
    new URL(
      "../src/components/wonder/PersonalizationWizard.jsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert(
    !/\bfetch\(|\baxios\.|localStorage|sessionStorage|indexedDB/.test(source),
  );
  assert(source.includes("URL.revokeObjectURL"));
  assert(source.includes("fileVersion"));
});
