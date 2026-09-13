import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function middleware(request) {
  let response = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookies, headers = {}) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([name, value]) => response.headers.set(name, value));
        },
      },
    });
    // Network-verified identity. Route handlers verify again before data access.
    // Never use getSession() as proof of identity on the server.
    try { await supabase.auth.getUser(); } catch { /* The destination shows the unavailable state. */ }
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export const config = {
  matcher: ["/account/:path*", "/my-books/:path*", "/orders/:path*", "/login", "/register", "/reset", "/auth/:path*", "/api/account/:path*", "/api/library/:path*", "/api/personalizations/:path*"],
};
