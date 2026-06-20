import { NextResponse } from "next/server";

/**
 * Live World Cup top scorers (golden boot) from FotMob. Reads the WC league feed
 * to find the goals stat list URL, then pulls the full list and returns the top
 * few. Server-proxied, cached 2 min. {ok:false} on failure so the UI falls back
 * to the static scorer race in worldcup.json.
 */

export const dynamic = "force-dynamic";

const FEED = "https://www.fotmob.com/api/data/leagues?id=77";
const HDRS = { "User-Agent": "Mozilla/5.0", Accept: "application/json" };

type StatPlayer = { ParticipantName: string; StatValue: number; ParticipantCountryCode?: string; TeamName?: string };

export async function GET() {
  try {
    const feed = await fetch(FEED, { headers: HDRS, next: { revalidate: 120 } });
    if (!feed.ok) return NextResponse.json({ ok: false, scorers: [] });
    const d = await feed.json();
    const groups = d?.stats?.players ?? [];
    const goalsGroup = groups.find((g: { localizedTitleId?: string }) => g.localizedTitleId === "goals_title");
    const url: string | undefined = goalsGroup?.fetchAllUrl;
    if (!url) return NextResponse.json({ ok: false, scorers: [] });

    const list = await fetch(url, { headers: HDRS, next: { revalidate: 120 } });
    if (!list.ok) return NextResponse.json({ ok: false, scorers: [] });
    const lj = await list.json();
    const players: StatPlayer[] = lj?.TopLists?.[0]?.StatList ?? [];

    const scorers = players.slice(0, 6).map((p) => ({
      name: p.ParticipantName,
      code: p.ParticipantCountryCode ?? "",
      goals: Math.round(p.StatValue),
      england: p.ParticipantCountryCode === "ENG",
    }));
    return NextResponse.json({ ok: scorers.length > 0, scorers });
  } catch {
    return NextResponse.json({ ok: false, scorers: [] });
  }
}
