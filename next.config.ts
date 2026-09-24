import type { NextConfig } from "next";

// Where public/media is served from in production: the Cloudflare R2 hostname.
// Unset locally, so media() is a no-op and Next serves the folder off disk.
// See lib/media.ts and AGENTS.md, "The media rule".
const mediaBase = (process.env.NEXT_PUBLIC_MEDIA_URL ?? "").replace(/\/+$/, "");
const mediaHost = mediaBase ? new URL(mediaBase).hostname : null;

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
  // COOP stays at the default (unsafe-none): COEP is omitted, so we never opt
  // into crossOriginIsolated and same-origin would buy little here.
  { key: "Cross-Origin-Opener-Policy", value: "unsafe-none" },
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
      // Everything else: framing allowed only for us. X-Frame-Options is
      // dropped because CSP frame-ancestors supersedes it in modern browsers.
      {
        source: "/((?!embed/).*)",
        headers: [
          ...baseSecurityHeaders,
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'" },
        ],
      },
      // public/media served off disk (local dev, or any deploy made before the
      // R2 cutover). In production these paths never reach Vercel: media()
      // points at the R2 hostname, which sets its own year-long immutable
      // cache, versioned by ?v=<manifest hash>.
      {
        source: "/media/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=86400" },
        ],
      },
      // Direct downloads. Plain static files under public/downloads: no route
      // code, no parameters, nothing user-controlled, so nothing to exploit.
      // Force a save dialog rather than inline rendering, keep them out of
      // search, cache for a day.
      {
        source: "/downloads/:path*",
        headers: [
          { key: "Content-Disposition", value: "attachment" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      // Except the CV: it opens in the browser, so a link to finbar.studio/cv
      // in an application email reads straight away instead of downloading.
      // Declared after the rule above so this Content-Disposition wins.
      {
        source: "/downloads/Finbar-Skitini-CV.pdf",
        headers: [{ key: "Content-Disposition", value: 'inline; filename="Finbar-Skitini-CV.pdf"' }],
      },
    ];
  },
  images: {
    // Images are local (public/media off disk) or on the one R2 hostname.
    ...(mediaHost ? { remotePatterns: [{ protocol: "https" as const, hostname: mediaHost }] } : {}),
    // Every media URL carries its file's content hash (?v=), so an optimised
    // image can never go stale: cache it for a month and pay for the
    // transformation once.
    minimumCacheTTL: 2678400,
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
  async redirects() {
    return [
      // finbar.studio/cursor = the CursorMania extension download. A redirect
      // (not a rewrite) so the browser saves it under the zip's real filename.
      { source: "/cursor", destination: "/downloads/cursormania-extension.zip", permanent: false },
      // finbar.studio/cv = the current CV (the Digital Designer version), shown in
      // the browser rather than downloaded (see the header rule above).
      // The ?v= is there for Cloudflare, which caches /downloads for a day by
      // URL: bump it whenever the PDF is replaced, or /cv serves the old CV.
      { source: "/cv", destination: "/downloads/Finbar-Skitini-CV.pdf?v=2026-09-22", permanent: false },
      // Safety net: public/media is not deployed once R2 serves it, so any
      // "/media/..." path that slipped past media() is bounced to the bucket
      // rather than 404ing. It costs a round trip; fix the reference instead.
      ...(mediaBase ? [{ source: "/media/:path*", destination: `${mediaBase}/:path*`, permanent: false }] : []),
    ];
  },
  async rewrites() {
    return [
      // Serve the generated brand icon at the conventional /favicon.ico path.
      // Next only emits /icon (from app/icon.tsx), so /favicon.ico 404s — and
      // that's the path browsers, crawlers and Google's favicon fetcher hit
      // first, which can keep an old cached favicon around. This makes it
      // resolve to the current mark (a PNG served with image/png, which they
      // accept at the .ico path).
      { source: "/favicon.ico", destination: "/icon" },
    ];
  },
};

export default nextConfig;
