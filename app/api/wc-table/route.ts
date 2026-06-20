import { NextResponse } from "next/server";

/**
 * Live World Cup group tables (all groups) from FotMob's public league feed.
 * Server-proxied (no CORS/key), cached 2 min. Returns every lettered group with
 * its standings, and the index of the group containing England (the default
 * tab). {ok:false} on failure so the UI falls back to the static table.
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
    if (!res.ok) return NextResponse.json({ ok: false, groups: [], defaultIndex: 0 });
    const d = await res.json();
    const raw: { leagueName?: string; table?: { all?: FmRow[] } }[] = d?.table?.[0]?.data?.tables ?? [];

    const groups = raw
      .filter((g) => /^Grp\./i.test(g.leagueName ?? ""))
      .map((g) => ({
        letter: (g.leagueName ?? "").replace(/grp\.?/i, "").trim(),
        teams: (g.table?.all ?? []).map((r) => ({
          name: r.name, id: r.id, p: r.played, w: r.wins, d: r.draws, l: r.losses, gd: r.goalConDiff, pts: r.pts,
        })),
      }));

    const defaultIndex = Math.max(0, groups.findIndex((g) => g.teams.some((t) => t.name === "England")));
    return NextResponse.json({ ok: groups.length > 0, groups, defaultIndex });
  } catch {
    return NextResponse.json({ ok: false, groups: [], defaultIndex: 0 });
  }
}
