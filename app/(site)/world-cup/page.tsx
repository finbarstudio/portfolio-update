import type { Metadata } from "next";
import { AusFlag, EngFlag } from "@/components/Flags";
import FootballIcon from "@/components/FootballIcon";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "England at the World Cup — finbarstudio",
  description: "A little corner of the studio for the football. England at the FIFA World Cup 2026.",
  robots: { index: false, follow: false },
};

/* ────────────────────────────────────────────────────────────────────────
   EDITABLE — update as the tournament goes. (Static site, so no live feed.)
   `kickoff` is an ISO instant in UTC; it's rendered into Brisbane + London time
   below, deterministically, so it matches whatever timezone the visitor is in.
   ──────────────────────────────────────────────────────────────────────── */
const WC = {
  competition: "FIFA World Cup 2026",
  group: "Group K",
  position: 1,                // 1 = top of the group
  played: 2,
  won: 1,
  drawn: 1,
  lost: 0,
  points: 4,
  goalDiff: "+2",
  recent: [
    { date: "12 Jun", opponent: "Serbia", score: "2–0", result: "W" as const },
    { date: "18 Jun", opponent: "Senegal", score: "1–1", result: "D" as const },
  ],
  next: {
    opponent: "Greece",
    venue: "MetLife Stadium, New Jersey",
    kickoff: "2026-06-24T19:00:00Z",
  },
};

const ORDINAL = ["0th", "1st", "2nd", "3rd", "4th"];

/** Deterministic (timezone-pinned) date+time format, e.g. "WED 24 JUN · 05:00". */
function fmt(iso: string, tz: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, weekday: "short", day: "numeric", month: "short",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(d);
  return `${day} · ${time}`.toUpperCase();
}

export default function WorldCupPage() {
  const k = WC.next;
  return (
    <article className="px-5 md:px-10 pt-10 md:pt-16 pb-20 max-w-5xl">
      <Reveal as="div">
        <p className="mono-label text-ink-soft mb-3">{WC.competition} · {WC.group}</p>
        <h1 className="home-disc wc-heading">
          {"C’mon "}
          <span className="home-disc-pink">England</span>
          {" "}
          <span className="wc-ball" aria-hidden="true"><FootballIcon /></span>
        </h1>
      </Reveal>

      {/* Standings */}
      <Reveal as="section" className="wc-block" aria-label="Group standings">
        <p className="mono-label text-ink-soft mb-4">Where they stand</p>
        <div className="wc-stats">
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{ORDINAL[WC.position] ?? `${WC.position}th`}</span>
            <span className="mono-label text-ink-soft">in {WC.group}</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{WC.points}</span>
            <span className="mono-label text-ink-soft">points</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{WC.won}–{WC.drawn}–{WC.lost}</span>
            <span className="mono-label text-ink-soft">W · D · L ({WC.played} played)</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{WC.goalDiff}</span>
            <span className="mono-label text-ink-soft">goal difference</span>
          </div>
        </div>
      </Reveal>

      {/* Recent */}
      <Reveal as="section" className="wc-block" aria-label="Recent results">
        <p className="mono-label text-ink-soft mb-4">Recent results</p>
        <ul className="wc-results">
          {WC.recent.map((m) => (
            <li key={m.opponent} className="wc-result">
              <span className="wc-result-date mono-label text-ink-soft">{m.date}</span>
              <span className="wc-result-match">England <span className="text-pink tabular-nums">{m.score}</span> {m.opponent}</span>
              <span className={`wc-result-badge wc-${m.result}`}>{m.result}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Next match */}
      <Reveal as="section" className="wc-block" aria-label="Next match">
        <p className="mono-label text-ink-soft mb-4">Next match</p>
        <p className="wc-next-match">England <span className="text-ink-soft">vs</span> {k.opponent}</p>
        <p className="wc-venue mono-label text-ink-soft">{k.venue}</p>
        <div className="wc-kickoffs">
          <div className="wc-kick">
            <span className="sf-loc"><span className="sf-label">AUS/BNE</span><AusFlag /></span>
            <span className="sf-value tabular-nums">{fmt(k.kickoff, "Australia/Brisbane")}</span>
          </div>
          <div className="wc-kick">
            <span className="sf-loc"><span className="sf-label">ENG/LON</span><EngFlag /></span>
            <span className="sf-value tabular-nums">{fmt(k.kickoff, "Europe/London")}</span>
          </div>
        </div>
      </Reveal>
    </article>
  );
}
