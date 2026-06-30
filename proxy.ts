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
const MAIN_HOSTS = new Set(["www.finbar.studio", "finbar.studio"]);

export function proxy(request: NextRequest): NextResponse {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  // ── Password gate for the private /builders index (HTTP Basic Auth) ─────────
  // /builders is an unlisted, noindex reference page that server-renders the
  // outreach emails into its HTML, so it can't be gated client-side without
  // leaking the content. Challenge here, before the page is ever served. Any
  // username works; only the password is checked. Rotate via a BUILDERS_PASSWORD
  // env var on the host if needed.
  if (pathname === "/builders" || pathname.startsWith("/builders/")) {
    const expected = process.env.BUILDERS_PASSWORD || "hellofin";
    const header = request.headers.get("authorization") || "";
    if (header.startsWith("Basic ")) {
      try {
        const decoded = atob(header.slice(6)); // "username:password"
        const password = decoded.slice(decoded.indexOf(":") + 1);
        if (password === expected) return NextResponse.next();
      } catch {
        /* malformed header — fall through to the challenge */
      }
    }
    return new NextResponse("Password required.", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="finbar.studio builders", charset="UTF-8"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  // ── Sandbox subdomain: clean URLs (no visible /sandbox prefix) ──────────────
  if (SANDBOX_HOSTS.has(host)) {
    // Static files from /public (3D models, images, video, fonts, …) are served
    // from the ROOT path and must NOT get the /sandbox app-route prefix, or they
    // 404 on the subdomain — which is what broke the tools: the page shell loaded
    // (its JS is under the excluded _next/static) but the model fetch to
    // /models/…glb got rewritten to /sandbox/models/…glb → 404 → useGLTF threw.
    // Public assets are identifiable by a file extension in the last path segment.
    if (/\.[^/]+$/.test(pathname)) return NextResponse.next();
    // Embeds are served as-is on every host (stable embed URLs).
    if (pathname.startsWith("/embed")) return NextResponse.next();
    // If the prefix leaked into the URL, 308 it to the clean path.
    if (pathname.startsWith("/sandbox")) {
      const clean = pathname.replace(/^\/sandbox/, "") || "/";
      if (clean !== pathname) {
        const url = request.nextUrl.clone();
        url.pathname = clean;
        return NextResponse.redirect(url, 308);
      }
    }
    // Clean path → rewrite into the internal /sandbox route tree (URL stays clean).
    const url = request.nextUrl.clone();
    url.pathname = `/sandbox${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Main host: the Sandbox lives on its subdomain, so 308 /sandbox/* there ──
  if (MAIN_HOSTS.has(host) && pathname.startsWith("/sandbox")) {
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
