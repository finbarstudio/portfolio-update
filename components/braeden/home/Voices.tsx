"use client";

/**
 * Voices — a swappable set of REAL client testimonials (sourced from Braeden's
 * own testimonials page), set as a quiet type-led band. Word of mouth is the
 * whole business, so let people page through more than one. Prev/next crossfades
 * the quote; the band mask-reveals on scroll-in.
 */

import { useState, type CSSProperties } from "react";
import { useReveal } from "../useReveal";

const TESTIMONIALS = [
  {
    quote:
      "Mick and his team are more than tradesmen, they are craftsmen whose attitude and application to their work produces outstanding results.",
    author: "Brian & Dotty Knott",
    place: "Noosa Heads",
  },
  {
    quote:
      "Mick’s quality control and management of his team was exemplary. Practical, honest, collaborative. The house was voted Australia’s House of the Year.",
    author: "Alan Lawson",
    place: "Cooroy Mountain",
  },
  {
    quote:
      "The end product is stunning. I have worked with a lot of builders in my thirty years as an engineer, and very few come close to Mick’s ability.",
    author: "Mike & Sim Burgess",
    place: "Noosa Heads",
  },
  {
    quote:
      "We had every confidence we were in good hands, and that is exactly how it proved. Complete transparency on the costs, the whole way through.",
    author: "Greg & Cheryl O’Neill",
    place: "Built from NSW",
  },
];

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

export default function Voices() {
  const { ref, shown } = useReveal<HTMLElement>();
  const [i, setI] = useState(0);
  const rv = shown ? "1" : undefined;
  const t = TESTIMONIALS[i];

  const swap = (dir: number) => setI((p) => (p + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="brd-band brd-voices" style={{ background: "var(--paper-2)" }} ref={ref}>
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>In their words</p>

      {/* key re-mounts the card on swap so the new quote fades in (no timer) */}
      <div className="brd-voices-card" key={i}>
        <blockquote
          className="brd-band-quote brd-voices-quote"
          style={{ textTransform: "none", fontWeight: 400, fontFamily: "var(--font-quick)", letterSpacing: 0, maxWidth: "26ch" }}
        >
          “{t.quote}”
        </blockquote>
        <p className="brd-band-cite">
          {t.author} <b>·</b> {t.place}
        </p>
      </div>

      <div className="brd-voices-nav brd-mask" data-revealed={rv} style={d("0.16s")}>
        <button type="button" onClick={() => swap(-1)} aria-label="Previous testimonial" className="ff-mono brd-voices-btn">
          ←
        </button>
        <span className="ff-mono brd-voices-idx">
          {String(i + 1).padStart(2, "0")} / {String(TESTIMONIALS.length).padStart(2, "0")}
        </span>
        <button type="button" onClick={() => swap(1)} aria-label="Next testimonial" className="ff-mono brd-voices-btn">
          →
        </button>
      </div>
    </section>
  );
}
