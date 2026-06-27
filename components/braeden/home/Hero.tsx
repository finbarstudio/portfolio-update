/**
 * Braeden homepage — HERO, Lindon-style: a big centred wordmark on white with the
 * award record beneath it (the imagery leads in the parallax showcase below). No
 * grids, no cards. Type-led, generous white space, the brand red as one accent.
 */

import AwardIcon, { type AwardIconName } from "../AwardIcon";

const AWARDS: { label: string; icon: AwardIconName }[] = [
  { label: "Est. 1996", icon: "flag" },
  { label: "5× House of the Year", icon: "trophy" },
  { label: "National Master Builder of the Year", icon: "rosette" },
  { label: "National House of the Year", icon: "house" },
];

export default function Hero() {
  return (
    <section className="brd-hero">
      <p className="eyebrow brd-hero-eyebrow">Award-winning custom homes · Noosa hinterland</p>

      <h1 className="brd-hero-mark ff-mont">
        BRAEDEN
        <span className="brd-hero-sub">Constructions</span>
      </h1>

      <div className="brd-hero-awards">
        {AWARDS.map((a) => (
          <span key={a.label} className="brd-award">
            <AwardIcon name={a.icon} />
            <span className="ff-mono">{a.label}</span>
          </span>
        ))}
      </div>

      <div className="brd-hero-scroll eyebrow" aria-hidden>
        <span>Scroll</span>
        <span className="brd-hero-scroll-track">
          <span className="brd-hero-scroll-fill" />
        </span>
      </div>
    </section>
  );
}
