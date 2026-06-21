import { NextResponse } from "next/server";

/**
 * Live World Cup match feed, sourced from FotMob's public JSON API (the one their
 * own site calls). The client can't hit it directly (no CORS), so this server
 * route proxies it, cached 30s so visitor polling stays light. Returns any
 * in-play WC match with its live score + minute, plus the next scheduled WC
 * match. Degrades to {ok:false} so the UI falls back to the static fixture.
 *
 * Note: this is FotMob's unofficial API. No key needed; kept low-volume + cached.
 */

export const dynamic = "force-dynamic";

const LOGO = (id: number) => `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
const isWC = (name: string, primaryId?: number) => primaryId === 77 || /world cup/i.test(name);

// Team name -> 3-letter code for the brief "today" list (FotMob match feed has
// no code). Fallback: first three letters uppercased.
const CODES: Record<string, string> = {
  England: "ENG", Scotland: "SCO", Wales: "WAL", Croatia: "CRO", Ghana: "GHA",
  Panama: "PAN", Brazil: "BRA", Morocco: "MAR", Haiti: "HAI", Argentina: "ARG",
  Canada: "CAN", Netherlands: "NED", Germany: "GER", "Ivory Coast": "CIV",
  "South Korea": "KOR", "South Africa": "RSA", Mexico: "MEX", Czechia: "CZE",
  Switzerland: "SUI", "Bosnia and Herzegovina": "BIH", Qatar: "QAT", Ecuador: "ECU",
  Curacao: "CUW", "Curaçao": "CUW", Spain: "ESP", France: "FRA", Portugal: "POR",
  Belgium: "BEL", Italy: "ITA", USA: "USA", "United States": "USA", Japan: "JPN",
  Australia: "AUS", Uruguay: "URU", Colombia: "COL", Senegal: "SEN", Norway: "NOR",
  Sweden: "SWE", Denmark: "DEN", Austria: "AUT", Turkey: "TUR", "Türkiye": "TUR",
  Egypt: "EGY", Nigeria: "NGA", Cameroon: "CMR", Iran: "IRN", Iraq: "IRQ",
  "Saudi Arabia": "KSA", Jordan: "JOR", Uzbekistan: "UZB", "New Zealand": "NZL",
  "Cabo Verde": "CPV", "Cape Verde": "CPV", Algeria: "ALG", Tunisia: "TUN",
  Paraguay: "PAR", Poland: "POL", Serbia: "SRB", Greece: "GRE", Peru: "PER", Chile: "CHI",
};
const code = (name: string) => CODES[name] ?? name.slice(0, 3).toUpperCase();

type FmTeam = { id: number; name: string; longName?: string; score?: number };
type FmMatch = {
  id: number;
  home: FmTeam; away: FmTeam;
  status: { utcTime: string; started?: boolean; finished?: boolean; cancelled?: boolean; ongoing?: boolean; liveTime?: { short?: string } };
};
type FmLeague = { name: string; primaryId?: number; matches: FmMatch[] };

function team(t: FmTeam) {
  return { name: t.name || t.longName || "TBC", crest: LOGO(t.id) };
}
function shape(m: FmMatch) {
  return {
    id: m.id,
    utcTime: m.status.utcTime,
    ongoing: !!m.status.ongoing,
    minute: (m.status.liveTime?.short || "").replace(/[‎‏]/g, ""),
    home: { ...team(m.home), score: m.home.score ?? null },
    away: { ...team(m.away), score: m.away.score ?? null },
  };
}

async function matchesFor(date: string): Promise<FmMatch[]> {
  const res = await fetch(`https://www.fotmob.com/api/data/matches?date=${date}`, {
    headers: { "User-Agent": "Mozilla/5.0", Accept: "application/json" },
    next: { revalidate: 30 },
  });
  if (!res.ok) return [];
  const data = (await res.json()) as { leagues?: FmLeague[] };
  return (data.leagues ?? [])
    .filter((l) => isWC(l.name, l.primaryId))
    .flatMap((l) => l.matches ?? []);
}

function ymd(d: Date) {
  return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
}

export async function GET() {
  try {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);
    const todayMatches = await matchesFor(ymd(today));
    const wc = [...todayMatches, ...(await matchesFor(ymd(tomorrow)))];
    if (wc.length === 0) return NextResponse.json({ ok: false, live: [], next: null, today: [] });

    const live = wc.filter((m) => m.status.ongoing).map(shape);
    const next = wc
      .filter((m) => !m.status.started && !m.status.cancelled)
      .sort((a, b) => +new Date(a.status.utcTime) - +new Date(b.status.utcTime))
      .map(shape)[0] ?? null;

    // Brief list of today's WC games — just codes, time and score.
    const todayList = todayMatches
      .sort((a, b) => +new Date(a.status.utcTime) - +new Date(b.status.utcTime))
      .map((m) => ({
        utcTime: m.status.utcTime,
        ongoing: !!m.status.ongoing,
        finished: !!m.status.finished,
        home: code(m.home.name || m.home.longName || ""),
        away: code(m.away.name || m.away.longName || ""),
        score: m.status.started ? { h: m.home.score ?? 0, a: m.away.score ?? 0 } : null,
      }));

    return NextResponse.json({ ok: true, live, next, today: todayList });
  } catch {
    return NextResponse.json({ ok: false, live: [], next: null, today: [] });
  }
}
