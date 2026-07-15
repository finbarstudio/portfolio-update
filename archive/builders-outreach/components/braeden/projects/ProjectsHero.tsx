"use client";

/**
 * Projects page hero — tall and centred so the first row of the grid peeks at
 * the bottom of the viewport as a scroll cue. Eyebrow, title and subhead
 * mask-reveal in a stagger when the intro fires (after the preloader lifts on
 * first load, immediately on later navigation).
 */

import { useEffect, useState, type CSSProperties } from "react";
import { playOnIntro } from "../intro";

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

export default function ProjectsHero() {
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
    <section className="brd-projects-hero">
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>
        Selected work
      </p>
      <h1 className="brd-projects-title brd-mask" data-revealed={rv} style={d("0.1s")}>
        Homes we&rsquo;ve put our name to.
      </h1>
      <p className="brd-projects-sub brd-mask" data-revealed={rv} style={d("0.22s")}>
        Three decades of custom homes across Noosa and the Sunshine Coast hinterland, each one
        built start to finish with Mick.
      </p>
    </section>
  );
}
