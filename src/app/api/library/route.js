import { createClient } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0" };
export async function GET(request) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user || !data.user.email_confirmed_at) return Response.json({ error: "unauthorized" }, { status: 401, headers });
    const url = new URL(request.url);
    const orders = url.searchParams.get("kind") === "orders";
    const id = url.searchParams.get("id");
    if (id && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return Response.json({ error: "invalid_id" }, { status: 400, headers });
    // Explicit ownership plus database RLS. Never include arbitrary file_url or
    // private data JSON in list responses; downloads use their own guarded route.
    let query = supabase.from(orders ? "orders" : "my_books").select("id,status,created_at,product:products(id,title)").eq("user_id", data.user.id).order("created_at", { ascending: false }).limit(50);
    if (id) query = query.eq("id", id);
    const result = await query;
    if (result.error) return Response.json({ error: "unavailable" }, { status: 503, headers });
    if (id && !result.data.length) return Response.json({ error: "not_found" }, { status: 404, headers });
    return Response.json({ records: result.data }, { headers });
  } catch { return Response.json({ error: "unavailable" }, { status: 503, headers }); }
}
