"use client";

/**
 * Braeden homepage — HERO, Lindon-style: a big centred wordmark on white with the
 * award record beneath it (the imagery leads in the parallax showcase below). The
 * eyebrow, wordmark and award row stagger in when the intro fires (the preloader
 * lifting on first load, immediately on later navigation). Type-led, generous
 * white space, the brand red as one accent.
 */

import { useEffect, useState, type CSSProperties } from "react";
import AwardIcon, { type AwardIconName } from "../AwardIcon";
import { playOnIntro } from "../intro";

const AWARDS: { label: string; icon: AwardIconName }[] = [
  { label: "Est. 1996", icon: "flag" },
  { label: "5× House of the Year", icon: "trophy" },
  { label: "National Master Builder of the Year", icon: "rosette" },
  { label: "National House of the Year", icon: "house" },
];

const delay = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

export default function Hero() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }
    return playOnIntro(() => setShown(true));
  }, []);

  const rv = shown ? "1" : undefined;

  return (
    <section className="brd-hero">
      <p className="eyebrow brd-hero-eyebrow brd-reveal" data-revealed={rv} style={delay("0s")}>
        Award-winning custom homes · Noosa hinterland
      </p>

      <h1 className="brd-hero-mark ff-mont brd-reveal" data-revealed={rv} style={delay("0.1s")}>
        BRAEDEN
        <span className="brd-hero-sub">Constructions</span>
      </h1>

      <div className="brd-hero-awards brd-reveal" data-revealed={rv} style={delay("0.22s")}>
        {AWARDS.map((a) => (
          <span key={a.label} className="brd-award">
            <AwardIcon name={a.icon} />
            <span className="ff-mono">{a.label}</span>
          </span>
        ))}
      </div>

      <div
        className="brd-hero-scroll eyebrow brd-reveal-fade"
        data-revealed={rv}
        style={delay("0.42s")}
        aria-hidden
      >
        <span>Scroll</span>
        <span className="brd-hero-scroll-track">
          <span className="brd-hero-scroll-fill" />
        </span>
      </div>
    </section>
  );
}
