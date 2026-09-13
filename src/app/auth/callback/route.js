import { createClient } from "@/lib/supabaseServer";
import { safeAuthNext } from "@/lib/auth-flow";

export const dynamic = "force-dynamic";
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeAuthNext(url.searchParams.get("next"));
  if (code && code.length < 2048) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return new Response(null, { status: 303, headers: { Location: next, "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
    } catch { /* Do not include tokens or provider diagnostics in redirects/logs. */ }
  }
  return new Response(null, { status: 303, headers: { Location: "/login?notice=link-error", "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}
