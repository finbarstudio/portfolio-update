import { WHY_INTRO, REASONS, PROCESS, LICENCES, GALLERY_IMGS, type Section } from "../kit";

/**
 * "Why Choose Us / The Proof, Not the Pitch" — 20 completely fresh design
 * directions. Every previous attempt (the old why.tsx / why-grid.tsx /
 * why2.tsx, 61 options total) has been retired and none of those layouts
 * (monuments, seals, plinths, badges, dials, pyramids, arches) are
 * repeated here. Each option is a single, vertically centred 100vh
 * viewport on a white ground, leaning into type-as-architecture, off-grid
 * placement and negative space. Server-rendered only: no hooks, no client
 * directive, no event handlers. Colours stay inside white / --qpi-ink /
 * --qpi-blue / --qpi-aqua (dark grounds only). Copy is verbatim from
 * WHY_INTRO, REASONS, PROCESS and LICENCES in ../kit — the only exception
 * is pulling the big figures already present in REASONS copy ("2,500+",
 * "20+", "25 years"), which the brief explicitly allows.
 */
export const optionsWhy: Section[] = [
  // 1 · 5 reason titles stacked, each indented a little further than the last
  {
    name: "Five-Line Manifest",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 780 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{WHY_INTRO.kicker}</p>
          <div className="flex flex-col gap-3">
            {REASONS.map((r, i) => (
              <h3
                key={r.title}
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 2.4vw, 1.625rem)", fontWeight: 700, marginLeft: i * 22 }}
              >
                {r.title}
              </h3>
            ))}
          </div>
          <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>
            {LICENCES.qbcc} &middot; {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },

  // 2 · Hanging-indent paragraphs, title bold then body running on, jagged left edge
  {
    name: "Hanging Indent Stack",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 640 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{WHY_INTRO.heading}</p>
          <div className="flex flex-col gap-5">
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55, paddingLeft: 24, textIndent: -24 }}>
                <span style={{ fontWeight: 700 }}>{r.title}</span> <span style={{ opacity: 0.62 }}>{r.body}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Titles positioned at increasing horizontal offsets, no rules or boxes at all
  {
    name: "Off-Grid Diagonal List",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 820 }}>
          <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{WHY_INTRO.kicker}</p>
          <div className="flex flex-col gap-4">
            {REASONS.map((r, i) => (
              <p
                key={r.title}
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.8vw, 1.25rem)", fontWeight: 700, marginLeft: `${i * 6}%` }}
              >
                {r.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Uneven split: narrow ink panel with heading + process + licences, wide white panel with reasons
  {
    name: "Two-Zone Split, Uneven",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[0.55fr_1fr] gap-0"
          style={{ maxWidth: 980 }}
        >
          <div className="p-6 md:p-8 flex flex-col justify-center" style={{ background: "var(--qpi-ink)" }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>{WHY_INTRO.kicker}</p>
            <h2
              className="qpi-display text-balance mt-3"
              style={{ color: "#fff", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.15 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-5">
              {PROCESS.map((p) => (
                <span key={p.step} className="qpi-caps" style={{ color: "var(--qpi-aqua)", opacity: 0.85, fontSize: 9 }}>
                  {p.step} {p.title}
                </span>
              ))}
            </div>
            <p className="qpi-caps mt-5" style={{ color: "#fff", opacity: 0.55, fontSize: 9, lineHeight: 1.7 }}>
              {LICENCES.qbcc}<br />{LICENCES.nsw}
            </p>
          </div>
          <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", lineHeight: 1.5, fontWeight: 700 }}>
                {r.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Narrow margin-note list of reason titles, one pulled figure dominates as the anchor
  {
    name: "Marginalia Column",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 md:gap-16 items-center"
          style={{ maxWidth: 940 }}
        >
          <div className="flex flex-col gap-3" style={{ borderLeft: "1px solid var(--qpi-blue)", paddingLeft: 16 }}>
            {REASONS.map((r) => (
              <p key={r.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 10, lineHeight: 1.5 }}>
                {r.title}
              </p>
            ))}
          </div>
          <div className="flex flex-col items-start">
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.9 }}>
              2,500+
            </p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem" }}>{REASONS[1].title}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Heading set huge and full-width, all 5 reason titles reduced to a tiny caption row
  {
    name: "Baseline Overflow Heading",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 1100 }}>
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 6.5vw, 4.5rem)", lineHeight: 0.98 }}>
            {WHY_INTRO.heading}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
            {REASONS.map((r) => (
              <span key={r.title} className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{r.title}</span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Rows alternate left/right alignment, full-width hairline between each
  {
    name: "Interleaved Rule Rows",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 780 }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="flex"
              style={{
                justifyContent: i % 2 === 0 ? "flex-start" : "flex-end",
                borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 14%, white)",
                padding: "12px 0",
                textAlign: i % 2 === 0 ? "left" : "right",
              }}
            >
              <p style={{ color: "var(--qpi-ink)", fontSize: "1rem", fontWeight: 700, maxWidth: 420 }}>{r.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · An outlined frame with the QBCC licence set as a notched label breaking its top edge
  {
    name: "Frame Within Frame",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto relative w-full p-6 md:p-8"
          style={{ maxWidth: 780, border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)" }}
        >
          <p
            className="qpi-caps absolute"
            style={{ top: -10, right: 16, background: "white", padding: "0 8px", color: "var(--qpi-blue)", fontSize: 9 }}
          >
            {LICENCES.qbcc}
          </p>
          <div className="flex flex-col gap-3 mt-2">
            {REASONS.map((r, i) => (
              <div
                key={r.title}
                className="flex items-baseline gap-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 12%, white)", padding: "8px 0" }}
              >
                <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{r.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · One reason set huge and centred as the hero statement, the other 4 reduced to a caption row
  {
    name: "Negative Space Anchor",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-center text-center" style={{ maxWidth: 720 }}>
          <p className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1 }}>
            {REASONS[2].title}
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-10">
            {REASONS.filter((_, i) => i !== 2).map((r) => (
              <span key={r.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>{r.title}</span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · A photo cropped into a wedge, reasons compact on the other side, licences beneath
  {
    name: "Cropped Photo Wedge",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 md:gap-14 items-center"
          style={{ maxWidth: 980 }}
        >
          <div style={{ height: 240, clipPath: "polygon(0 0, 100% 6%, 92% 100%, 0% 94%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[3]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div>
            <div className="flex flex-col gap-2.5">
              {REASONS.map((r) => (
                <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600 }}>{r.title}</p>
              ))}
            </div>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9 }}>
              {LICENCES.qbcc} &middot; {LICENCES.nsw}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 11 · 5 reason titles set at decreasing scale top to bottom, a visual ladder
  {
    name: "Type Scale Ladder",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 820 }}>
          {REASONS.map((r, i) => (
            <p
              key={r.title}
              className="text-balance"
              style={{
                color: "var(--qpi-ink)",
                fontWeight: 700,
                lineHeight: 1.15,
                fontSize: `clamp(${1.75 - i * 0.22}rem, ${4.2 - i * 0.5}vw, ${2.75 - i * 0.35}rem)`,
                marginTop: i === 0 ? 0 : 6,
              }}
            >
              {r.title}
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Plain unboxed rows, each marked by a coloured underline of a different width
  {
    name: "Underline Field, No Boxes",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col gap-6" style={{ maxWidth: 720 }}>
          {REASONS.map((r, i) => (
            <div key={r.title}>
              <p style={{ color: "var(--qpi-ink)", fontSize: "1.0625rem", fontWeight: 700 }}>{r.title}</p>
              <div style={{ height: 2, width: `${28 + i * 10}%`, background: "var(--qpi-blue)", opacity: 0.7, marginTop: 6 }} />
            </div>
          ))}
          <div className="flex gap-2 self-end mt-2">
            <span
              className="qpi-caps"
              style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9, border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)", borderRadius: 999, padding: "4px 10px" }}
            >
              {LICENCES.qbcc}
            </span>
            <span
              className="qpi-caps"
              style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9, border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)", borderRadius: 999, padding: "4px 10px" }}
            >
              {LICENCES.nsw}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Loose editorial two-column flow with titles + body (clamped to 2 lines), licences as a plain footer sentence
  {
    name: "Sentence Footer Licence",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 860 }}>
          <div style={{ columns: "2 300px", columnGap: 40 }}>
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", lineHeight: 1.5, breakInside: "avoid", marginBottom: 16 }}>
                <span style={{ fontWeight: 700 }}>{r.title}</span>{" "}
                <span
                  style={{
                    opacity: 0.62,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {r.body}
                </span>
              </p>
            ))}
          </div>
          <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
            {LICENCES.qbcc} &middot; {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },

  // 14 · Pinned to the right two-thirds, a single vertical rule marks the empty left third
  {
    name: "Right-Edge Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid grid-cols-[1fr_2fr] gap-10 items-center w-full" style={{ maxWidth: 980 }}>
          <div className="hidden md:block justify-self-end" style={{ width: 1, height: 200, background: "var(--qpi-ink)", opacity: 0.15 }} />
          <div className="flex flex-col items-end text-right gap-3">
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "1rem", fontWeight: 700 }}>{r.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 15 · A 3x3 grid where only 5 of 9 cells carry a reason, the empty cells are the composition
  {
    name: "Nine-Square Absence Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full grid grid-cols-3 gap-6" style={{ maxWidth: 900 }}>
          {[REASONS[0], null, REASONS[1], null, REASONS[2], REASONS[3], null, REASONS[4], null].map((r, i) => (
            <div
              key={r ? r.title : `empty-${i}`}
              className="flex flex-col justify-center"
              style={{ minHeight: 90, borderTop: "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)" }}
            >
              {r && <p style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.35 }}>{r.title}</p>}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · A single diagonal rule crosses the section, reasons sit in the two zones it creates
  {
    name: "Diagonal Rule Crossing",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full" style={{ maxWidth: 900, height: 320 }}>
          <div
            style={{ position: "absolute", left: "-4%", right: "-4%", top: "50%", height: 1, background: "var(--qpi-blue)", opacity: 0.4, transform: "rotate(-9deg)" }}
          />
          <div className="absolute flex flex-col gap-2" style={{ top: 12, left: 0, width: "55%" }}>
            {REASONS.slice(0, 3).map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 700 }}>{r.title}</p>
            ))}
          </div>
          <div className="absolute flex flex-col gap-2 text-right" style={{ bottom: 12, right: 0, width: "55%" }}>
            {REASONS.slice(3, 5).map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 700 }}>{r.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Ultra-compact chip row, huge whitespace above and below, tiny kicker
  {
    name: "Compressed Caption Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-center gap-10" style={{ maxWidth: 900 }}>
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>{WHY_INTRO.kicker}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {REASONS.map((r) => (
              <span
                key={r.title}
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", fontSize: 10, border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)", borderRadius: 999, padding: "8px 16px" }}
              >
                {r.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 18 · A plain reason ledger, one pulled figure floats above overlapping the top-right corner
  {
    name: "Ledger with Floating Figure",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full" style={{ maxWidth: 900 }}>
          <p
            className="qpi-display absolute"
            style={{ top: -18, right: 0, color: "var(--qpi-blue)", fontSize: "clamp(2.5rem, 5.5vw, 4rem)", lineHeight: 1 }}
          >
            25 years
          </p>
          <div className="flex flex-col" style={{ maxWidth: 560, paddingTop: 24 }}>
            {REASONS.map((r, i) => (
              <div
                key={r.title}
                className="flex items-baseline gap-3"
                style={{ borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 12%, white)", padding: "9px 0" }}
              >
                <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{r.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Oversized full-width heading, reasons reduced to a dense small-type list beneath, extreme scale contrast
  {
    name: "Two-Speed Type",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 1100 }}>
          <h2 className="qpi-display text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.75rem, 7vw, 5rem)", lineHeight: 0.95 }}>
            {WHY_INTRO.heading}
          </h2>
          <div className="flex flex-col gap-1 mt-10" style={{ maxWidth: 520 }}>
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 12, lineHeight: 1.8 }}>{r.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Reasons run completely loose and unboxed; the only bordered element is the licence panel, tucked in a corner
  {
    name: "Boxed Licence, Loose Reasons",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_auto] gap-10 items-start"
          style={{ maxWidth: 980 }}
        >
          <div className="flex flex-col gap-4">
            {REASONS.map((r) => (
              <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: "1.0625rem", fontWeight: 700 }}>{r.title}</p>
            ))}
          </div>
          <div className="p-5 flex flex-col gap-2" style={{ border: "1px solid var(--qpi-ink)", minWidth: 220 }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{LICENCES.qbcc}</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{LICENCES.nsw}</p>
          </div>
        </div>
      </section>
    ),
  },
];
