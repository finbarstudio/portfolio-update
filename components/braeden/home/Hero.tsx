/**
 * Braeden homepage — HERO, Lindon-style: a big centred wordmark on white with the
 * award record beneath it (the imagery leads in the parallax showcase below). No
 * grids, no cards. Type-led, generous white space, the brand red as one accent.
 */

import { Fragment } from "react";

const AWARDS = [
  "Est. 1996",
  "5× House of the Year",
  "National Master Builder of the Year",
  "National House of the Year",
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
        {AWARDS.map((a, i) => (
          <Fragment key={a}>
            {i > 0 && <span aria-hidden className="brd-hero-dot" />}
            <span className="ff-mono">{a}</span>
          </Fragment>
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
