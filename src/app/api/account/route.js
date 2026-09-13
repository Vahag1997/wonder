import { createClient } from "@/lib/supabaseServer";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store, max-age=0" };
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return Response.json({ error: "unauthorized" }, { status: 401, headers });
    return Response.json({ user: { id: data.user.id, email: data.user.email, emailConfirmed: !!data.user.email_confirmed_at } }, { headers });
  } catch { return Response.json({ error: "unavailable" }, { status: 503, headers }); }
}
