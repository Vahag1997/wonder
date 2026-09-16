import test from "node:test";
import assert from "node:assert/strict";
import { books } from "../src/lib/catalog.js";
import { filterStories, discoveryUrl, normalizeGender, supportsHero } from "../src/lib/story-discovery.js";
import { createPurchaseClient } from "../src/lib/purchase-client.js";

test("gender filters use explicit editions and never infer from names", () => {
  assert.equal(filterStories(books, {gender:"boy"}).length, 3);
  assert.deepEqual(filterStories(books, {gender:"girl"}), []);
  assert.equal(filterStories(books, {gender:"boy",theme:"friendship",query:"дружба"})[0].slug, books[0].slug);
  assert.equal(filterStories(books, {gender:"boy",theme:"learning",query:"friend"},"en").length, 0);
  const girlEdition = {...books[0], slug:"test-girl",heroGenders:["girl"]};
  assert.deepEqual(filterStories([...books,girlEdition],{gender:"girl"}),[girlEdition]);
});
test("gender URLs preserve other filters and discard invalid selections", () => {
  for (const value of [null,undefined,"all","male",["boy"],"<script>"]) assert.equal(normalizeGender(value), "");
  assert.equal(discoveryUrl(), "/books");
  const url = new URL(discoveryUrl({gender:"girl",theme:"friendship",query:"Маша & друзья"}),"https://wonder.test");
  assert.equal(url.searchParams.get("gender"),"girl");
  assert.equal(url.searchParams.get("theme"),"friendship");
  assert.equal(url.searchParams.get("q"),"Маша & друзья");
});
test("only supported hero editions can reach the purchase client", async () => {
  let calls = 0;
  const api = createPurchaseClient(async () => { calls++; throw new Error("should not fetch"); });
  assert(supportsHero(books[0],"boy"));
  assert(!supportsHero(books[0],"girl"));
  assert(!supportsHero(books[1],"boy"));
  for (const gender of ["girl","",undefined,"invalid"]) await assert.rejects(api.create({gender},books[0],"test"), /unsupported_edition/);
  await assert.rejects(api.create({gender:"boy"},books[1],"test"), /unsupported_edition/);
  assert.equal(calls,0);
});
