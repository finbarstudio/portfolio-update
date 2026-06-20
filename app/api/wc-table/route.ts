import { NextResponse } from "next/server";

/**
 * Live World Cup group table for England's group, from FotMob's public league
 * feed. Server-proxied (no CORS/key), cached 2 min since standings move slowly.
 * Returns the rows for whichever group contains England; {ok:false} on failure
 * so the UI falls back to the static table in worldcup.json.
 */

export const dynamic = "force-dynamic";

type FmRow = {
  name: string; id: number; played: number; wins: number; draws: number;
  losses: number; goalConDiff: number; pts: number;
};

export async function GET() {
  try {
    const res = await fetch("https://www.fotmob.com/api/data/leagues?id=77", {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
      next: { revalidate: 120 },
    });
    if (!res.ok) return NextResponse.json({ ok: false, rows: [] });
    const d = await res.json();
    const groups: { table?: { all?: FmRow[] } }[] = d?.table?.[0]?.data?.tables ?? [];
    let rows: FmRow[] = [];
    for (const g of groups) {
      const all = g?.table?.all ?? [];
      if (all.some((r) => r.name === "England")) { rows = all; break; }
    }
    const out = rows.map((r) => ({
      name: r.name,
      id: r.id,
      played: r.played,
      wins: r.wins,
      draws: r.draws,
      losses: r.losses,
      gd: r.goalConDiff,
      pts: r.pts,
    }));
    return NextResponse.json({ ok: out.length > 0, rows: out });
  } catch {
    return NextResponse.json({ ok: false, rows: [] });
  }
}
