import { type NextRequest, NextResponse } from "next/server";

/**
 * /go/[slug] — availability-checking outbound links for client sites.
 *
 * Client domains lapse (platedwithissy.com did, Aug 2026), so the portfolio
 * never links a client domain directly: each link routes through here and
 * 302s the visitor to the first HEALTHY destination in priority order:
 *
 *   1. the client's proper domain
 *   2. the Vercel fallback we control — checked too, not assumed up
 *   3. our own case study for the project (always on, can't dangle)
 *
 * Domains renew or go live and the links flip on their own — no redeploy.
 *
 * Every candidate is verified with a signature check, not just a status
 * check: an expired domain often resolves to a registrar parking page that
 * returns 200. Signatures are strings only the real site contains.
 *
 * Probe cost is bounded three ways: a module-level memo (per warm lambda),
 * Next's fetch data cache (1h per candidate), and edge caching of the
 * redirect itself (s-maxage=300) — visitors never queue behind the probes.
 */

export const dynamic = "force-dynamic";

interface GoLink {
  /** Destinations in priority order; first one serving the real site wins. */
  candidates: string[];
  signature: string;
  /** Site-relative last resort when nothing external is healthy. */
  home: string;
}

const LINKS: Record<string, GoLink> = {
  lows: {
    candidates: ["https://www.lowsdesignandbuild.com", "https://lows-site.vercel.app"],
    signature: "Lows Design",
    home: "/case-studies/lows-design-build",
  },
  lola: {
    candidates: ["https://www.lola-audio.com", "https://lola-audio.vercel.app"],
    signature: "sound designer",
    home: "/case-studies/lola-audio",
  },
  momentum: {
    candidates: ["https://momentummentoring.co", "https://momentum-mentoring.vercel.app"],
    signature: "Momentum Mentoring",
    home: "/case-studies/momentum-mentoring",
  },
  plated: {
    candidates: ["https://www.platedwithissy.com", "https://plated-with-issy.vercel.app"],
    signature: "Plated with Issy",
    home: "/case-studies/plated-with-issy",
  },
  // Not hosted by us — no Vercel fallback exists, so it's domain or case study.
  kinaya: {
    candidates: ["https://kinaya.com.au"],
    signature: "KinAya",
    home: "/case-studies/kinaya",
  },
};

const MEMO_TTL_MS = 10 * 60 * 1000;
const memo = new Map<string, { target: string; at: number }>();

async function servesRealSite(url: string, signature: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    return res.ok && (await res.text()).includes(signature);
  } catch {
    // Dead DNS / timeout / TLS error — not healthy.
    return false;
  }
}

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
    target = link.home;
    for (const candidate of link.candidates) {
      if (await servesRealSite(candidate, link.signature)) {
        target = candidate;
        break;
      }
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
