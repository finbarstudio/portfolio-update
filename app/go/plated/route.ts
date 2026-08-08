import { NextResponse } from "next/server";

/**
 * /go/plated — availability-checking outbound link for Plated with Issy.
 *
 * Her domain (platedwithissy.com) expired, so the portfolio links here
 * instead of hardcoding either destination: this route probes the real
 * domain and 302s visitors to it the moment it's back, falling back to the
 * always-on Vercel alias meanwhile. No redeploy needed when she renews.
 *
 * The signature check matters: an expired domain often resolves to a
 * registrar parking page that returns 200, so a status check alone would
 * false-positive. Only her actual site contains the title string.
 *
 * Check cost is bounded three ways: a module-level memo (per warm lambda),
 * Next's fetch data cache (1h), and edge caching of the redirect itself
 * (s-maxage=300) — so visitors never queue behind the probe.
 */

export const dynamic = "force-dynamic";

const MAIN = "https://www.platedwithissy.com";
const FALLBACK = "https://plated-with-issy.vercel.app";
const SIGNATURE = "Plated with Issy";
const MEMO_TTL_MS = 10 * 60 * 1000;

let memo: { target: string; at: number } | null = null;

export async function GET() {
  let target = memo && Date.now() - memo.at < MEMO_TTL_MS ? memo.target : null;

  if (!target) {
    target = FALLBACK;
    try {
      const res = await fetch(MAIN, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok && (await res.text()).includes(SIGNATURE)) target = MAIN;
    } catch {
      // Dead DNS / timeout / TLS error — the fallback stands.
    }
    memo = { target, at: Date.now() };
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: {
      "X-Robots-Tag": "noindex",
      "Cache-Control": "public, s-maxage=300, max-age=0",
    },
  });
}
