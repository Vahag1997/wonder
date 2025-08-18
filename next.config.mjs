/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static optimization for pages that use Supabase
  experimental: {
    // This helps with SSR and prevents static generation issues
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Ensure environment variables are available during build
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
};

export default nextConfig;

