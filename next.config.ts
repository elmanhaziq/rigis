import type { NextConfig } from "next";

/**
 * RIGIS is deployed as a fully static site on Cloudflare Pages.
 * Everything dynamic (auth, data, uploads) happens in the browser through the
 * Supabase JS client and is protected by Row Level Security in Postgres.
 *
 * Constraints that follow from `output: "export"`:
 * - no server actions, route handlers that read the request, middleware/proxy,
 *   rewrites/redirects/headers in this file (use public/_redirects and
 *   public/_headers for Cloudflare instead)
 * - every dynamic segment needs generateStaticParams()
 * - next/image cannot use the default optimiser, so images are unoptimised and
 *   compressed to WebP in the browser before upload instead
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
