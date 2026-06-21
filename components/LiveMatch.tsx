"use client";

/**
 * LiveMatch — the right column of the fixtures band. Polls /api/wc-live every 45s.
 * Shows an in-play match with its live score if one is running; otherwise the
 * next scheduled World Cup match; otherwise falls back to England's next fixture.
 * Under the card it lists today's WC games (codes + time/score).
 */

import { useEffect, useState } from "react";

type Team = { name: string; crest: string; score?: number | null };
type Match = { id: number; utcTime: string; ongoing: boolean; minute: string; home: Team; away: Team };
type TodayGame = { utcTime: string; ongoing: boolean; finished: boolean; home: string; away: string; score: { h: number; a: number } | null };
type Feed = { ok: boolean; live: Match[]; next: Match | null; today: TodayGame[] };

type Fallback = { opponent: string; code: string; kickoff: string };

function times(iso: string) {
  const d = new Date(iso);
  const f = (tz: string) =>
    new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false })
      .format(d).toUpperCase();
  return { lon: f("Europe/London"), bne: f("Australia/Brisbane") };
}
const hhmm = (iso: string, tz: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

function Crest({ url, alt }: { url: string; alt: string }) {
  if (!url) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="wc-flag-img wc-brand-tint" src={url} alt={alt} width={22} height={15} />;
}

export default function LiveMatch({ fallback }: { fallback: Fallback }) {
  const [feed, setFeed] = useState<Feed | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/wc-live", { cache: "no-store" });
        const j = (await r.json()) as Feed;
        if (alive) setFeed(j);
      } catch { /* keep last */ }
    };
    load();
    const id = setInterval(load, 45000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const liveMatch = feed?.live?.[0];
  const nextMatch = feed?.next;
  const today = feed?.today ?? [];

  let card: React.ReactNode;
  if (liveMatch) {
    card = (
      <div className="wc-fix-card is-live">
        <p className="mono-label wc-live-label">● Live now</p>
        <p className="wc-fix-teams">
          <span className="wc-fix-side"><Crest url={liveMatch.home.crest} alt={liveMatch.home.name} /> {liveMatch.home.name}</span>
          <span className="wc-fix-score text-pink tabular-nums">{liveMatch.home.score ?? 0}–{liveMatch.away.score ?? 0}</span>
          <span className="wc-fix-side">{liveMatch.away.name} <Crest url={liveMatch.away.crest} alt={liveMatch.away.name} /></span>
        </p>
        <p className="wc-venue mono-label text-ink-soft">{liveMatch.minute || "In play"}</p>
      </div>
    );
  } else if (nextMatch) {
    const t = times(nextMatch.utcTime);
    card = (
      <div className="wc-fix-card">
        <p className="mono-label text-ink-soft">No game live · Next up</p>
        <p className="wc-fix-teams">
          <span className="wc-fix-side"><Crest url={nextMatch.home.crest} alt={nextMatch.home.name} /> {nextMatch.home.name}</span>
          <span className="text-ink-soft wc-fix-vs">vs</span>
          <span className="wc-fix-side">{nextMatch.away.name} <Crest url={nextMatch.away.crest} alt={nextMatch.away.name} /></span>
        </p>
        <div className="wc-fix-times">
          <div className="wc-kick"><span className="sf-label">ENG/LON</span><span className="sf-value tabular-nums">{t.lon}</span></div>
          <div className="wc-kick"><span className="sf-label">AUS/BNE</span><span className="sf-value tabular-nums">{t.bne}</span></div>
        </div>
      </div>
    );
  } else {
    const t = times(fallback.kickoff);
    card = (
      <div className="wc-fix-card">
        <p className="mono-label text-ink-soft">No game live · Next up</p>
        <p className="wc-fix-teams">England <span className="text-ink-soft wc-fix-vs">vs</span> {fallback.opponent}</p>
        <div className="wc-fix-times">
          <div className="wc-kick"><span className="sf-label">ENG/LON</span><span className="sf-value tabular-nums">{t.lon}</span></div>
          <div className="wc-kick"><span className="sf-label">AUS/BNE</span><span className="sf-value tabular-nums">{t.bne}</span></div>
        </div>
      </div>
    );
  }

  return (
    <div className="wc-fix-col">
      {card}
      {today.length > 0 && (
        <div className="wc-today">
          <p className="mono-label text-ink-soft mb-2">Today’s games</p>
          <ul>
            {today.map((m, i) => (
              <li key={i} className={`wc-today-row ${m.ongoing ? "is-live" : ""}`}>
                <span className="wc-today-match tabular-nums">
                  {m.home} <span className="wc-today-mid">{m.score ? `${m.score.h}–${m.score.a}` : "v"}</span> {m.away}
                </span>
                <span className="wc-today-meta tabular-nums">
                  {m.ongoing ? (
                    <span>LIVE</span>
                  ) : m.finished ? (
                    <span>FT</span>
                  ) : (
                    <>
                      <span>LON {hhmm(m.utcTime, "Europe/London")}</span>
                      <span>BNE {hhmm(m.utcTime, "Australia/Brisbane")}</span>
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
