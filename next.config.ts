import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* paths, plus Shopify's CDN for store product images.
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
    ],
  },
  // Contact was merged into /about (with a quick-contact drawer site-wide).
  // Preserve the old URL's link equity with a permanent redirect.
  async redirects() {
    return [{ source: "/contact", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
