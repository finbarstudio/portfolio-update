"use client";

/**
 * Braeden homepage HERO — the "magazine cover" treatment (option J): a full-bleed
 * home photo with micro mono type anchored in the corners and the scroll cue
 * centred. No headline, no logo here — the nav logo sits top-left and stays there
 * as you scroll. Corners mask-reveal when the intro fires (preloader lift on first
 * load, immediately on later navigation).
 */

import { useEffect, useState, type CSSProperties } from "react";
import { playOnIntro } from "../intro";

const AWARDS = [
  "5× House of the Year",
  "National Master Builder of the Year",
  "National House of the Year",
];

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

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
    <section className="bx-hero" data-tone="dark">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/braeden/projects/modern-thai.webp"
        alt="Modern Thai House, a Braeden Constructions home at Noosa Heads"
        className="bx-hero-img bx-ken"
      />
      <div className="bx-scrim-full" aria-hidden />

      <div className="bx-j">
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-tr brd-mask" data-revealed={rv} style={d("0s")}>
          Est. 1996
        </span>
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-bl brd-mask" data-revealed={rv} style={d("0.1s")}>
          Custom homes, Noosa hinterland
        </span>
        <div className="bx-j-br brd-mask" data-revealed={rv} style={d("0.2s")}>
          {AWARDS.map((a) => (
            <span key={a} className="ff-mono bx-eyebrow bx-on-img bx-j-awline">
              {a}
            </span>
          ))}
        </div>
      </div>

      <span className="ff-mono bx-scrollcue bx-on-img" aria-hidden>
        Scroll
      </span>
    </section>
  );
}
