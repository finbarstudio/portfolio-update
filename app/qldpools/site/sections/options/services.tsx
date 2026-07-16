import { SERVICES_INTRO, SERVICES, PROCESS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Services / "Complete Pool Solutions" — 20 completely fresh design
 * directions. Every previous attempt (the old services.tsx / services2.tsx,
 * 45 options total) has been retired and none of those layouts are
 * repeated here. All NINE services appear in every option. Each option is
 * a single, vertically centred 100vh viewport on a white ground: editorial
 * composition, dense index pages, oversized numerals, grids-as-subject and
 * negative space instead of more bento boxes/arches/photo splits.
 * Server-rendered only: no hooks, no client directive, no event handlers
 * (native <details> is fine). Colours stay inside white / --qpi-ink /
 * --qpi-blue / --qpi-aqua (dark grounds only). Copy is verbatim from
 * SERVICES_INTRO, SERVICES and PROCESS in ../kit.
 */
export const optionsServices: Section[] = [
  // 1 · All 9 titles as small pill tags wrapping in a tight row
  {
    name: "Vertical Tag Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 900 }}>
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          <h2
            className="qpi-display text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.05 }}
          >
            {SERVICES_INTRO.heading}
          </h2>
          <div className="flex flex-wrap gap-3 mt-8">
            {SERVICES.map((s) => (
              <span
                key={s.title}
                className="qpi-caps"
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: 11,
                  border: "1px solid color-mix(in srgb, var(--qpi-ink) 30%, white)",
                  borderRadius: 999,
                  padding: "8px 16px",
                }}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · True 3x3 hairline-only grid, no card backgrounds, one accent cell inverted to ink
  {
    name: "Bare Nine-Cell Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-3"
          style={{ maxWidth: 940, border: "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)" }}
        >
          {SERVICES.map((s, i) => {
            const isAccent = i === 2;
            const noRight = (i + 1) % 3 === 0;
            const noBottom = i >= 6;
            return (
              <div
                key={s.title}
                className="p-4 md:p-6 flex flex-col justify-center"
                style={{
                  background: isAccent ? "var(--qpi-ink)" : "transparent",
                  borderRight: noRight ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)",
                  borderBottom: noBottom ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)",
                  minHeight: 96,
                }}
              >
                <span className="qpi-caps" style={{ color: isAccent ? "var(--qpi-aqua)" : "var(--qpi-blue)", fontSize: 9 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="mt-1"
                  style={{ color: isAccent ? "#fff" : "var(--qpi-ink)", fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.3 }}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 3 · Faded oversized numerals bleeding left, one line per service
  {
    name: "Numeral Ledger, Bled Left",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 760 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.heading}</p>
          <div>
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="flex items-center gap-4"
                style={{ borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 14%, white)", padding: "8px 0" }}
              >
                <span
                  className="qpi-display tabular-nums"
                  style={{ color: "var(--qpi-blue)", opacity: 0.25, fontSize: "1.75rem", lineHeight: 1, marginLeft: "-0.08em", flexShrink: 0, width: 44 }}
                >
                  {i + 1}
                </span>
                <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{s.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · All 9 titles set along a rotated baseline row, heading centred above
  {
    name: "Diagonal Index Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-center gap-10" style={{ maxWidth: 1100 }}>
          <div className="text-center">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
            <h2 className="qpi-display mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>
              {SERVICES_INTRO.heading}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4" style={{ transform: "rotate(-2deg)" }}>
            {SERVICES.map((s) => (
              <span key={s.title} style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · An inset frame nested inside an outer frame, services as a plain 3-col list inside both
  {
    name: "Inset Frame Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full p-3 md:p-5"
          style={{ maxWidth: 900, border: "1px solid color-mix(in srgb, var(--qpi-ink) 16%, white)" }}
        >
          <div className="p-5 md:p-8" style={{ border: "1px solid color-mix(in srgb, var(--qpi-blue) 40%, white)" }}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-5">
              {SERVICES.map((s) => (
                <p key={s.title} style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600, lineHeight: 1.4 }}>
                  {s.title}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · 9 full-width rows separated only by hairlines, numeral hangs right
  {
    name: "Full-Width Baseline Rows",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 900 }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center justify-between"
              style={{ borderTop: "1px solid color-mix(in srgb, var(--qpi-ink) 15%, white)", padding: "10px 0" }}
            >
              <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{s.title}</span>
              <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid color-mix(in srgb, var(--qpi-ink) 15%, white)" }} />
        </div>
      </section>
    ),
  },

  // 7 · Narrow ink panel with heading + process steps, wide panel with services in newspaper columns
  {
    name: "Narrow Panel, Column Wrap",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[minmax(0,0.65fr)_minmax(0,1.35fr)] gap-0"
          style={{ maxWidth: 980 }}
        >
          <div className="p-6 md:p-8 flex flex-col justify-center" style={{ background: "var(--qpi-ink)" }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
            <h2
              className="qpi-display text-balance mt-3"
              style={{ color: "#fff", fontSize: "clamp(1.25rem, 2.2vw, 1.625rem)", lineHeight: 1.1 }}
            >
              {SERVICES_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-1.5 mt-6">
              {PROCESS.map((p) => (
                <p key={p.step} className="qpi-caps" style={{ color: "#fff", opacity: 0.6, fontSize: 9 }}>
                  {p.step} &middot; {p.title}
                </p>
              ))}
            </div>
          </div>
          <div className="p-6 md:p-8" style={{ columns: "3 140px", columnGap: 24 }}>
            {SERVICES.map((s) => (
              <p
                key={s.title}
                style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.4, breakInside: "avoid", marginBottom: 14 }}
              >
                {s.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Spec-sheet manifest, bracket glyph before every title
  {
    name: "Bracket Manifest",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 640 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.heading}</p>
          <div className="flex flex-col gap-2">
            {SERVICES.map((s) => (
              <p key={s.title} style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600, letterSpacing: "0.01em" }}>
                <span style={{ color: "var(--qpi-blue)" }}>[ ]</span> {s.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Faded full-heading watermark behind, tight chip list floats on top
  {
    name: "Overlapping Word Ground",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full flex flex-col items-center" style={{ maxWidth: 1000 }}>
          <p
            className="qpi-display absolute text-balance text-center"
            style={{ color: "var(--qpi-ink)", opacity: 0.06, fontSize: "clamp(2.5rem, 7vw, 5rem)", lineHeight: 1, top: "-16%" }}
          >
            {SERVICES_INTRO.heading}
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-2.5 mt-16" style={{ zIndex: 10 }}>
            {SERVICES.map((s) => (
              <span
                key={s.title}
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: 12,
                  fontWeight: 600,
                  background: "white",
                  border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)",
                  borderRadius: 999,
                  padding: "7px 14px",
                }}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Right-aligned ledger, numerals hung past the right text edge
  {
    name: "Hung Right Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-end text-right" style={{ maxWidth: 780 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          {SERVICES.map((s, i) => (
            <div key={s.title} className="flex items-baseline gap-3" style={{ padding: "6px 0" }}>
              <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{s.title}</span>
              <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", opacity: 0.5, fontSize: 10, marginRight: -18 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Alternating tinted rows, no icons, plain ledger rhythm
  {
    name: "Striped Row Tint",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 860 }}>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center justify-between px-4 md:px-6"
              style={{ background: i % 2 === 0 ? "color-mix(in srgb, var(--qpi-ink) 5%, white)" : "transparent", padding: "10px 16px" }}
            >
              <span style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600 }}>{s.title}</span>
              <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{String(i + 1).padStart(2, "0")}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 12 · Literal technical spec-sheet table: numeral column, title column, thin rules
  {
    name: "Spec Sheet Table",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 780 }}>
          <div className="flex items-baseline justify-between mb-6" style={{ borderBottom: "1px solid var(--qpi-ink)", paddingBottom: 10 }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>{SERVICES_INTRO.heading}</p>
            <p className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>09</p>
          </div>
          {SERVICES.map((s, i) => (
            <div
              key={s.title}
              className="grid grid-cols-[36px_1fr] gap-4"
              style={{ borderTop: i === 0 ? "none" : "1px solid color-mix(in srgb, var(--qpi-ink) 12%, white)", padding: "9px 0" }}
            >
              <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600 }}>{s.title}</span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · 9 collapsed <details> titles, one open showing its body inline
  {
    name: "Nine Tabs, One Open",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 720 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          {SERVICES.map((s, i) => (
            <details
              key={s.title}
              open={i === 2}
              style={{ borderTop: "1px solid color-mix(in srgb, var(--qpi-ink) 15%, white)", padding: "10px 0" }}
            >
              <summary style={{ color: "var(--qpi-ink)", fontSize: "0.9375rem", fontWeight: 600, cursor: "pointer" }}>
                {s.title}
              </summary>
              {i === 2 && (
                <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.8125rem", lineHeight: 1.55 }}>
                  {s.body}
                </p>
              )}
            </details>
          ))}
          <div style={{ borderTop: "1px solid color-mix(in srgb, var(--qpi-ink) 15%, white)" }} />
        </div>
      </section>
    ),
  },

  // 14 · Horizontal strip of real photos above a wrap-row of service chips
  {
    name: "Photo Strip + Chip Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 980 }}>
          <div className="grid grid-cols-4 gap-2 mb-8" style={{ height: 120 }}>
            {GALLERY_IMGS.slice(0, 4).map((src) => (
              <div key={src} className="w-full h-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {SERVICES.map((s) => (
              <span
                key={s.title}
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", fontSize: 10, border: "1px solid color-mix(in srgb, var(--qpi-ink) 25%, white)", borderRadius: 999, padding: "6px 12px" }}
              >
                {s.title}
              </span>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Narrow centred column, "Nn  Title" set as a tight typed manifest
  {
    name: "Typewriter Column",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full text-center" style={{ maxWidth: 520 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          <div className="flex flex-col gap-2.5">
            {SERVICES.map((s, i) => (
              <p key={s.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11, letterSpacing: "0.08em" }}>
                {String(i + 1).padStart(2, "0")}&nbsp;&nbsp;{s.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Two L-shaped bordered zones plus a plain third, three services per zone
  {
    name: "Interlocking L-Plan",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-0" style={{ maxWidth: 940 }}>
          <div className="p-5" style={{ borderTop: "2px solid var(--qpi-ink)", borderLeft: "2px solid var(--qpi-ink)" }}>
            {SERVICES.slice(0, 3).map((s) => (
              <p key={s.title} className="mb-3" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600 }}>{s.title}</p>
            ))}
          </div>
          <div className="p-5" style={{ borderTop: "2px solid var(--qpi-blue)" }}>
            {SERVICES.slice(3, 6).map((s) => (
              <p key={s.title} className="mb-3" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600 }}>{s.title}</p>
            ))}
          </div>
          <div className="p-5" style={{ borderTop: "2px solid var(--qpi-ink)", borderRight: "2px solid var(--qpi-ink)" }}>
            {SERVICES.slice(6, 9).map((s) => (
              <p key={s.title} className="mb-3" style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600 }}>{s.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Giant "9" as the anchor stat, all titles compact in a 3-col grid beside it
  {
    name: "Oversized Nine Stat",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-16 items-center"
          style={{ maxWidth: 940 }}
        >
          <div className="flex flex-col items-start">
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(5rem, 11vw, 8rem)", lineHeight: 0.85 }}>9</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            {SERVICES.map((s) => (
              <p key={s.title} style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.4 }}>{s.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Nine decorative bars in an EQ-style rhythm, each titled along the baseline
  {
    name: "Rule Field Bars",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 960 }}>
          <p className="qpi-caps mb-8 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.heading}</p>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 items-end" style={{ height: 120 }} aria-hidden="true">
            {SERVICES.map((_, i) => (
              <div key={i} style={{ height: `${40 + (i % 4) * 16}%`, background: "var(--qpi-blue)", opacity: 0.35 + (i % 3) * 0.12 }} />
            ))}
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-9 gap-3 mt-3">
            {SERVICES.map((s) => (
              <p key={s.title} style={{ color: "var(--qpi-ink)", fontSize: 10, fontWeight: 600, lineHeight: 1.3, textAlign: "center" }}>
                {s.title}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Two-column dotted-leader index, table-of-contents style
  {
    name: "Marginal Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 860 }}>
          <p className="qpi-caps mb-8 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{SERVICES_INTRO.kicker}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-1">
            {SERVICES.map((s, i) => (
              <div
                key={s.title}
                className="flex items-baseline gap-2"
                style={{ padding: "7px 0", borderBottom: "1px dotted color-mix(in srgb, var(--qpi-ink) 30%, white)" }}
              >
                <span style={{ color: "var(--qpi-ink)", fontSize: "0.875rem", fontWeight: 600, flexShrink: 0 }}>{s.title}</span>
                <span className="flex-1" />
                <span className="qpi-caps tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 10, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 20 · A photo cropped into a diagonal parallelogram, all 9 titles compact on the other side
  {
    name: "Cropped Photo Diagonal",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-8 md:gap-14 items-center"
          style={{ maxWidth: 980 }}
        >
          <div style={{ height: 260, clipPath: "polygon(0 0, 100% 10%, 85% 100%, 0% 90%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[4]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" loading="lazy" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {SERVICES.map((s) => (
              <p key={s.title} style={{ color: "var(--qpi-ink)", fontSize: "0.8125rem", fontWeight: 600, lineHeight: 1.4 }}>{s.title}</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },
];
