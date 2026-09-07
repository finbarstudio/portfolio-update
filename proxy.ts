import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy — host-based rewrite for the Sandbox and web.finbar subdomains.
 *
 * NOTE (Next 16): the `middleware` file convention was renamed to `proxy`
 * (function `proxy`, file `proxy.ts`). This is the same edge/Node entry point.
 *
 * `sandbox.finbar.studio/<path>` is rewritten to `/sandbox/<path>`, and
 * `web.finbar.studio/<path>` is rewritten to `/web/<path>`, so both live in the
 * same app/deploy as the portfolio. `/embed/*` stays reachable on every host
 * (stable embed URLs) — sandbox only. The sandbox's canonical redirect
 * (www/apex `/sandbox/*` → the subdomain) is unconditional here — same as it
 * always was — this refactor only extracts the shared rewrite logic into
 * `subdomain()`, it does not change sandbox behaviour. The `/web/*` → web.finbar
 * redirect follows the same shape; confirm web.finbar.studio's DNS/Vercel
 * domain is actually configured before relying on that 308 in production.
 */

const SANDBOX_HOSTS = new Set(["sandbox.finbar.studio", "sandbox.localhost"]);
const WEB_HOSTS = new Set(["web.finbar.studio", "web.localhost"]);
const MAIN_HOSTS = new Set(["www.finbar.studio", "finbar.studio"]);

/**
 * Rewrites a clean-URL subdomain request into its internal `/<prefix>` route
 * tree, keeping the visible URL clean. Public assets (files with an
 * extension) and, optionally, `/embed/*` pass through untouched so they're
 * served from the root path rather than getting the prefix. If the prefix
 * leaks into the URL it's 308'd to the clean path first.
 */
function subdomain(request: NextRequest, prefix: string, allowEmbed: boolean): NextResponse {
  const { pathname } = request.nextUrl;

  // Static files from /public (models, images, video, fonts, …) are served
  // from the ROOT path and must NOT get the app-route prefix, or they 404 on
  // the subdomain — which is what broke the sandbox tools: the page shell
  // loaded (its JS is under the excluded _next/static) but an asset fetch got
  // rewritten with the prefix → 404.
  if (/\.[^/]+$/.test(pathname)) return NextResponse.next();
  // Embeds are served as-is on every host (stable embed URLs) — sandbox only.
  if (allowEmbed && pathname.startsWith("/embed")) return NextResponse.next();
  // If the prefix leaked into the URL, 308 it to the clean path.
  // Match the prefix as a whole path segment only: `/web` and `/web/x`, never
  // `/web-design` (a real main-site page whose name merely starts the same).
  if (pathname === `/${prefix}` || pathname.startsWith(`/${prefix}/`)) {
    const clean = pathname.slice(prefix.length + 1) || "/";
    if (clean !== pathname) {
      const url = request.nextUrl.clone();
      url.pathname = clean;
      return NextResponse.redirect(url, 308);
    }
  }
  // Clean path → rewrite into the internal route tree (URL stays clean).
  const url = request.nextUrl.clone();
  url.pathname = `/${prefix}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export function proxy(request: NextRequest): NextResponse {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  // NOTE: the /builders password gate moved out of here. It's now an on-screen
  // form: app/(site)/builders/page.tsx checks the auth cookie server-side and
  // renders Gate.tsx (unlock server action in actions.ts) when it's missing.

  // ── Sandbox subdomain: clean URLs (no visible /sandbox prefix) ──────────────
  if (SANDBOX_HOSTS.has(host)) return subdomain(request, "sandbox", true);

  // ── web.finbar subdomain: clean URLs (no visible /web prefix) ───────────────
  if (WEB_HOSTS.has(host)) return subdomain(request, "web", false);

  // ── Main host: subdomain sections live on their own hosts, so 308 their
  //    prefixed paths there if they're ever hit directly on www/apex. ────────
  // Whole-segment match only: `/web-design` is a main-site page, not `/web`.
  for (const [prefix, canonical] of [["sandbox", "sandbox.finbar.studio"], ["web", "web.finbar.studio"]] as const) {
    if (MAIN_HOSTS.has(host) && (pathname === `/${prefix}` || pathname.startsWith(`/${prefix}/`))) {
      const url = request.nextUrl.clone();
      url.host = canonical;
      url.pathname = pathname.slice(prefix.length + 1) || "/";
      return NextResponse.redirect(url, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  // Run on page routes only; skip static assets + metadata files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
