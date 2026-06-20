import type { Metadata } from "next";
import FootballIcon from "@/components/FootballIcon";
import StartingEleven from "@/components/StartingEleven";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

export const metadata: Metadata = {
  title: "It’s coming home — finbarstudio",
  description: "A little corner of the studio for the football. England at the FIFA World Cup 2026.",
  robots: { index: false, follow: false },
};

const ORDINAL = ["0th", "1st", "2nd", "3rd", "4th"];

/** Deterministic (timezone-pinned) date+time, e.g. "WED 24 JUN · 05:00". */
function fmt(iso: string, tz: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return `${day} · ${time}`.toUpperCase();
}

/** Short kickoff time (London) for upcoming fixtures in the table. */
function fmtShort(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
}

type Fixture = {
  date: string; opponent: string; code: string;
  score?: string; result?: string; kickoff?: string; status: string;
};

export default function WorldCupPage() {
  const k = wc.next;
  const fixtures = wc.fixtures as Fixture[];
  return (
    <article className="wc-page px-5 md:px-10 pt-10 md:pt-16 pb-24">
      {/* ── Hero + standings (one full-width band) ───────────────────── */}
      <section className="wc-hero-grid" aria-label="C’mon England — where they stand">
        <div className="wc-hero-head">
          <p className="mono-label text-ink-soft mb-3 wc-comp">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="wc-comp-badge" src="/world-cup-2026.png" alt="FIFA World Cup 2026" width={28} height={28} />
            {wc.competition} · {wc.group}
          </p>
          <MaskReveal as="h1" className="home-disc wc-heading" aria-label="C’mon England">
            {"C’mon "}
            <span className="home-disc-pink">England</span>
            {" "}
            <span className="wc-ball" aria-hidden="true"><FootballIcon /></span>
          </MaskReveal>
        </div>

        <Reveal as="div" className="wc-stats" aria-label="Where they stand">
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{ORDINAL[wc.position] ?? `${wc.position}th`}</span>
            <span className="mono-label text-ink-soft">in {wc.group}</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{wc.points}</span>
            <span className="mono-label text-ink-soft">points</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{wc.won}–{wc.drawn}–{wc.lost}</span>
            <span className="mono-label text-ink-soft">W · D · L ({wc.played} played)</span>
          </div>
          <div className="wc-stat">
            <span className="wc-stat-num text-pink">{wc.goalDiff}</span>
            <span className="mono-label text-ink-soft">goal difference</span>
          </div>
        </Reveal>
      </section>

      {/* ── Sticky XI (left) + scrolling detail (right) ──────────────── */}
      <div className="wc-split">
        {/* Sticky predicted XI */}
        <aside className="wc-split-xi" aria-label="Probable eleven">
          <p className="mono-label text-ink-soft mb-1">Probable XI</p>
          <p className="mono-label text-pink mb-5">{wc.formation}</p>
          <StartingEleven />
        </aside>

        {/* Scrolling column */}
        <div className="wc-split-scroll">
          {/* Group table */}
          <Reveal as="section" className="wc-block" aria-label="Group table">
            <p className="mono-label text-ink-soft mb-4">{wc.group} table</p>
            <table className="wc-table">
              <thead>
                <tr>
                  <th className="wc-th-team">Team</th>
                  <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {wc.table.map((t, i) => (
                  <tr key={t.code} className={t.england ? "is-england" : ""}>
                    <td className="wc-td-team">
                      <span className="wc-pos">{i + 1}</span>
                      <span className="wc-flag"><CountryFlag code={t.code} /></span>
                      {t.team}
                    </td>
                    <td>{t.p}</td><td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
                    <td className="tabular-nums">{t.gd}</td>
                    <td className="wc-td-pts text-pink">{t.pts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          {/* Golden boot */}
          <Reveal as="section" className="wc-block" aria-label="Golden boot race">
            <p className="mono-label text-ink-soft mb-4">Golden boot watch</p>
            <ul className="wc-scorers">
              {wc.scorerRace.map((s) => (
                <li key={s.name} className={`wc-scorer-row ${s.england ? "is-england" : "is-other"}`}>
                  <span className="wc-scorer-goals">{s.goals}</span>
                  <span className="mono-label wc-scorer-unit">{s.goals === 1 ? "goal" : "goals"}</span>
                  <span className="wc-flag"><CountryFlag code={s.code} /></span>
                  <span className="wc-scorer-name">{s.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Fixtures — results + upcoming in one table */}
          <Reveal as="section" className="wc-block" aria-label="Results and fixtures">
            <p className="mono-label text-ink-soft mb-4">Results &amp; fixtures</p>
            <ul className="wc-results">
              {fixtures.map((m) => {
                const upcoming = m.status === "upcoming";
                return (
                  <li key={m.date + m.code} className={`wc-result ${upcoming ? "is-upcoming" : ""}`}>
                    <span className="wc-result-date mono-label text-ink-soft">{m.date}</span>
                    <span className="wc-result-match">
                      <span className="wc-flag"><CountryFlag code="ENG" /></span> England
                      {upcoming ? (
                        <span className="text-ink-soft"> vs </span>
                      ) : (
                        <span className="text-pink tabular-nums"> {m.score} </span>
                      )}
                      {m.opponent} <span className="wc-flag"><CountryFlag code={m.code} /></span>
                    </span>
                    {upcoming ? (
                      <span className="wc-result-badge wc-next-tag mono-label">{m.kickoff ? fmtShort(m.kickoff) : "TBC"}</span>
                    ) : (
                      <span className={`wc-result-badge wc-${m.result}`}>{m.result}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {/* Next match */}
          <Reveal as="section" className="wc-block" aria-label="Next match">
            <p className="mono-label text-ink-soft mb-4">Next match</p>
            <p className="wc-next-match">
              <CountryFlag code="ENG" /> England <span className="text-ink-soft">vs</span> {k.opponent} <CountryFlag code={k.code} />
            </p>
            <p className="wc-venue mono-label text-ink-soft">{k.venue}</p>
            <div className="wc-kickoffs">
              <div className="wc-kick">
                <span className="sf-label">ENG/LON</span>
                <span className="sf-value tabular-nums">{fmt(k.kickoff, "Europe/London")}</span>
              </div>
              <div className="wc-kick">
                <span className="sf-label">AUS/BNE</span>
                <span className="sf-value tabular-nums">{fmt(k.kickoff, "Australia/Brisbane")}</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
