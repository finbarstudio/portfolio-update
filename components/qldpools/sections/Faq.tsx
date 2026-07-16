"use client";

import { FAQ_INTRO, FAQS } from "@/app/qldpools/site/sections/kit";
import Reveal from "@/components/qldpools/anim/Reveal";

/**
 * FAQ — "Facing Spread" (gallery #27), ported faithfully from
 * app/qldpools/site/sections/options/faq2.tsx (entry index 1). A book-spread
 * of native <details>/<summary> accordions: 4 questions left, 4 right, a
 * hairline spine down the centre like an open FAQ book. Rows stagger in via
 * Reveal; if JS never runs the content is simply visible (no reliance on
 * motion to reveal anything).
 */

const HAIRLINE = "rgba(25,60,90,0.16)";

function Plus() {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-open:rotate-45"
      style={{ color: "var(--qpi-blue)", fontSize: 14, lineHeight: 1 }}
    >
      +
    </span>
  );
}

export default function Faq() {
  return (
    <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
      <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
        {FAQ_INTRO.heading}
      </h2>
      <div className="mx-auto w-full max-w-3xl" style={{ border: `1px solid ${HAIRLINE}` }}>
        <Reveal selector=".f-row" stagger={0.05} className="grid grid-cols-1 md:grid-cols-2 md:gap-0">
          {[FAQS.slice(0, 4), FAQS.slice(4, 8)].map((col, c) => (
            <div key={c} className="px-7 py-2" style={{ borderLeft: c === 1 ? `1px solid ${HAIRLINE}` : undefined }}>
              {col.map((f, i) => (
                <details
                  key={f.q}
                  className="group f-row"
                  style={{ borderBottom: i === col.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}
                >
                  <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-3.5 cursor-pointer text-[12.5px] font-semibold text-[var(--qpi-ink)]">
                    <span>{f.q}</span>
                    <Plus />
                  </summary>
                  <p className="text-pretty pb-3.5 pr-4 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
