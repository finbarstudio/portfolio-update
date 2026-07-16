import { FAQ_INTRO, FAQS, PHONE, PHONE_HREF, GALLERY_IMGS, type Section } from "../kit";

/**
 * FAQ — SECOND, WILDER batch of 20 design options. faq.tsx already covers the
 * safe classic-accordion / two-column / ledger patterns; this file pushes
 * further: arch portals, book spreads, contents pages, ink punch-outs, film
 * strips, radial badges, timeline spines. Every option is a single min-h-svh,
 * vertically centred viewport on a white ground, per the client's hard
 * layout rule (he rejected nothing here specifically, but every other block
 * needed a wilder pass, and FAQ shares the constraint).
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * Accordions are native <details>/<summary>. All 8 FAQS appear in every
 * option; dense layouts show the question with the answer tucked inside a
 * <details> to keep the closed state inside one viewport. Nothing beyond
 * FAQS/FAQ_INTRO/PHONE/GALLERY_IMGS is invented — numerals, "Q."/"A." marks
 * and "+" glyphs are structural, not copy.
 */

const ARCH = "9999px 9999px 0 0";
const HAIRLINE = "rgba(25,60,90,0.14)";

function Plus({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="shrink-0 transition-transform duration-300 group-open:rotate-45"
      style={{ color: "var(--qpi-blue)", fontSize: size, lineHeight: 1 }}
    >
      +
    </span>
  );
}

function Chevron({ light = false }: { light?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0 transition-transform duration-300 group-open:rotate-180" style={{ width: 14, height: 14, color: light ? "#fff" : "var(--qpi-blue)" }}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const optionsFaq2: Section[] = [
  // 1 · Arch Portal Accordion — a small arch-topped photo crowns a rounded
  // arch panel holding a tight, closed accordion of all 8.
  {
    name: "Arch Portal Accordion",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-md text-center">
          <div className="mx-auto mb-5 overflow-hidden" style={{ width: 72, height: 92, borderRadius: ARCH }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[0]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" />
          </div>
          <h2 className="qpi-display text-balance text-[clamp(1.5rem,3.2vw,2.125rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto mt-8 w-full max-w-2xl" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: ARCH }}>
          <div className="px-7 pt-9 pb-2 md:px-10">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-3 cursor-pointer text-[13px] font-semibold text-[var(--qpi-ink)]">
                  <span>{f.q}</span>
                  <Plus />
                </summary>
                <p className="text-pretty pb-3 pr-6 text-[12px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Facing Spread — a book-spread: 4 questions left, 4 right, a hairline
  // spine down the centre like an open FAQ book.
  {
    name: "Facing Spread",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 md:grid-cols-2 md:gap-0" style={{ border: `1px solid ${HAIRLINE}` }}>
          {[FAQS.slice(0, 4), FAQS.slice(4, 8)].map((col, c) => (
            <div key={c} className="px-7 py-2" style={{ borderLeft: c === 1 ? `1px solid ${HAIRLINE}` : undefined }}>
              {col.map((f, i) => (
                <details key={f.q} className="group" style={{ borderBottom: i === col.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                  <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-3.5 cursor-pointer text-[12.5px] font-semibold text-[var(--qpi-ink)]">
                    <span>{f.q}</span>
                    <Plus size={14} />
                  </summary>
                  <p className="text-pretty pb-3.5 pr-4 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · Oversized Numeral Grid — 8 huge blue numerals in a 4x2 grid, each
  // number itself the summary trigger for its question below it.
  {
    name: "Oversized Numeral Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-9 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group">
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer">
                <span className="qpi-display block" style={{ color: "var(--qpi-blue)", fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="block mt-2 text-[11.5px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className="text-pretty mt-2 text-[10.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Contents Page — a dotted leader from each question to its numeral,
  // like the table of contents of a manual.
  {
    name: "Contents Page",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-2xl">
          <h2 className="qpi-display text-balance mb-8 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
          {FAQS.map((f, i) => (
            <details key={f.q} className="group">
              <summary className="list-none [&::-webkit-details-marker]:hidden flex items-baseline gap-3 py-2.5 cursor-pointer">
                <span className="whitespace-nowrap text-[13px] font-semibold text-[var(--qpi-ink)]">{f.q}</span>
                <span aria-hidden="true" className="flex-1" style={{ borderBottom: `1px dotted ${HAIRLINE}`, transform: "translateY(-3px)" }} />
                <span className="qpi-caps shrink-0" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>
              </summary>
              <p className="text-pretty pb-2.5 pl-0 text-[12px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Hanging Marks Compact — vertical list, tiny hanging "Q." in blue,
  // the answer folded inside a details toggled by the question itself.
  {
    name: "Hanging Marks Compact",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto w-full max-w-xl">
          {FAQS.map((f) => (
            <details key={f.q} className="group" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
              <summary className="list-none [&::-webkit-details-marker]:hidden flex items-start gap-3 py-3 cursor-pointer">
                <span aria-hidden="true" className="shrink-0" style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: 12, width: 18 }}>Q.</span>
                <span className="text-[13px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <div className="flex items-start gap-3 pb-3">
                <span aria-hidden="true" className="shrink-0" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontWeight: 700, fontSize: 12, width: 18 }}>A.</span>
                <p className="text-pretty text-[12px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </div>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Ink Punch-Out Grid — a dark inner band with the 8 questions
  // punched out in white, 2 columns, answers folded in details.
  {
    name: "Ink Punch-Out Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-4xl px-7 py-10 md:px-12 md:py-12" style={{ background: "var(--qpi-ink)", borderRadius: 20 }}>
          <h2 className="qpi-display text-balance mb-7 text-[clamp(1.375rem,2.8vw,1.875rem)] leading-[1.05] text-white">
            {FAQ_INTRO.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderTop: i < 2 ? "1px solid rgba(255,255,255,0.18)" : undefined, borderBottom: "1px solid rgba(255,255,255,0.18)" }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-3 cursor-pointer text-[12.5px] font-semibold text-white">
                  <span>{f.q}</span>
                  <Chevron light />
                </summary>
                <p className="text-pretty pb-3 pr-4 text-[11.5px] leading-relaxed text-white/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Big Question Grid — 8 bold statement questions in a tight 2x4 grid,
  // each answer collapsed to a small footnote row beneath it.
  {
    name: "Big Question Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-7">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" style={{ borderTop: i < 2 ? `1px solid ${HAIRLINE}` : undefined, paddingTop: 14 }}>
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer">
                <span className="qpi-display block text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(0.9375rem, 1.6vw, 1.125rem)", lineHeight: 1.2 }}>
                  {f.q}
                </span>
              </summary>
              <p className="text-pretty mt-2 text-[10.5px] leading-relaxed text-[var(--qpi-ink)]/50">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Horizontal Arch Filmstrip — 8 arch-topped mini cards in a single
  // scroll-snapped row, each toggled open by its own summary.
  {
    name: "Horizontal Arch Filmstrip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mb-7 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollSnapType: "x mandatory" }}>
          {FAQS.map((f, i) => (
            <details key={f.q} className="group shrink-0" style={{ width: 180, scrollSnapAlign: "start" }}>
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer block p-5" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: ARCH }}>
                <span className="qpi-caps block" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="block mt-2 text-[12px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className="text-pretty mt-2 px-1 text-[10.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Single Blue Arch Frame — one large arch-topped frame in the pale
  // blue tint, holding the full compact accordion.
  {
    name: "Single Blue Arch Frame",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-lg text-center px-8 pt-14 pb-4" style={{ background: "rgba(24,120,166,0.06)", borderRadius: ARCH }}>
          <h2 className="qpi-display text-balance mb-6 text-[clamp(1.375rem,2.8vw,1.875rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
          <div className="text-left">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-2.5 cursor-pointer text-[12px] font-semibold text-[var(--qpi-ink)]">
                  <span>{f.q}</span>
                  <Plus size={14} />
                </summary>
                <p className="text-pretty pb-2.5 pr-4 text-[11px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Ticket Row — 8 dashed-border ticket stubs in a tight grid, a slight
  // alternating tilt gives it a playful, tossed-down feel.
  {
    name: "Ticket Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 sm:grid-cols-4 gap-5">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group"
              style={{ border: `1.5px dashed ${HAIRLINE}`, borderRadius: 10, padding: "14px 14px", transform: `rotate(${i % 2 === 0 ? -0.6 : 0.6}deg)` }}
            >
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer">
                <span className="qpi-caps block" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="block mt-1.5 text-[11.5px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className="text-pretty mt-2 text-[10px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Justified Wall — all 8 questions set as a dense, closed wall of
  // rows with a running rule; each row folds its answer inline on open.
  {
    name: "Justified Wall",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <h2 className="qpi-display text-balance mb-6 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
          <div style={{ borderTop: `1px solid ${HAIRLINE}` }}>
            {FAQS.map((f) => (
              <details key={f.q} className="group" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center gap-4 py-2.5 cursor-pointer">
                  <span className="text-[13px] leading-snug text-[var(--qpi-ink)]" style={{ fontWeight: 700 }}>{f.q}</span>
                </summary>
                <p className="text-pretty pb-2.5 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Circular Badge List — each question sits beside a filled blue
  // circle badge carrying its number.
  {
    name: "Circular Badge List",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto w-full max-w-xl">
          {FAQS.map((f, i) => (
            <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
              <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center gap-4 py-2.5 cursor-pointer">
                <span
                  aria-hidden="true"
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 26, height: 26, borderRadius: "50%", background: "var(--qpi-blue)", color: "#fff", fontSize: 11, fontWeight: 700 }}
                >
                  {i + 1}
                </span>
                <span className="text-[12.5px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className="text-pretty pb-2.5 pl-10 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Ink Column Split — a solid ink panel holds only the heading, the
  // white panel beside it holds the full compact accordion.
  {
    name: "Ink Column Split",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 md:grid-cols-[0.8fr_1.2fr]" style={{ border: `1px solid ${HAIRLINE}` }}>
          <div className="flex items-center p-8 md:p-10" style={{ background: "var(--qpi-ink)" }}>
            <h2 className="qpi-display text-balance text-[clamp(1.5rem,3vw,2.125rem)] leading-[1.08] text-white">
              {FAQ_INTRO.heading}
            </h2>
          </div>
          <div className="p-6 md:p-8">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-2.5 cursor-pointer text-[12px] font-semibold text-[var(--qpi-ink)]">
                  <span>{f.q}</span>
                  <Plus size={14} />
                </summary>
                <p className="text-pretty pb-2.5 pr-4 text-[11px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Newspaper Columns Compact — three tight CSS-columns of closed rows,
  // reading like classified listings.
  {
    name: "Newspaper Columns Compact",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mb-6 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-8">
          {FAQS.map((f) => (
            <details key={f.q} className="group mb-3" style={{ breakInside: "avoid", borderBottom: `1px solid ${HAIRLINE}` }}>
              <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-3 py-2 cursor-pointer text-[11.5px] font-semibold leading-snug text-[var(--qpi-ink)]">
                <span>{f.q}</span>
                <Plus size={13} />
              </summary>
              <p className="text-pretty pb-2 text-[10.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Arch Silhouette Backdrop — a giant faint arch shape sits behind a
  // simple, centred, compact list of all 8 questions.
  {
    name: "Arch Silhouette Backdrop",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute left-1/2"
          style={{ top: "8%", width: "min(560px, 70vw)", height: "56%", background: "rgba(24,120,166,0.06)", borderRadius: ARCH, transform: "translateX(-50%)", zIndex: 0 }}
        />
        <div className="relative mx-auto w-full max-w-xl text-center" style={{ zIndex: 10 }}>
          <h2 className="qpi-display text-balance mb-7 text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
          <div className="text-left">
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-2.5 cursor-pointer text-[12.5px] font-semibold text-[var(--qpi-ink)]">
                  <span>{f.q}</span>
                  <Plus size={14} />
                </summary>
                <p className="text-pretty pb-2.5 pr-4 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Punch Card Dots — a tabular list with small dot bullets instead of
  // rules, a quiet mechanical rhythm.
  {
    name: "Punch Card Dots",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 gap-x-10">
          {FAQS.map((f) => (
            <details key={f.q} className="group">
              <summary className="list-none [&::-webkit-details-marker]:hidden flex items-start gap-3 py-2.5 cursor-pointer">
                <span aria-hidden="true" className="shrink-0" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--qpi-blue)", marginTop: 6 }} />
                <span className="text-[12px] font-semibold leading-snug text-[var(--qpi-ink)]" style={{ fontVariantNumeric: "tabular-nums" }}>{f.q}</span>
              </summary>
              <p className="text-pretty pb-2.5 pl-[18px] text-[11px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Timeline Spine — a centred vertical rule with questions alternating
  // left and right off tiny blue node dots.
  {
    name: "Timeline Spine",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-7 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="relative mx-auto w-full max-w-3xl">
          <div aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 hidden md:block" style={{ width: 1, background: HAIRLINE, transform: "translateX(-50%)" }} />
          {FAQS.map((f, i) => (
            <details key={f.q} className="group relative md:grid md:grid-cols-2 md:gap-10" style={{ padding: "6px 0" }}>
              <span
                aria-hidden="true"
                className="hidden md:block absolute left-1/2 shrink-0"
                style={{ top: 12, width: 8, height: 8, borderRadius: "50%", background: "var(--qpi-blue)", transform: "translateX(-50%)" }}
              />
              <summary
                className={`list-none [&::-webkit-details-marker]:hidden cursor-pointer py-1.5 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:col-start-2 md:pl-10"}`}
              >
                <span className="text-[12.5px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className={`text-pretty text-[11px] leading-relaxed text-[var(--qpi-ink)]/55 pb-1.5 ${i % 2 === 0 ? "md:text-right md:pr-10" : "md:col-start-2 md:pl-10"}`}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Outlined Wordmark Corner — a huge outlined "FAQ" glyph anchors one
  // corner as pure decoration, the compact list sits opposite it.
  {
    name: "Outlined Wordmark Corner",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <p
          aria-hidden="true"
          className="qpi-display absolute select-none"
          style={{ right: "2%", top: "4%", fontSize: "clamp(6rem, 16vw, 11rem)", lineHeight: 0.8, color: "transparent", WebkitTextStroke: "1.5px rgba(25,60,90,0.1)", zIndex: 0 }}
        >
          FAQ
        </p>
        <div className="relative mx-auto grid w-full max-w-4xl grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10 items-start" style={{ zIndex: 10 }}>
          <h2 className="qpi-display text-balance text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-[var(--qpi-ink)]">
            {FAQ_INTRO.heading}
          </h2>
          <div>
            {FAQS.map((f, i) => (
              <details key={f.q} className="group" style={{ borderBottom: i === FAQS.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-2.5 cursor-pointer text-[12.5px] font-semibold text-[var(--qpi-ink)]">
                  <span>{f.q}</span>
                  <Plus size={14} />
                </summary>
                <p className="text-pretty pb-2.5 pr-4 text-[11.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Stacked Arch Duo — two symmetrical arch-topped panels side by
  // side, four questions closed inside each.
  {
    name: "Stacked Arch Duo",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-8 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-1 sm:grid-cols-2 gap-6">
          {[FAQS.slice(0, 4), FAQS.slice(4, 8)].map((col, c) => (
            <div key={c} className="px-6 pt-8 pb-2" style={{ border: `1px solid ${HAIRLINE}`, borderRadius: ARCH }}>
              {col.map((f, i) => (
                <details key={f.q} className="group" style={{ borderBottom: i === col.length - 1 ? undefined : `1px solid ${HAIRLINE}` }}>
                  <summary className="list-none [&::-webkit-details-marker]:hidden flex items-center justify-between gap-4 py-2.5 cursor-pointer text-[12px] font-semibold text-[var(--qpi-ink)]">
                    <span>{f.q}</span>
                    <Plus size={13} />
                  </summary>
                  <p className="text-pretty pb-2.5 pr-4 text-[11px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Full Card Wall — 8 small arch-topped cards in a tight 4x2 grid,
  // blue border on open via group state, phone line beneath.
  {
    name: "Full Card Wall",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <h2 className="qpi-display text-balance mx-auto mb-7 text-center text-[clamp(1.5rem,3.4vw,2.25rem)] leading-[1.05] text-[var(--qpi-ink)]">
          {FAQ_INTRO.heading}
        </h2>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-2 sm:grid-cols-4 gap-4">
          {FAQS.map((f, i) => (
            <details
              key={f.q}
              className="group transition-colors duration-300"
              style={{ border: `1px solid ${HAIRLINE}`, borderTopLeftRadius: 999, borderTopRightRadius: 999, borderBottomLeftRadius: 8, borderBottomRightRadius: 8, padding: "16px 12px 10px" }}
            >
              <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer text-center">
                <span className="qpi-caps block" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="block mt-1.5 text-[11px] font-semibold leading-snug text-[var(--qpi-ink)]">{f.q}</span>
              </summary>
              <p className="text-pretty mt-2 text-[9.5px] leading-relaxed text-[var(--qpi-ink)]/55">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mx-auto mt-8 text-center text-[11px] text-[var(--qpi-ink)]/40">
          <a href={PHONE_HREF} style={{ color: "var(--qpi-blue)", textDecoration: "none" }}>{PHONE}</a>
        </p>
      </section>
    ),
  },
];
