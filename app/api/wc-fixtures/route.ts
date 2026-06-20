import { NextResponse } from "next/server";

/**
 * England's World Cup results + upcoming fixtures from FotMob's WC league feed
 * (the overview match list, filtered to England). Server-proxied, cached 2 min.
 * {ok:false} on failure so the UI falls back to the static fixtures in
 * worldcup.json.
 */

export const dynamic = "force-dynamic";

const FEED = "https://www.fotmob.com/api/data/leagues?id=77";
const HDRS = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

type Side = { id: string; name: string; score?: number };
type OvMatch = { id: string; home: Side; away: Side; status: { utcTime: string; started?: boolean; finished?: boolean } };

export async function GET() {
  try {
    const feed = await fetch(FEED, { headers: HDRS, next: { revalidate: 120 } });
    if (!feed.ok) return NextResponse.json({ ok: false, fixtures: [] });
    const d = await feed.json();
    const all: OvMatch[] = d?.overview?.leagueOverviewMatches ?? [];
    const eng = all
      .filter((m) => m.home?.name === "England" || m.away?.name === "England")
      .sort((a, b) => +new Date(a.status.utcTime) - +new Date(b.status.utcTime));

    const fixtures = eng.map((m) => {
      const isHome = m.home.name === "England";
      const opp = isHome ? m.away : m.home;
      const finished = !!m.status.finished;
      const engScore = isHome ? m.home.score : m.away.score;
      const oppScore = isHome ? m.away.score : m.home.score;
      let result: "W" | "D" | "L" | null = null;
      if (finished && typeof engScore === "number" && typeof oppScore === "number") {
        result = engScore > oppScore ? "W" : engScore < oppScore ? "L" : "D";
      }
      return {
        utcTime: m.status.utcTime,
        opponent: opp.name,
        opponentId: Number(opp.id),
        status: finished ? "played" : "upcoming",
        score: finished ? `${engScore}–${oppScore}` : null,
        result,
      };
    });
    return NextResponse.json({ ok: fixtures.length > 0, fixtures });
  } catch {
    return NextResponse.json({ ok: false, fixtures: [] });
  }
}
