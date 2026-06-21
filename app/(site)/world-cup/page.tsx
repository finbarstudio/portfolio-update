import type { Metadata } from "next";
import StartingEleven from "@/components/StartingEleven";
import EnglandHero from "@/components/EnglandHero";
import LiveMatch from "@/components/LiveMatch";
import GroupTable from "@/components/GroupTable";
import GoldenBoot from "@/components/GoldenBoot";
import FixturesList from "@/components/FixturesList";
import Reveal from "@/components/Reveal";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

export const metadata: Metadata = {
  title: "It’s coming home — finbarstudio",
  description: "A little corner of the studio for the football. England at the FIFA World Cup 2026.",
  robots: { index: false, follow: false },
};

/** Deterministic (timezone-pinned) date+time, e.g. "WED 24 JUN · 05:00". */
function fmt(iso: string, tz: string) {
  const d = new Date(iso);
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false }).format(d);
  return `${day} · ${time}`.toUpperCase();
}

type Squad = { num: number; name: string; club: string; badge: string; pos: string };

const POS_ORDER = ["GK", "DEF", "MID", "FWD"];
const POS_LABEL: Record<string, string> = { GK: "Goalkeepers", DEF: "Defenders", MID: "Midfielders", FWD: "Forwards" };

export default function WorldCupPage() {
  const k = wc.next;
  const squad = (wc.squad as Squad[]) ?? [];
  const squadByPos = POS_ORDER
    .map((pos) => ({ pos, players: squad.filter((p) => p.pos === pos) }))
    .filter((g) => g.players.length > 0);

  return (
    <article className="wc-page px-5 md:px-10 pt-10 md:pt-16 pb-24">
      {/* ── Hero (full-bleed ENGLAND wordmark) ───────────────────────── */}
      <section className="wc-hero" aria-label="England">
        <EnglandHero />
      </section>

      {/* ── Sticky split: England + XI/squad (left) · live + detail (right) ── */}
      <div className="wc-split">
        {/* Left: England's next match, then the probable XI + squad */}
        <aside className="wc-split-xi" aria-label="England, probable eleven and squad">
          <div className="wc-fix-card">
            <p className="mono-label text-ink-soft">England · Next match</p>
            <p className="wc-fix-teams">
              <span className="wc-fix-side"><CountryFlag code="ENG" /> England</span>
              <span className="text-ink-soft wc-fix-vs">vs</span>
              <span className="wc-fix-side">{k.opponent} <CountryFlag code={k.code} /></span>
            </p>
            <div className="wc-fix-times">
              <div className="wc-kick"><span className="sf-label">ENG/LON</span><span className="sf-value tabular-nums">{fmt(k.kickoff, "Europe/London")}</span></div>
              <div className="wc-kick"><span className="sf-label">AUS/BNE</span><span className="sf-value tabular-nums">{fmt(k.kickoff, "Australia/Brisbane")}</span></div>
            </div>
          </div>

          <div className="wc-block">
            <p className="mono-label text-ink-soft mb-1">Probable XI</p>
            <p className="mono-label text-pink mb-5">{wc.formation}</p>
            <StartingEleven />

            {squadByPos.length > 0 && (
              <div className="wc-squad">
                <p className="mono-label text-ink-soft mb-4">The rest of the squad</p>
                {squadByPos.map((g) => (
                  <div className="wc-squad-group" key={g.pos}>
                    <p className="wc-squad-pos mono-label">{POS_LABEL[g.pos]}</p>
                    <ul>
                      {g.players.map((p) => (
                        <li className="wc-squad-row" key={p.name}>
                          <span className="wc-squad-num">{p.num}</span>
                          <span className="wc-squad-name">{p.name}</span>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img className="wc-squad-badge" src={`/badges/${p.badge}.svg`} alt={p.club} width={16} height={16} />
                          <span className="wc-squad-club">{p.club}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* Right: live game + today, then results, tables, golden boot */}
        <div className="wc-split-scroll">
          <LiveMatch fallback={{ opponent: k.opponent, code: k.code, kickoff: k.kickoff }} />

          {/* Results + upcoming — live from FotMob, static fallback */}
          <Reveal as="section" className="wc-block" aria-label="Results and fixtures">
            <p className="mono-label text-ink-soft mb-4">Results &amp; fixtures</p>
            <FixturesList />
          </Reveal>

          {/* Group table — live from FotMob, static fallback */}
          <Reveal as="section" className="wc-block" aria-label="Group tables">
            <p className="mono-label text-ink-soft mb-4">Group tables</p>
            <GroupTable />
          </Reveal>

          {/* Golden boot — live from FotMob, static fallback */}
          <Reveal as="section" className="wc-block" aria-label="Golden boot race">
            <p className="mono-label text-ink-soft mb-4">Golden boot watch</p>
            <GoldenBoot />
          </Reveal>
        </div>
      </div>
    </article>
  );
}
