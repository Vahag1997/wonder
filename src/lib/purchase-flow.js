// Browser contract only. Payment, ownership, quotas and release checks belong on
// the server. A return URL or local state must never grant a download entitlement.
export const ACTIVE_STATUSES = new Set([
  "preview_queued",
  "preview_generating",
  "payment_pending",
  "paid",
  "book_generating",
]);
export const PURCHASE_STATUSES = new Set([
  ...ACTIVE_STATUSES,
  "preview_ready",
  "preview_failed",
  "payment_failed",
  "book_failed",
  "completed",
  "expired",
  "cancelled",
]);
export function safeId(value) {
  return typeof value === "string" && /^[a-zA-Z0-9_-]{1,80}$/.test(value);
}
export function parsePurchase(value, { demo = false } = {}) {
  const invalid = () => {
    throw new Error("invalid_response");
  };
  if (!value || !safeId(value.id) || !PURCHASE_STATUSES.has(value.status))
    invalid();
  if (typeof value.paid !== "boolean") invalid();
  if (
    ["paid", "book_generating", "book_failed", "completed"].includes(
      value.status,
    ) &&
    !value.paid
  )
    invalid();
  if (
    [
      "preview_queued",
      "preview_generating",
      "preview_ready",
      "preview_failed",
      "payment_pending",
      "payment_failed",
    ].includes(value.status) &&
    value.paid
  )
    invalid();
  if (!Number.isFinite(Date.parse(value.expiresAt))) invalid();
  const pages = value.pages ?? [];
  if (!Array.isArray(pages) || pages.length > 2) invalid();
  const pageIds = new Set();
  for (const page of pages) {
    if (!safeId(page.id) || pageIds.has(page.id)) invalid();
    pageIds.add(page.id);
    const expected = `/api/personalizations/${value.id}/pages/${page.id}`;
    if (
      page.url !== expected &&
      !(demo && /^\/images\/books\/[a-z]+-\d+\.webp$/.test(page.url))
    )
      invalid();
  }
  if (
    [
      "preview_ready",
      "payment_pending",
      "payment_failed",
      "paid",
      "book_generating",
      "completed",
      "book_failed",
    ].includes(value.status) &&
    pages.length !== 2
  )
    invalid();
  const quote = value.quote ?? null;
  if (
    quote &&
    (!safeId(quote.id) ||
      !Number.isSafeInteger(quote.amountMinor) ||
      quote.amountMinor <= 0 ||
      quote.currency !== "RUB" ||
      !Number.isFinite(Date.parse(quote.expiresAt)))
  )
    invalid();
  if (value.status === "preview_ready" && !quote) invalid();
  const download = value.download ?? null;
  if (
    download &&
    (value.status !== "completed" ||
      !value.paid ||
      download !== `/api/personalizations/${value.id}/download`)
  )
    invalid();
  if (value.status === "completed" && !download && !demo) invalid();
  // Deliberately project only public fields. Never pass internal job/provider tokens through.
  return {
    id: value.id,
    status: value.status,
    paid: value.paid,
    pages: pages.map(({ id, url }) => ({ id, url })),
    quote: quote
      ? {
          id: quote.id,
          amountMinor: quote.amountMinor,
          currency: quote.currency,
          expiresAt: quote.expiresAt,
        }
      : null,
    expiresAt: value.expiresAt,
    download,
  };
}
export function canCheckout(job, now = Date.now()) {
  return (
    !!job &&
    job.pages?.length === 2 &&
    ["preview_ready", "payment_failed"].includes(job.status) &&
    !job.paid &&
    !!job.quote &&
    Date.parse(job.quote.expiresAt) > now &&
    Date.parse(job.expiresAt) > now
  );
}
export function formatChildAge(age, locale = "ru") {
  if (locale !== "ru") return `${age} ${age === 1 ? "year" : "years"}`;
  const unit = { one: "год", few: "года", many: "лет", other: "лет" }[
    new Intl.PluralRules("ru").select(age)
  ];
  return `${age} ${unit}`;
}
export function purchaseStep(status) {
  if (["completed", "book_generating", "book_failed", "paid"].includes(status))
    return 2;
  if (["payment_pending", "payment_failed"].includes(status)) return 1;
  return 0;
}
export function formatPrice(quote, locale = "ru") {
  if (!quote)
    return locale === "ru" ? "Цена пока не установлена" : "Price not set yet";
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    style: "currency",
    currency: quote.currency,
    maximumFractionDigits: 2,
  }).format(quote.amountMinor / 100);
}
