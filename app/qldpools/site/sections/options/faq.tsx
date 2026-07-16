import { FAQ_INTRO, FAQS, PHONE, PHONE_HREF, GALLERY_IMGS, type Section } from "../kit";

/**
 * FAQ / "Frequently Asked Questions" — full wipe, round three. All prior
 * experiments (the 45 options previously in this file + faq2.tsx) are
 * retired; every layout below is a new structural idea, none reused. Every
 * question and answer is verbatim from FAQS. Accordions are native
 * <details>/<summary> only (no JS). Every root is locked to one 100vh
 * viewport, vertically centred, white ground, ink/blue/aqua for inner
 * blocks only. The gallery wrapper adds a z-50 label chip, so nothing here
 * exceeds z-40.
 */

const CHEVRON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 20 20"
    className="size-4 shrink-0 transition-transform duration-200 group-open:rotate-180"
    style={{ color: "var(--qpi-blue)" }}
  >
    <path d="M5 7.5 10 12.5 15 7.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PLUS = (
  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" style={{ color: "var(--qpi-blue)" }}>
    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="group-open:hidden" />
    <path d="M4 10h12" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="hidden group-open:block" />
  </svg>
);

function num(i: number) {
  return String(i + 1).padStart(2, "0");
}

export const optionsFaq: Section[] = [
  // 1 · Interview transcript — Q: / A: labels, generous line-height, one continuous column.
  {
    name: "Interview Transcript",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <p className="qpi-caps text-[11px]" style={{ color: "var(--qpi-blue)" }}>{FAQ_INTRO.heading}</p>
          <div className="mt-6 flex flex-col gap-5">
            {FAQS.slice(0, 4).map((f) => (
              <div key={f.q}>
                <p className="flex gap-3 text-[15px] leading-snug" style={{ color: "var(--qpi-ink)" }}>
                  <span className="qpi-caps shrink-0 text-[11px]" style={{ color: "var(--qpi-blue)" }}>Q</span>
                  <span className="font-semibold">{f.q}</span>
                </p>
                <p className="mt-1.5 flex gap-3 text-[14px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>
                  <span className="qpi-caps shrink-0 text-[11px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>A</span>
                  <span>{f.a}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Zebra ink-stripe accordion — alternating tinted rows, first open.
  {
    name: "Zebra Ink Stripe Accordion",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div className="mt-6">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" {...(i === 0 ? { open: true } : {})} style={{ background: i % 2 === 0 ? "rgba(25,60,90,0.04)" : "transparent" }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-5 px-4 py-3.5 cursor-pointer">
                  <span className="text-[14px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  {CHEVRON}
                </summary>
                <p className="px-4 pb-4 text-[13.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Bilateral spine split — questions list left of a centre rule, one answer floats right.
  {
    name: "Bilateral Spine Split",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-8 md:grid-cols-[1fr_1px_1fr]">
          <ul className="m-0 flex list-none flex-col gap-3 p-0 text-right">
            {FAQS.map((f) => (
              <li key={f.q} className="text-[13.5px] font-semibold leading-snug" style={{ color: "var(--qpi-ink)" }}>
                {f.q}
              </li>
            ))}
          </ul>
          <div className="hidden md:block" style={{ background: "rgba(25,60,90,0.12)" }} />
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-blue)" }}>Featured answer</p>
            <p className="mt-2 text-[15px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{FAQS[0].q}</p>
            <p className="mt-2 text-[13.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{FAQS[0].a}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Confidence ledger — check-marked rows with a tabular index.
  {
    name: "Confidence Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div className="mt-6 border-t" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FAQS.map((f, i) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(25,60,90,0.12)" }} {...(i === 2 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center gap-4 py-3.5 cursor-pointer">
                  <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.35 }}>{num(i)}</span>
                  <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4 shrink-0" style={{ color: "var(--qpi-blue)" }}>
                    <path d="M4 10.5 8 14.5 16 5.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[14px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                </summary>
                <p className="pb-3.5 pl-14 text-[13.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Split-flap board — dark numeral chips per row, answer opens in a lighter panel.
  {
    name: "Split-Flap Board",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <p className="qpi-caps text-[11px]" style={{ color: "var(--qpi-blue)" }}>{FAQ_INTRO.heading}</p>
          <div className="mt-5 flex flex-col gap-1.5">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" {...(i === 1 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5" style={{ background: "var(--qpi-ink)" }}>
                  <span className="qpi-caps flex size-6 shrink-0 items-center justify-center rounded-sm text-[10px] tabular-nums text-white" style={{ background: "var(--qpi-blue)" }}>
                    {num(i)}
                  </span>
                  <span className="text-[13.5px] font-semibold text-white">{f.q}</span>
                </summary>
                <p className="rounded-b-md px-3 py-3 text-[13px] leading-relaxed" style={{ background: "rgba(25,60,90,0.05)", color: "var(--qpi-ink)", opacity: 0.75 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Cover story + index — one full answer featured, the rest as a quiet closed index.
  {
    name: "Cover Story + Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-blue)" }}>Most asked</p>
            <h2 className="qpi-display mt-3 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.1rem)", lineHeight: 1.1 }}>
              {FAQS[0].q}
            </h2>
            <p className="mt-4 text-[14.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{FAQS[0].a}</p>
          </div>
          <div className="border-t pt-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>More questions</p>
            <ul className="m-0 mt-3 flex list-none flex-col gap-2.5 p-0">
              {FAQS.slice(1).map((f) => (
                <li key={f.q} className="border-b pb-2.5 text-[13px] font-semibold leading-snug" style={{ borderColor: "rgba(25,60,90,0.08)", color: "var(--qpi-ink)" }}>
                  {f.q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Radio presets — pill-shaped summaries stacked, one tuned open.
  {
    name: "Radio Presets",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div className="mt-6 flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" {...(i === 3 ? { open: true } : {})}>
                <summary
                  className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-4 rounded-full px-5 py-3 group-open:rounded-2xl"
                  style={{ border: "1px solid rgba(25,60,90,0.18)" }}
                >
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  {PLUS}
                </summary>
                <p className="px-5 pb-3 pt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Blueprint annotation — dotted leader lines connect numeral to question.
  {
    name: "Blueprint Annotation",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <p className="qpi-caps text-[11px]" style={{ color: "var(--qpi-blue)" }}>{FAQ_INTRO.heading}</p>
          <div className="mt-5 flex flex-col gap-3.5">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" {...(i === 0 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-baseline gap-3">
                  <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-blue)" }}>{num(i)}</span>
                  <span className="h-px flex-1 self-center" style={{ borderTop: "1px dotted rgba(25,60,90,0.3)" }} />
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                </summary>
                <p className="mt-1.5 ml-10 text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Chat bubble duo — Q/A rendered as opposing bubbles for two questions, list beneath.
  {
    name: "Chat Bubble Duo",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-xl">
          <div className="flex flex-col gap-3">
            {FAQS.slice(0, 2).map((f) => (
              <div key={f.q} className="flex flex-col gap-1.5">
                <p className="qpi-display self-end rounded-2xl rounded-br-sm px-4 py-2.5 text-[13.5px] leading-snug text-white" style={{ background: "var(--qpi-blue)", maxWidth: "80%", textTransform: "none", fontWeight: 600 }}>
                  {f.q}
                </p>
                <p className="self-start rounded-2xl rounded-bl-sm px-4 py-2.5 text-[13px] leading-relaxed" style={{ background: "rgba(25,60,90,0.05)", color: "var(--qpi-ink)", opacity: 0.8, maxWidth: "85%" }}>
                  {f.a}
                </p>
              </div>
            ))}
          </div>
          <p className="qpi-caps mt-6 text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>Also asked</p>
          <ul className="m-0 mt-2 flex list-none flex-wrap gap-2 p-0">
            {FAQS.slice(2).map((f) => (
              <li key={f.q} className="rounded-full px-3.5 py-1.5 text-[12px] font-medium" style={{ border: "1px solid rgba(25,60,90,0.15)", color: "var(--qpi-ink)" }}>
                {f.q.length > 34 ? `${f.q.slice(0, 34)}…` : f.q}
              </li>
            ))}
          </ul>
        </div>
      </section>
    ),
  },

  // 10 · Dossier cards — 2x4 bordered card grid, two open by default.
  {
    name: "Dossier Card Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.4rem,2.6vw,1.9rem)", lineHeight: 1.1 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group rounded-lg p-3.5" style={{ border: "1px solid rgba(25,60,90,0.14)" }} {...(i < 2 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-[12.5px] font-semibold leading-snug" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  {CHEVRON}
                </summary>
                <p className="mt-2 text-[12px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Negative-space monolith — one enormous open question, rest hidden as a thin footnote line.
  {
    name: "Negative Space Monolith",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <p className="qpi-caps text-[11px]" style={{ color: "var(--qpi-blue)" }}>Frequently asked</p>
          <h2 className="qpi-display mt-6 text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem,4.5vw,3.25rem)", lineHeight: 1.05 }}>
            {FAQS[0].q}
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[14.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{FAQS[0].a}</p>
          <p className="mt-10 text-[12px]" style={{ color: "var(--qpi-ink)", opacity: 0.45 }}>
            {FAQS.slice(1, 5).map((f) => f.q.split(" ").slice(0, 3).join(" ")).join(" · ")}
          </p>
        </div>
      </section>
    ),
  },

  // 12 · Ink punch tiles — oversized index numerals reversed on ink squares, answer to the right.
  {
    name: "Punch Tile Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group flex" {...(i === 4 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex w-full cursor-pointer items-start gap-4">
                  <span className="qpi-display flex size-9 shrink-0 items-center justify-center rounded-sm text-[13px] text-white" style={{ background: "var(--qpi-ink)" }}>
                    {i + 1}
                  </span>
                  <span className="mt-1.5 text-[13.5px] font-semibold leading-snug" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                </summary>
                <p className="mt-1.5 pl-[52px] text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Contents-page rule — heading left, questions as a dot-leader table of contents.
  {
    name: "Dot Leader Contents",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-[0.7fr_1.3fr]">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div>
            {FAQS.map((f, i) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(25,60,90,0.1)" }} {...(i === 1 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-baseline gap-3 py-2.5">
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  <span className="flex-1" style={{ borderBottom: "1px dotted rgba(25,60,90,0.3)" }} />
                  <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-blue)" }}>{num(i)}</span>
                </summary>
                <p className="pb-2.5 text-[12.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Blue reversed panel — whole block on the accent blue, white accordions.
  {
    name: "Blue Reversed Panel",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl rounded-2xl px-6 py-8 md:px-10 md:py-10" style={{ background: "var(--qpi-blue)" }}>
          <h2 className="qpi-display text-balance text-white" style={{ fontSize: "clamp(1.4rem,2.6vw,1.9rem)", lineHeight: 1.1 }}>
            {FAQ_INTRO.heading}
          </h2>
          <div className="mt-5">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group border-t border-white/20" {...(i === 0 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-4 py-2.5">
                  <span className="text-[13px] font-semibold text-white">{f.q}</span>
                  <span aria-hidden="true" className="qpi-caps text-[16px] text-white/70 group-open:hidden">+</span>
                  <span aria-hidden="true" className="qpi-caps hidden text-[16px] text-white/70 group-open:block">–</span>
                </summary>
                <p className="pb-2.5 text-[12.5px] leading-relaxed text-white/75">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Vertical rule tabs — thin left rail of numerals, single answer panel swaps by scroll position (static: shows first).
  {
    name: "Rail Tab Reader",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-2xl gap-6">
          <div className="flex shrink-0 flex-col gap-3 border-r pr-4" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FAQS.map((f, i) => (
              <span key={f.q} className="qpi-caps tabular-nums text-[10px]" style={{ color: i === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)", opacity: i === 0 ? 1 : 0.35 }}>
                {num(i)}
              </span>
            ))}
          </div>
          <div>
            <p className="qpi-caps text-[10px]" style={{ color: "var(--qpi-blue)" }}>{FAQ_INTRO.heading}</p>
            <h3 className="mt-2 text-[17px] font-semibold leading-snug" style={{ color: "var(--qpi-ink)" }}>{FAQS[0].q}</h3>
            <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{FAQS[0].a}</p>
            <p className="mt-6 text-[11.5px]" style={{ color: "var(--qpi-ink)", opacity: 0.4 }}>{FAQS.length - 1} more questions below</p>
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Underline rows, no boxes — pure typographic rhythm, heading centred above.
  {
    name: "Underline Rhythm",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl text-center">
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem,3vw,2.25rem)", lineHeight: 1.08 }}>
            {FAQ_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto mt-6 w-full max-w-xl">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" {...(i === 5 ? { open: true } : {})}>
              <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-center gap-2 py-3 text-center underline decoration-1 underline-offset-4" style={{ color: "var(--qpi-ink)", textDecorationColor: "rgba(25,60,90,0.25)" }}>
                <span className="text-[14px] font-semibold">{f.q}</span>
              </summary>
              <p className="mx-auto max-w-md pb-3 text-center text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Aqua-flecked dark card — ink ground, aqua numerals, compact accordion.
  {
    name: "Aqua-Flecked Dark Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl rounded-2xl px-6 py-8 md:px-10 md:py-10" style={{ background: "var(--qpi-ink)" }}>
          <p className="qpi-caps text-[11px]" style={{ color: "var(--qpi-aqua)" }}>{FAQ_INTRO.heading}</p>
          <div className="mt-5 flex flex-col gap-1">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" {...(i === 6 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center gap-3 py-2.5">
                  <span className="qpi-caps tabular-nums text-[10px]" style={{ color: "var(--qpi-aqua)" }}>{num(i)}</span>
                  <span className="text-[13px] font-semibold text-white">{f.q}</span>
                </summary>
                <p className="pb-2.5 pl-8 text-[12.5px] leading-relaxed text-white/65">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Editorial pull-quote lead — the sub copy set large as a pull-quote, accordion beneath compact.
  {
    name: "Pull-Quote Lead",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <p className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem,2.4vw,1.7rem)", lineHeight: 1.25, textTransform: "none", fontWeight: 600 }}>
            {FAQ_INTRO.sub}
          </p>
          <div className="mt-6 border-t" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FAQS.map((f, i) => (
              <details key={f.q} className="group border-b" style={{ borderColor: "rgba(25,60,90,0.1)" }} {...(i === 0 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-4 py-2.5">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  {CHEVRON}
                </summary>
                <p className="pb-2.5 text-[12.5px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Photo corner + list — one project thumbnail anchors the corner, questions run as a tight list.
  {
    name: "Photo Corner Anchor",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-2xl gap-6">
          <div className="hidden shrink-0 overflow-hidden rounded-xl sm:block" style={{ width: 140, height: 180 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[4]} alt="Recent pool installation" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem,2.4vw,1.7rem)", lineHeight: 1.1 }}>
              {FAQ_INTRO.heading}
            </h2>
            <div className="mt-4">
              {FAQS.slice(0, 5).map((f, i) => (
                <details key={f.q} className="group border-t" style={{ borderColor: "rgba(25,60,90,0.1)" }} {...(i === 2 ? { open: true } : {})}>
                  <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-3 py-2">
                    <span className="text-[12.5px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                    {CHEVRON}
                  </summary>
                  <p className="pb-2 text-[12px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Phone-anchored close — accordion above, giant tappable phone number as the exit line.
  {
    name: "Phone-Anchored Close",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <div className="border-b" style={{ borderColor: "rgba(25,60,90,0.12)" }}>
            {FAQS.slice(0, 4).map((f, i) => (
              <details key={f.q} className="group border-t" style={{ borderColor: "rgba(25,60,90,0.12)" }} {...(i === 1 ? { open: true } : {})}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex cursor-pointer items-center justify-between gap-4 py-3">
                  <span className="text-[13.5px] font-semibold" style={{ color: "var(--qpi-ink)" }}>{f.q}</span>
                  {PLUS}
                </summary>
                <p className="pb-3 text-[13px] leading-relaxed" style={{ color: "var(--qpi-ink)", opacity: 0.65 }}>{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 flex flex-col items-start gap-1">
            <span className="qpi-caps text-[10px]" style={{ color: "var(--qpi-ink)", opacity: 0.45 }}>Still have questions</span>
            <a href={PHONE_HREF} className="qpi-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-none" style={{ color: "var(--qpi-blue)" }}>
              {PHONE}
            </a>
          </div>
        </div>
      </section>
    ),
  },
];
