import { NextResponse } from "next/server";

/**
 * Live World Cup match proxy. The football-data.org key can't go in the browser
 * (and the API has no CORS), so the client polls this route. The upstream fetch
 * is cached 30s so visitor polling never trips the rate limit. Returns any
 * in-play matches plus the next scheduled one; degrades to {ok:false} with empty
 * data when no key is set or the upstream fails (the UI then falls back to the
 * static England fixture).
 */

export const dynamic = "force-dynamic";

const BASE = "https://api.football-data.org/v4";
const LIVE = new Set(["IN_PLAY", "PAUSED"]);
const UPCOMING = new Set(["TIMED", "SCHEDULED"]);

type RawTeam = { name?: string; shortName?: string; tla?: string; crest?: string };
type RawMatch = {
  id: number; utcDate: string; status: string;
  homeTeam?: RawTeam; awayTeam?: RawTeam;
  score?: { fullTime?: { home: number | null; away: number | null } };
};

function slim(m: RawMatch) {
  const team = (t?: RawTeam) => ({ name: t?.shortName || t?.name || "TBC", tla: t?.tla ?? "", crest: t?.crest ?? "" });
  return {
    id: m.id,
    utcDate: m.utcDate,
    status: m.status,
    home: team(m.homeTeam),
    away: team(m.awayTeam),
    score: { home: m.score?.fullTime?.home ?? null, away: m.score?.fullTime?.away ?? null },
  };
}

export async function GET() {
  const key = process.env.FOOTBALL_DATA_KEY;
  if (!key) return NextResponse.json({ ok: false, live: [], next: null });
  try {
    const res = await fetch(`${BASE}/competitions/WC/matches`, {
      headers: { "X-Auth-Token": key },
      next: { revalidate: 30 },
    });
    if (!res.ok) return NextResponse.json({ ok: false, live: [], next: null });
    const data = (await res.json()) as { matches?: RawMatch[] };
    const matches = data.matches ?? [];
    const live = matches.filter((m) => LIVE.has(m.status)).map(slim);
    const next = matches
      .filter((m) => UPCOMING.has(m.status))
      .sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))
      .map(slim)[0] ?? null;
    return NextResponse.json({ ok: true, live, next });
  } catch {
    return NextResponse.json({ ok: false, live: [], next: null });
  }
}
