// Explicit book-edition metadata, not an inference from a child's name or photo.
export const HERO_GENDERS = ["boy", "girl"];
export function normalizeGender(value) {
  return HERO_GENDERS.includes(value) ? value : "";
}
export function supportsHero(book, gender) {
  return Boolean(book?.supported && normalizeGender(gender) && book.heroGenders?.includes(gender));
}
export function filterStories(books, { gender = "", theme = "", query = "" } = {}, locale = "ru") {
  const selected = normalizeGender(gender);
  const search = typeof query === "string" ? query.trim().toLocaleLowerCase() : "";
  return books.filter(book =>
    (!selected || book.heroGenders?.includes(selected)) &&
    (!theme || book.theme === theme) &&
    `${book.title[locale]} ${book.description[locale]} ${book.sourceTitle}`.toLocaleLowerCase().includes(search),
  );
}
export function discoveryUrl({ gender = "", theme = "", query = "" } = {}) {
  const params = new URLSearchParams();
  if (normalizeGender(gender)) params.set("gender", gender);
  if (theme) params.set("theme", theme);
  if (query.trim()) params.set("q", query.trim());
  return `/books${params.size ? `?${params}` : ""}`;
}
