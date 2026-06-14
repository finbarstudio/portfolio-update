import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* paths are used, no remote patterns needed.
    remotePatterns: [],
  },
  // Contact was merged into /about (with a quick-contact drawer site-wide).
  // Preserve the old URL's link equity with a permanent redirect.
  async redirects() {
    return [{ source: "/contact", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
