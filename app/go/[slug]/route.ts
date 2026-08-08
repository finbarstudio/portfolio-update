import { type NextRequest, NextResponse } from "next/server";

/**
 * /go/[slug] — availability-checking outbound links for client sites.
 *
 * Client domains lapse (platedwithissy.com did, Aug 2026), so the portfolio
 * never links a client domain directly: each link routes through here, which
 * probes the real domain and 302s visitors to it while it's healthy, falling
 * back to an always-on URL we control (the project's public .vercel.app
 * alias, or our own case study when we don't host the site). Domains renew or
 * go live and the links flip on their own — no redeploy, no edit.
 *
 * The signature check matters: an expired domain often resolves to a
 * registrar parking page that returns 200, so a status check alone would
 * false-positive. Signatures are strings only the real site contains.
 *
 * Probe cost is bounded three ways: a module-level memo (per warm lambda),
 * Next's fetch data cache (1h), and edge caching of the redirect itself
 * (s-maxage=300) — visitors never queue behind the probe.
 */

export const dynamic = "force-dynamic";

interface GoLink {
  main: string;
  fallback: string; // absolute URL, or site-relative (e.g. a case study)
  signature: string;
}

const LINKS: Record<string, GoLink> = {
  plated: {
    main: "https://www.platedwithissy.com",
    fallback: "https://plated-with-issy.vercel.app",
    signature: "Plated with Issy",
  },
  lows: {
    main: "https://www.lowsdesignandbuild.com",
    fallback: "https://lows-site.vercel.app",
    signature: "Lows Design",
  },
  lola: {
    main: "https://www.lola-audio.com",
    fallback: "https://lola-audio.vercel.app",
    signature: "sound designer",
  },
  momentum: {
    main: "https://momentummentoring.co",
    fallback: "https://momentum-mentoring.vercel.app",
    signature: "Momentum Mentoring",
  },
  fabspeed: {
    main: "https://www.fabspeed.com.au",
    fallback: "https://fabspeed-au.vercel.app",
    signature: "Fabspeed Australia",
  },
  // Not hosted by us — no alias to fall back to, so the case study stands in.
  kinaya: {
    main: "https://kinaya.com.au",
    fallback: "/case-studies/kinaya",
    signature: "KinAya",
  },
};

const MEMO_TTL_MS = 10 * 60 * 1000;
const memo = new Map<string, { target: string; at: number }>();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const link = LINKS[slug];
  if (!link) return NextResponse.redirect(new URL("/", request.url), 302);

  const hit = memo.get(slug);
  let target = hit && Date.now() - hit.at < MEMO_TTL_MS ? hit.target : null;

  if (!target) {
    target = link.fallback;
    try {
      const res = await fetch(link.main, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok && (await res.text()).includes(link.signature)) target = link.main;
    } catch {
      // Dead DNS / timeout / TLS error — the fallback stands.
    }
    memo.set(slug, { target, at: Date.now() });
  }

  const dest = target.startsWith("/") ? new URL(target, request.url) : target;
  return NextResponse.redirect(dest, {
    status: 302,
    headers: {
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, s-maxage=300, max-age=0",
    },
  });
}
