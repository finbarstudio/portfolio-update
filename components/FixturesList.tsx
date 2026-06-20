"use client";

/**
 * FixturesList — England's results + upcoming WC fixtures, live from
 * /api/wc-fixtures (FotMob), refreshed every 2 min. Falls back to the static
 * fixtures in worldcup.json. Markup matches the static version.
 */

import { useEffect, useState } from "react";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

type LiveFix = { utcTime: string; opponent: string; opponentId: number; status: string; score: string | null; result: "W" | "D" | "L" | null };
type Row = { key: string; date: string; opponent: string; code?: string; badge?: string; score?: string | null; result?: string | null; status: string; kickoff?: string };

const NAME_TO_CODE: Record<string, string> = { Croatia: "CRO", Ghana: "GHA", Panama: "PAN", England: "ENG" };
const LOGO = (id: number) => `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
const shortDate = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", day: "numeric", month: "short" }).format(new Date(iso));
const shortTime = (iso: string) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(iso));

const STATIC: Row[] = (wc.fixtures as { date: string; opponent: string; code: string; score?: string; result?: string; kickoff?: string; status: string }[])
  .map((m, i) => ({ key: `s${i}`, date: m.date, opponent: m.opponent, code: m.code, score: m.score, result: m.result, status: m.status, kickoff: m.kickoff }));

export default function FixturesList() {
  const [rows, setRows] = useState<Row[]>(STATIC);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/wc-fixtures", { cache: "no-store" });
        const j = (await r.json()) as { ok: boolean; fixtures: LiveFix[] };
        if (alive && j.ok && j.fixtures.length) {
          setRows(j.fixtures.map((m, i) => ({
            key: `l${i}`,
            date: shortDate(m.utcTime),
            opponent: m.opponent,
            code: NAME_TO_CODE[m.opponent],
            badge: LOGO(m.opponentId),
            score: m.score,
            result: m.result,
            status: m.status,
            kickoff: m.utcTime,
          })));
        }
      } catch { /* keep current */ }
    };
    load();
    const id = setInterval(load, 120000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const oppCrest = (r: Row) =>
    r.code ? (
      <CountryFlag code={r.code} />
    ) : (
      // eslint-disable-next-line @next/next/no-img-element
      <img className="wc-flag-img wc-brand-tint" src={r.badge} alt={r.opponent} width={21} height={14} />
    );

  return (
    <ul className="wc-results">
      {rows.map((m) => {
        const upcoming = m.status === "upcoming";
        return (
          <li key={m.key} className={`wc-result ${upcoming ? "is-upcoming" : ""}`}>
            <span className="wc-result-date mono-label text-ink-soft">{m.date}</span>
            <span className="wc-result-match">
              <span className="wc-flag"><CountryFlag code="ENG" /></span> England
              {upcoming ? (
                <span className="text-ink-soft"> vs </span>
              ) : (
                <span className="text-pink tabular-nums"> {m.score} </span>
              )}
              {m.opponent} <span className="wc-flag">{oppCrest(m)}</span>
            </span>
            {upcoming ? (
              <span className="wc-result-badge wc-next-tag mono-label">{m.kickoff ? shortTime(m.kickoff) : "TBC"}</span>
            ) : (
              <span className={`wc-result-badge wc-${m.result}`}>{m.result}</span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
