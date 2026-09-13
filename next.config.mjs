/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.WONDER_BUILD_DIR || ".next",
  poweredByHeader: false,
  // Keep metadata and missing-book decisions ahead of response streaming.
  htmlLimitedBots: /.*/,
  reactStrictMode: true,
  images: {
    formats: ["image/webp"],
    localPatterns: [{ pathname: "/images/**" }, { pathname: "/og.png" }],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 96, 160, 256, 384],
    minimumCacheTTL: 86400,
  },
  async redirects() {
    return [
      "boy-explores-the-world-of-jobs",
      "girl-and-the-forest-friends",
      "adventures-under-the-sea",
      "space-cadet-dreams",
    ].map((slug) => ({
      source: `/books/${slug}`,
      destination: "/books",
      permanent: true,
    }));
  },
  async headers() {
    const headers = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
    ];
    if (process.env.NODE_ENV === "production") {
      const authUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      let authOrigin = "";
      if (authUrl) {
        const url = new URL(authUrl);
        if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co"))
          throw new Error("Expected an HTTPS Supabase project URL");
        authOrigin = url.origin;
      }
      headers.push({
        key: "Content-Security-Policy",
        value: `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' blob: data:; font-src 'self'; connect-src 'self' ${authOrigin}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';`,
      });
      if (process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://"))
        headers.push({
          key: "Strict-Transport-Security",
          value: "max-age=31536000",
        });
    }
    return [
      { source: "/:path*", headers },
      // Auth links can carry one-time codes. The generic same-origin referrer
      // policy must not override the stricter policy on callback responses.
      { source: "/auth/:path*", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] },
      { source: "/reset", headers: [{ key: "Referrer-Policy", value: "no-referrer" }] },
    ];
  },
};
export default nextConfig;
