import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Local /public/images/* paths are used, no remote patterns needed.
    remotePatterns: [],
    // Allowed next/image quality values. 75 = portfolio default; the rest are
    // used by the Lindon demo (app/lindon/site). Next 16 rejects any quality
    // not in this list once the array is set.
    qualities: [40, 50, 55, 60, 75, 82, 85, 86, 88, 90],
    // Allow our own SVGs (e.g. the Lows wordmark) through next/image, sandboxed.
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Contact was merged into /about (with a quick-contact drawer site-wide).
  // Preserve the old URL's link equity with a permanent redirect.
  async redirects() {
    return [{ source: "/contact", destination: "/about", permanent: true }];
  },
};

export default nextConfig;
