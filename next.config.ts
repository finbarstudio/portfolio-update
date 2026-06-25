import type { NextConfig } from "next";

/**
 * Baseline security headers applied to every response.
 *
 * The CSP is deliberately scoped to the directives that are safe without a nonce
 * pipeline: `base-uri` (block <base> injection), `object-src 'none'` (no plugins),
 * and `frame-ancestors` (clickjacking). A full `script-src` CSP is intentionally
 * omitted — the site renders inline JSON-LD and runs Three.js + ffmpeg.wasm
 * (eval/wasm/blob workers), so a non-nonce script-src would need 'unsafe-inline'
 * 'unsafe-eval' anyway, which buys little. `frame-ancestors` differs per route:
 * the /embed pages must be iframable on any site; everything else denies framing.
 */
const baseSecurityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // Embeds are meant to be framed by third parties: allow any ancestor and
      // omit X-Frame-Options (it can't express an allow-all).
      {
        source: "/embed/:path*",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors *" },
        ],
      },
      // Everything else: deny framing outright (clickjacking) + lock base/object.
      {
        source: "/((?!embed/).*)",
        headers: [
          ...baseSecurityHeaders,
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'" },
        ],
      },
    ];
  },
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
