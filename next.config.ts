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
  // Process isolation without breaking anything: same-origin windows only
  // (no cross-window handles), and resources loadable from our own site
  // (www + sandbox subdomains are the same site). COEP is deliberately
  // omitted — it would require CORP on every third-party resource.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
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
      // Long-lived caching for /public assets (the "Add Expires headers"
      // audit). NOT immutable: this repo replaces images/videos in place, so a
      // day of freshness + a day of stale-while-revalidate keeps repeat views
      // instant while capping worst-case staleness at ~2 days. When a replaced
      // asset must appear immediately (e.g. a re-recorded case-study video),
      // bump a ?v= query on its reference to bust already-cached copies.
      {
        source: "/(images|models)/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=86400" },
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
  // NOTE: /contact used to 308 to /about (contact once lived there). It's a
  // real page again — if a browser cached the old permanent redirect it will
  // keep bouncing until its cache expires; a hard refresh clears it.
  // GemFest + PullUp: self-contained static sites living in /public/<name> (all
  // their internal refs are absolute /<name>/… paths). Next doesn't serve a
  // directory index from /public, so map each clean URL onto its index.html.
  async rewrites() {
    return [
      { source: "/gemfest", destination: "/gemfest/index.html" },
      { source: "/pullup", destination: "/pullup/index.html" },
    ];
  },
};

export default nextConfig;
