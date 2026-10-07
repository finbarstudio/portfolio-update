import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy — host-based rewrite for the web.finbar, lab and portfolio subdomains.
 *
 * NOTE (Next 16): the `middleware` file convention was renamed to `proxy`
 * (function `proxy`, file `proxy.ts`). This is the same edge/Node entry point.
 *
 * `web.finbar.studio/<path>` is rewritten to `/web/<path>` and
 * `lab.finbar.studio/<path>` to `/lab/<path>`, so both live in the same
 * app/deploy as the main site. `portfolio.finbar.studio` shows `/portfolio`
 * the same way; it has only its own pages, so any other path on that host
 * (the nav's Work and About, say) is sent on to the main site. The old sandbox subdomain was retired in
 * Oct 2026: anything arriving on it is sent to the studio home page.
 */

const RETIRED_HOSTS = new Set(["sandbox.finbar.studio", "sandbox.localhost"]);
const WEB_HOSTS = new Set(["web.finbar.studio", "web.localhost"]);
const LAB_HOSTS = new Set(["lab.finbar.studio", "lab.localhost"]);
const PORTFOLIO_HOSTS = new Set(["portfolio.finbar.studio", "portfolio.localhost"]);
/** The pages under app/portfolio, as seen on the subdomain. */
const PORTFOLIO_PATHS = new Set(["/", "/mock", "/portfolio", "/portfolio/mock"]);
/** Its tab icons and share cards. Next links them at their real /portfolio/...
 *  address, and they are served there as they are: a link-preview crawler
 *  should not have to follow a redirect to reach the card. */
const PORTFOLIO_META = /^\/portfolio\/(icon|apple-icon|opengraph-image|twitter-image)$/;
const MAIN_HOSTS = new Set(["www.finbar.studio", "finbar.studio"]);

/**
 * Rewrites a clean-URL subdomain request into its internal `/<prefix>` route
 * tree, keeping the visible URL clean. Public assets (files with an
 * extension) pass through untouched so they're
 * served from the root path rather than getting the prefix. If the prefix
 * leaks into the URL it's 308'd to the clean path first.
 */
function subdomain(request: NextRequest, prefix: string): NextResponse {
  const { pathname } = request.nextUrl;

  // Static files from /public (models, images, video, fonts, …) are served
  // from the ROOT path and must NOT get the app-route prefix, or they 404 on
  // the subdomain: the page shell loads (its JS is under the excluded
  // _next/static) but an asset fetch rewritten with the prefix would 404.
  if (/\.[^/]+$/.test(pathname)) return NextResponse.next();
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

  // ── Retired subdomain: send everything to the studio home page ──────────────
  if (RETIRED_HOSTS.has(host)) return NextResponse.redirect("https://www.finbar.studio/", 308);

  // ── web.finbar subdomain: clean URLs (no visible /web prefix) ───────────────
  if (WEB_HOSTS.has(host)) return subdomain(request, "web");

  // ── lab subdomain: clean URLs (no visible /lab prefix) ──────────────────────
  if (LAB_HOSTS.has(host)) return subdomain(request, "lab");

  // ── portfolio subdomain: its own pages get clean URLs; everything else on
  //    this host belongs to the main site. Files (and the /cv and
  //    /portfolio.pdf redirects, which run before this) pass straight through.
  if (PORTFOLIO_HOSTS.has(host)) {
    if (PORTFOLIO_META.test(pathname)) return NextResponse.next();
    if (PORTFOLIO_PATHS.has(pathname.replace(/(.)\/$/, "$1")) || /\.[^/]+$/.test(pathname)) return subdomain(request, "portfolio");
    return NextResponse.redirect(`https://www.finbar.studio${pathname}${request.nextUrl.search}`, 308);
  }

  // ── Main host: subdomain sections live on their own hosts, so 308 their
  //    prefixed paths there if they're ever hit directly on www/apex. ────────
  // Whole-segment match only: `/web-design` is a main-site page, not `/web`.
  for (const [prefix, canonical] of [["web", "web.finbar.studio"], ["lab", "lab.finbar.studio"], ["portfolio", "portfolio.finbar.studio"]] as const) {
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
