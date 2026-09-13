import { parsePurchase, safeId } from "./purchase-flow.js";

export function createPurchaseClient(fetcher = fetch) {
  async function request(path, options = {}) {
    const response = await fetcher(`/api/personalizations${path}`, {
      ...options,
      credentials: "same-origin",
      cache: "no-store",
      redirect: "error",
      signal: options.signal
        ? AbortSignal.any([options.signal, AbortSignal.timeout(20000)])
        : AbortSignal.timeout(20000),
    });
    if (!response.ok) {
      const error = new Error(
        {
          401: "sign_in",
          403: "forbidden",
          404: "not_found",
          409: "conflict",
          410: "expired",
          413: "size",
          429: "limit",
          503: "unavailable",
        }[response.status] || "network",
      );
      throw error;
    }
    return response.json();
  }
  function jobPath(id) {
    if (!safeId(id)) throw new Error("invalid_response");
    return `/${id}`;
  }
  return {
    async create(details, book, key) {
      const body = new FormData();
      body.set("bookSlug", book.slug);
      body.set("childName", details.name);
      body.set("childAge", String(details.age));
      body.set("consent", String(details.consent));
      body.set("photo", details.photo.file);
      return parsePurchase(
        await request("", {
          method: "POST",
          headers: { "Idempotency-Key": key },
          body,
        }),
      );
    },
    async get(id, signal) {
      return parsePurchase(await request(jobPath(id), { signal }));
    },
    async checkout(job, key) {
      const result = await request(`${jobPath(job.id)}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": key },
        body: JSON.stringify({ quoteId: job.quote.id }),
      });
      // A server-owned same-origin route resolves the approved payment provider.
      // Never navigate to an arbitrary URL returned in a JSON response.
      const expected = `/api/personalizations/${job.id}/checkout/redirect`;
      if (result.redirect !== expected) throw new Error("invalid_response");
      return result;
    },
  };
}
