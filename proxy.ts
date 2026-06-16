import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * proxy — host-based rewrite for the Sandbox subdomain.
 *
 * NOTE (Next 16): the `middleware` file convention was renamed to `proxy`
 * (function `proxy`, file `proxy.ts`). This is the same edge/Node entry point.
 *
 * `sandbox.finbar.studio/<path>` is rewritten to `/sandbox/<path>` so the Sandbox
 * lives in the same app/deploy as the portfolio. `/embed/*` stays reachable on
 * every host (stable embed URLs). The optional canonical redirect (www/apex
 * `/sandbox/*` → the subdomain) is OFF until DNS is configured — guard it with
 * the `SANDBOX_CANONICAL_REDIRECT=1` env var so `/sandbox` keeps working on the
 * main host (and in local dev) in the meantime.
 */

const SANDBOX_HOSTS = new Set(["sandbox.finbar.studio", "sandbox.localhost"]);

export function proxy(request: NextRequest): NextResponse {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (SANDBOX_HOSTS.has(host)) {
    // Already under /sandbox or /embed → serve as-is; otherwise map into /sandbox.
    if (pathname.startsWith("/sandbox") || pathname.startsWith("/embed")) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = `/sandbox${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  if (
    process.env.SANDBOX_CANONICAL_REDIRECT === "1" &&
    (host === "www.finbar.studio" || host === "finbar.studio") &&
    pathname.startsWith("/sandbox")
  ) {
    const url = request.nextUrl.clone();
    url.host = "sandbox.finbar.studio";
    url.pathname = pathname.replace(/^\/sandbox/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  // Run on page routes only; skip static assets + metadata files.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"],
};
