"use client";

/**
 * Braeden homepage — a single client voice, set as a quiet type-led band (no
 * grid). Word of mouth is the whole business, so one real quote carries it. The
 * lines mask-reveal in a stagger when the band scrolls into view.
 */

import { type CSSProperties } from "react";
import { useReveal } from "../useReveal";

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

export default function Voices() {
  const { ref, shown } = useReveal<HTMLElement>();
  const rv = shown ? "1" : undefined;

  return (
    <section className="brd-band" style={{ background: "var(--paper-2)" }} ref={ref}>
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>In their words</p>
      <blockquote
        className="brd-band-quote brd-mask"
        data-revealed={rv}
        style={{ textTransform: "none", fontWeight: 400, fontFamily: "var(--font-quick)", letterSpacing: 0, maxWidth: "24ch", ...d("0.1s") }}
      >
        “Mick and his team are more than tradesmen, they are craftsmen whose attitude and application
        to their work produces outstanding results.”
      </blockquote>
      <p className="brd-band-cite brd-mask" data-revealed={rv} style={d("0.24s")}>
        Brian &amp; Dotty Knott <b>·</b> Noosa Heads
      </p>
    </section>
  );
}
