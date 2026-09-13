// Explicit UI demonstration. Never calls an API, stores a photo, creates an
// order, or claims that the original designer illustrations are personalized.
import { parsePurchase } from "./purchase-flow.js";
export function createDemoPurchaseClient(book) {
  let job;
  let nextStatus;
  function snapshot() {
    return parsePurchase(job, { demo: true });
  }
  return {
    async create() {
      job = {
        id: "demo-order",
        status: "preview_queued",
        paid: false,
        pages: [],
        quote: null,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        download: null,
      };
      nextStatus = "preview_ready";
      return snapshot();
    },
    async get() {
      if (nextStatus === "preview_ready") {
        job = {
          ...job,
          status: nextStatus,
          pages: book.samples
            .slice(1, 3)
            .map((url, i) => ({ id: `page-${i + 1}`, url })),
          quote: {
            id: "demo-quote",
            amountMinor: 199000,
            currency: "RUB",
            expiresAt: job.expiresAt,
          },
        };
      } else if (nextStatus) job = { ...job, status: nextStatus };
      nextStatus = null;
      return snapshot();
    },
    async checkout() {
      job = { ...job, status: "payment_pending" };
      return snapshot();
    },
    async simulatePayment(success) {
      job = {
        ...job,
        status: success ? "book_generating" : "payment_failed",
        paid: success,
      };
      nextStatus = success ? "completed" : null;
      return snapshot();
    },
  };
}
