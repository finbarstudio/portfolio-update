"use client";

/**
 * Braeden homepage — STORY, a quiet type-led band (no grid): a single statement,
 * a short line about Mick, and the award record as one quiet credit line. The
 * lines mask-reveal in a stagger when the band scrolls into view.
 */

import { type CSSProperties } from "react";
import { useReveal } from "../useReveal";

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

export default function Story() {
  const { ref, shown } = useReveal<HTMLElement>();
  const rv = shown ? "1" : undefined;

  return (
    <section className="brd-band" ref={ref}>
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>Since 1996</p>
      <h2 className="brd-band-quote brd-mask" data-revealed={rv} style={d("0.1s")}>
        We listen. We ask you questions. We listen again.
      </h2>
      <p className="brd-band-lead brd-mask" data-revealed={rv} style={d("0.22s")}>
        Mick Devlin started Braeden in 1996. Three decades on, it is one of the most decorated
        custom-home companies on the Sunshine Coast, and on every build you deal directly with
        Mick, start to finish.
      </p>
      <p className="brd-band-cite brd-mask" data-revealed={rv} style={d("0.32s")}>
        5× House of the Year <b>·</b> National Master Builder of the Year, 2010
      </p>
    </section>
  );
}
