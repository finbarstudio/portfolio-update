import { WHY_INTRO, REASONS, PROCESS, GALLERY_IMGS, LICENCES, type Section } from "../kit";

/**
 * "Why Choose Us / The Proof, Not the Pitch" — 25 design options.
 * Server-rendered, in-page sections (not heroes): they size to content,
 * py-20 md:py-28 / px-6 md:px-14, and stay within the qpi-site palette
 * (white, --qpi-ink, --qpi-blue, plus opacity on those three). Copy is
 * pulled verbatim from ../kit — nothing invented beyond pulling the
 * numbers already present in REASONS copy ("2,500+", "20+", "25 years"…).
 */
export const optionsWhy: Section[] = [
  // 1 · Numbered ledger rows, full-width, hairline rules between
  {
    name: "Ledger Rows",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-3xl mb-14 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
          <p className="mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)", lineHeight: 1.65 }}>
            {WHY_INTRO.sub}
          </p>
        </div>
        <div>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="grid grid-cols-1 md:grid-cols-[80px_1fr_1.4fr] gap-3 md:gap-10 py-8 items-baseline"
              style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }}
            >
              <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 13, fontWeight: 600 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.0625rem, 1.6vw, 1.375rem)", fontWeight: 700 }}>
                {r.title}
              </h3>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15, lineHeight: 1.6 }}>{r.body}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }} />
        </div>
      </section>
    ),
  },

  // 2 · Two columns: heading block left, reasons stacked right
  {
    name: "Split Heading Column",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-12 md:gap-16">
          <div className="md:sticky md:top-24 self-start">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-4"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <p className="mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 15, lineHeight: 1.65 }}>
              {WHY_INTRO.sub}
            </p>
          </div>
          <div className="flex flex-col gap-9">
            {REASONS.map((r) => (
              <div key={r.title}>
                <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)", fontWeight: 700 }}>
                  {r.title}
                </h3>
                <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15, lineHeight: 1.62, maxWidth: 560 }}>
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Big stat led ("2,500+"), other reasons listed small
  {
    name: "Stat Led",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <p className="qpi-caps text-center" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <h2
          className="text-balance text-center mt-4 mb-14 md:mb-20 mx-auto"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700, maxWidth: 780 }}
        >
          {WHY_INTRO.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-16 items-center mb-16 md:mb-20">
          <div
            className="qpi-display leading-none"
            style={{ color: "var(--qpi-blue)", fontSize: "clamp(4.5rem, 12vw, 9rem)" }}
          >
            2,500+
          </div>
          <div style={{ borderLeft: "1px solid rgba(11,42,74,0.15)", paddingLeft: 32 }} className="md:pl-8">
            <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", fontWeight: 700 }}>
              {REASONS[1]?.title}
            </h3>
            <p className="mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
              {REASONS[1]?.body}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-8">
          {[REASONS[0], REASONS[2], REASONS[3], REASONS[4]].map((r) =>
            r ? (
              <div key={r.title}>
                <h4 style={{ color: "var(--qpi-ink)", fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h4>
              </div>
            ) : null,
          )}
        </div>
      </section>
    ),
  },

  // 4 · Card grid, 2 then 3, thin navy borders
  {
    name: "Card Grid 2+3",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {REASONS.slice(0, 2).map((r) => (
            <div key={r.title} className="p-7 md:p-9" style={{ border: "1px solid rgba(11,42,74,0.18)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.0625rem, 1.5vw, 1.25rem)", fontWeight: 700 }}>
                {r.title}
              </h3>
              <p className="mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15, lineHeight: 1.6 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {REASONS.slice(2, 5).map((r) => (
            <div key={r.title} className="p-7 md:p-8" style={{ border: "1px solid rgba(11,42,74,0.18)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.3vw, 1.125rem)", fontWeight: 700 }}>
                {r.title}
              </h3>
              <p className="mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 14, lineHeight: 1.58 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Navy full-bleed band, white type, five-column thin grid
  {
    name: "Navy Band Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <p className="qpi-caps text-center" style={{ color: "var(--white)", opacity: 0.6, fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <h2
          className="text-balance text-center mt-4 mb-16 md:mb-24 mx-auto"
          style={{ color: "var(--white)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700, maxWidth: 780 }}
        >
          {WHY_INTRO.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {REASONS.map((r, i) => (
            <div key={r.title} className="md:px-3" style={{ borderTop: "1px solid rgba(255,255,255,0.25)", paddingTop: 20 }}>
              <span className="tabular-nums block mb-3" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 600 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ color: "var(--white)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
              <p className="mt-2.5" style={{ color: "var(--white)", opacity: 0.6, fontSize: 13, lineHeight: 1.55 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Photo left half, reasons list right half
  {
    name: "Photo Split",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 5" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[2]}
              alt="A pool installed by QLD Pool Installs"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-4 mb-9"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.625rem, 2.6vw, 2.25rem)", lineHeight: 1.15, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-7">
              {REASONS.map((r) => (
                <div key={r.title} style={{ borderLeft: "2px solid var(--qpi-blue)", paddingLeft: 16 }}>
                  <h3 style={{ color: "var(--qpi-ink)", fontSize: 15.5, fontWeight: 700 }}>{r.title}</h3>
                  <p className="mt-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13.5, lineHeight: 1.55 }}>
                    {r.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Checklist with inline tick SVG before each title
  {
    name: "Tick Checklist",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-3xl mb-14 md:mb-20 mx-auto text-center">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
          <p className="mt-4 mx-auto" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 15.5, lineHeight: 1.65, maxWidth: 620 }}>
            {WHY_INTRO.sub}
          </p>
        </div>
        <div className="max-w-2xl mx-auto flex flex-col gap-6">
          {REASONS.map((r) => (
            <div key={r.title} className="flex gap-4 items-start">
              <span
                className="flex-none grid place-items-center"
                style={{ width: 26, height: 26, borderRadius: "50%", border: "1.5px solid var(--qpi-blue)", marginTop: 2 }}
              >
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M2 7.5L5.5 11L12 3" stroke="var(--qpi-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <h3 style={{ color: "var(--qpi-ink)", fontSize: 16.5, fontWeight: 700 }}>{r.title}</h3>
                <p className="mt-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 14.5, lineHeight: 1.6 }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Alternating rows: title left / body right, wide blue rule between
  {
    name: "Alternating Rows",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-3xl mb-14 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-col">
          {REASONS.map((r) => (
            <div key={r.title} className="grid grid-cols-1 md:grid-cols-[1fr_3px_1.6fr] gap-6 md:gap-10 py-9">
              <h3
                className="md:self-center"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 1.7vw, 1.5rem)", fontWeight: 700, lineHeight: 1.2 }}
              >
                {r.title}
              </h3>
              <div className="hidden md:block" style={{ background: "var(--qpi-blue)", width: 3, height: "100%" }} />
              <p className="md:self-center" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15.5, lineHeight: 1.65 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Heading centred; reasons 3-up then 2-up centred beneath
  {
    name: "Centred 3 Then 2",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
          <p className="mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 15.5, lineHeight: 1.65 }}>
            {WHY_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center max-w-4xl mx-auto mb-10">
          {REASONS.slice(0, 3).map((r) => (
            <div key={r.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 16.5, fontWeight: 700 }}>{r.title}</h3>
              <p className="mt-2.5" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 14, lineHeight: 1.58 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center max-w-2xl mx-auto">
          {REASONS.slice(3, 5).map((r) => (
            <div key={r.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 16.5, fontWeight: 700 }}>{r.title}</h3>
              <p className="mt-2.5" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 14, lineHeight: 1.58 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 10 · Ledger with licence numbers pinned as a footnote row
  {
    name: "Ledger + Licence Footnote",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-3xl mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr_1.4fr] gap-3 md:gap-8 py-6 items-baseline"
              style={{ borderBottom: "1px solid rgba(11,42,74,0.12)" }}
            >
              <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 600 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 16, fontWeight: 700 }}>{r.title}</h3>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 14, lineHeight: 1.55 }}>{r.body}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10.5, letterSpacing: "0.1em" }}>
            {LICENCES.qbcc}
          </p>
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10.5, letterSpacing: "0.1em" }}>
            {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },

  // 11 · Stacked big-type titles, bodies revealed small beneath, huge rhythm
  {
    name: "Big Type Stack",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <p className="qpi-caps mb-16 md:mb-24" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker} — {WHY_INTRO.heading}
        </p>
        <div className="flex flex-col">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="py-10 md:py-14"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined }}
            >
              <h3
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 4.4vw, 3.5rem)", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.01em" }}
              >
                {r.title}
              </h3>
              <p className="mt-4 max-w-xl" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 14.5, lineHeight: 1.6 }}>
                {r.body}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }} />
        </div>
      </section>
    ),
  },

  // 12 · Bento: licence reason large with photo, others compact
  {
    name: "Bento Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-3" style={{ minHeight: 440 }}>
          <div
            className="relative col-span-2 row-span-2 overflow-hidden"
            style={{ background: "var(--qpi-ink)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[0]}
              alt="A pool installed by QLD Pool Installs"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ opacity: 0.35 }}
              loading="lazy"
            />
            <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
              <h3 style={{ color: "var(--white)", fontSize: "clamp(1.25rem, 2vw, 1.75rem)", fontWeight: 700, lineHeight: 1.2 }}>
                {REASONS[0]?.title}
              </h3>
              <p className="mt-3" style={{ color: "var(--white)", opacity: 0.75, fontSize: 14, lineHeight: 1.55 }}>
                {REASONS[0]?.body}
              </p>
            </div>
          </div>
          {REASONS.slice(1).map((r) => (
            <div key={r.title} className="col-span-2 md:col-span-1 p-5 md:p-6" style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
              <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 12.5, lineHeight: 1.5 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · PROCESS timeline above, reasons compact below
  {
    name: "Process Then Proof",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 md:mb-20">
          {PROCESS.map((p) => (
            <div key={p.step} className="pt-5" style={{ borderTop: "2px solid var(--qpi-blue)" }}>
              <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 700 }}>
                {p.step}
              </span>
              <h4 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: 14.5, fontWeight: 700 }}>
                {p.title}
              </h4>
              <p className="mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 12.5, lineHeight: 1.5 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6" style={{ borderTop: "1px solid rgba(11,42,74,0.12)", paddingTop: 32 }}>
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · Native <details> disclosures, titles as summaries
  {
    name: "Disclosure List",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
          <p className="mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 15, lineHeight: 1.6 }}>
            {WHY_INTRO.sub}
          </p>
        </div>
        <div className="max-w-3xl" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
          {REASONS.map((r, i) => (
            <details key={r.title} className="group py-6" style={{ borderBottom: "1px solid rgba(11,42,74,0.15)" }}>
              <summary
                className="flex items-center justify-between gap-6 cursor-pointer list-none"
                style={{ color: "var(--qpi-ink)" }}
              >
                <span className="flex items-baseline gap-4">
                  <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 600 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "clamp(1.0625rem, 1.6vw, 1.375rem)", fontWeight: 700 }}>{r.title}</span>
                </span>
                <span
                  className="flex-none transition-transform group-open:rotate-45"
                  style={{ fontSize: 20, color: "var(--qpi-blue)", lineHeight: 1 }}
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 md:pl-10" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15, lineHeight: 1.65, maxWidth: 640 }}>
                {r.body}
              </p>
            </details>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Off-white ground, two columns, generous leading
  {
    name: "Off-White Two Column",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14" style={{ background: "rgba(11,42,74,0.035)" }}>
        <p className="qpi-caps text-center" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <h2
          className="text-balance text-center mt-4 mb-16 md:mb-20 mx-auto"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.15, fontWeight: 700, maxWidth: 760 }}
        >
          {WHY_INTRO.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-14 gap-y-12 max-w-4xl mx-auto">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 17, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
              <p className="mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 15, lineHeight: 1.85 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Oversized pale number behind each title
  {
    name: "Ghost Numerals",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white overflow-hidden">
        <div className="max-w-2xl mb-14 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-col">
          {REASONS.map((r, i) => (
            <div key={r.title} className="relative py-8 md:py-10" style={{ borderTop: "1px solid rgba(11,42,74,0.1)" }}>
              <span
                aria-hidden="true"
                className="absolute select-none tabular-nums"
                style={{
                  color: "var(--qpi-blue)",
                  opacity: 0.09,
                  fontSize: "clamp(4rem, 10vw, 8rem)",
                  fontWeight: 700,
                  lineHeight: 1,
                  top: "-0.15em",
                  right: 0,
                  zIndex: 0,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="relative z-10 max-w-xl">
                <h3 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", fontWeight: 700 }}>
                  {r.title}
                </h3>
                <p className="mt-2.5" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 14.5, lineHeight: 1.6 }}>
                  {r.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · Editorial: full-width heading, reasons as newspaper columns
  {
    name: "Newspaper Columns",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end mb-14 md:mb-16" style={{ borderBottom: "2px solid var(--qpi-ink)", paddingBottom: 24 }}>
          <h2
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 4vw, 3.25rem)", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            {WHY_INTRO.heading}
          </h2>
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
        </div>
        <p className="mb-10" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 15, lineHeight: 1.65, maxWidth: 680 }}>
          {WHY_INTRO.sub}
        </p>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-10">
          {REASONS.map((r) => (
            <div key={r.title} className="break-inside-avoid mb-9">
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
              <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13.5, lineHeight: 1.65 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Split navy/white: heading on navy left block, reasons on white right
  {
    name: "Split Navy Panel",
    node: (
      <section className="relative w-full bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[0.9fr_1.4fr]">
          <div className="py-20 md:py-28 px-6 md:px-12 flex flex-col justify-center" style={{ background: "var(--qpi-ink)" }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-4"
              style={{ color: "var(--white)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.15, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <p className="mt-5" style={{ color: "var(--white)", opacity: 0.6, fontSize: 14.5, lineHeight: 1.65 }}>
              {WHY_INTRO.sub}
            </p>
          </div>
          <div className="py-20 md:py-28 px-6 md:px-14 flex flex-col gap-8 justify-center">
            {REASONS.map((r) => (
              <div key={r.title}>
                <h3 style={{ color: "var(--qpi-ink)", fontSize: 15.5, fontWeight: 700 }}>{r.title}</h3>
                <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13.5, lineHeight: 1.6, maxWidth: 480 }}>
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Compact ledger table with a right-aligned "verified" tag per row
  {
    name: "Verified Table",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div style={{ border: "1px solid rgba(11,42,74,0.15)" }}>
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="grid grid-cols-1 md:grid-cols-[1.4fr_2fr_auto] gap-3 md:gap-6 items-center px-5 md:px-7 py-5"
              style={{ borderBottom: i < REASONS.length - 1 ? "1px solid rgba(11,42,74,0.15)" : undefined }}
            >
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 15, fontWeight: 700 }}>{r.title}</h3>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 13, lineHeight: 1.55 }}>{r.body}</p>
              <span
                className="qpi-caps justify-self-start md:justify-self-end flex-none"
                style={{
                  color: "var(--qpi-blue)",
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  border: "1px solid var(--qpi-blue)",
                  borderRadius: 999,
                  padding: "5px 12px",
                  whiteSpace: "nowrap",
                }}
              >
                Verified
              </span>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · One reason featured huge (Fixed-Price Guarantee), rest as tiny index
  {
    name: "Featured Reason",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-10 md:gap-16 mt-6">
          <div>
            <h2
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {REASONS[2]?.title}
            </h2>
            <p className="mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.62, fontSize: 16.5, lineHeight: 1.7, maxWidth: 560 }}>
              {REASONS[2]?.body}
            </p>
          </div>
          <div className="flex flex-col gap-5" style={{ borderLeft: "1px solid rgba(11,42,74,0.15)", paddingLeft: 28 }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10, letterSpacing: "0.14em" }}>
              Also true
            </p>
            {[REASONS[0], REASONS[1], REASONS[3], REASONS[4]].map((r) =>
              r ? (
                <h4 key={r.title} style={{ color: "var(--qpi-ink)", fontSize: 13.5, fontWeight: 700, lineHeight: 1.4 }}>
                  {r.title}
                </h4>
              ) : null,
            )}
          </div>
        </div>
      </section>
    ),
  },

  // 21 · Full-bleed photo band top, reasons grid on white beneath
  {
    name: "Photo Band Over Grid",
    node: (
      <section className="relative w-full py-20 md:py-28 bg-white">
        <div className="relative w-full overflow-hidden mb-16 md:mb-20" style={{ aspectRatio: "21 / 8" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GALLERY_IMGS[4]}
            alt="A pool installed by QLD Pool Installs"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.35)" }} />
          <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-14 pb-8 md:pb-10">
            <p className="qpi-caps" style={{ color: "var(--white)", opacity: 0.85, fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-3"
              style={{ color: "var(--white)", fontSize: "clamp(1.75rem, 4vw, 3rem)", lineHeight: 1.1, fontWeight: 700, maxWidth: 760 }}
            >
              {WHY_INTRO.heading}
            </h2>
          </div>
        </div>
        <div className="px-6 md:px-14 grid grid-cols-1 md:grid-cols-5 gap-8">
          {REASONS.map((r) => (
            <div key={r.title}>
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 14.5, fontWeight: 700, lineHeight: 1.35 }}>{r.title}</h3>
              <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 12.5, lineHeight: 1.55 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Vertical timeline with a thin blue spine line
  {
    name: "Spine Timeline",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mb-16 md:mb-20">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-4"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="relative max-w-2xl mx-auto md:mx-0" style={{ paddingLeft: 32 }}>
          <div
            className="absolute top-2 bottom-2"
            style={{ left: 5, width: 1, background: "var(--qpi-blue)", opacity: 0.3 }}
            aria-hidden="true"
          />
          <div className="flex flex-col gap-12">
            {REASONS.map((r) => (
              <div key={r.title} className="relative">
                <span
                  className="absolute rounded-full"
                  style={{ left: -32, top: 5, width: 11, height: 11, background: "var(--qpi-blue)" }}
                  aria-hidden="true"
                />
                <h3 style={{ color: "var(--qpi-ink)", fontSize: 17, fontWeight: 700 }}>{r.title}</h3>
                <p className="mt-2.5" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 14.5, lineHeight: 1.65 }}>
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 23 · Big licence block as the visual anchor, reasons beside
  {
    name: "Licence Anchor",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-12 md:gap-16">
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-4 mb-10"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 2.6vw, 2.125rem)", lineHeight: 1.18, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <div className="p-6 md:p-8" style={{ background: "var(--qpi-ink)" }}>
              <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.14em" }}>
                Licensed &amp; Insured
              </p>
              <p style={{ color: "var(--white)", fontSize: 15, fontWeight: 700, lineHeight: 1.7 }}>{LICENCES.qbcc}</p>
              <p style={{ color: "var(--white)", fontSize: 15, fontWeight: 700, lineHeight: 1.7 }}>{LICENCES.nsw}</p>
            </div>
          </div>
          <div className="flex flex-col gap-8 justify-center">
            {REASONS.map((r) => (
              <div key={r.title} className="grid grid-cols-[3px_1fr] gap-5">
                <div style={{ background: "var(--qpi-blue)" }} />
                <div>
                  <h3 style={{ color: "var(--qpi-ink)", fontSize: 16, fontWeight: 700 }}>{r.title}</h3>
                  <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 14, lineHeight: 1.6 }}>
                    {r.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 24 · Minimal: titles only in a wide column, numbers in blue
  {
    name: "Minimal Titles Only",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <h2
          className="text-balance mt-4 mb-16 md:mb-20"
          style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)", lineHeight: 1.12, fontWeight: 700, maxWidth: 700 }}
        >
          {WHY_INTRO.heading}
        </h2>
        <div className="max-w-3xl">
          {REASONS.map((r, i) => (
            <div key={r.title} className="flex items-baseline gap-6 md:gap-10 py-6" style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }}>
              <span className="tabular-nums flex-none" style={{ color: "var(--qpi-blue)", fontSize: 15, fontWeight: 700 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)", fontWeight: 700, lineHeight: 1.25 }}>
                {r.title}
              </h3>
            </div>
          ))}
          <div style={{ borderTop: "1px solid rgba(11,42,74,0.12)" }} />
        </div>
      </section>
    ),
  },

  // 25 · Navy inner card on white ground holding the full 5-reason grid
  {
    name: "Inner Navy Card",
    node: (
      <section className="relative w-full py-20 md:py-28 px-6 md:px-14 bg-white">
        <div className="p-8 md:p-14" style={{ background: "var(--qpi-ink)" }}>
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-4"
              style={{ color: "var(--white)", fontSize: "clamp(1.625rem, 3vw, 2.5rem)", lineHeight: 1.15, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <p className="mt-4" style={{ color: "var(--white)", opacity: 0.6, fontSize: 14.5, lineHeight: 1.6 }}>
              {WHY_INTRO.sub}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {REASONS.map((r, i) => (
              <div key={r.title}>
                <span className="tabular-nums block mb-2" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 600 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 style={{ color: "var(--white)", fontSize: 15.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
                <p className="mt-2.5" style={{ color: "var(--white)", opacity: 0.58, fontSize: 13, lineHeight: 1.55 }}>
                  {r.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },
];
