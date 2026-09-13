// Fail closed until the customer identity, private storage, verified payment
// and split preview/completion workflow have been integrated and tested.
// Do not proxy these requests to ChildBook's full-book /api/personalize endpoint.
export const dynamic = "force-dynamic";
function unavailable() {
  return Response.json(
    {
      error: {
        code: "unavailable",
        message: "Personalization and checkout are not connected yet.",
      },
    },
    {
      status: 503,
      headers: {
        "Cache-Control": "private, no-store",
        "Retry-After": "3600",
        "X-Robots-Tag": "noindex, nofollow",
      },
    },
  );
}
export const GET = unavailable;
export const POST = unavailable;
export const DELETE = unavailable;
