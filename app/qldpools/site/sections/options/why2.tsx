import { WHY_INTRO, REASONS, PROCESS, LICENCES, GALLERY_IMGS, type Section } from "../kit";

/**
 * "Why Choose Us / The Proof, Not the Pitch" — batch 2, the "go crazy" set.
 * Finbar already has a safe 25-option set (./why.tsx). This is a second,
 * wilder batch: 20 options built around monuments, seals, plinths, dials —
 * treating the proof points (licences, pool count, warranty years) as the
 * visual subject rather than a text list. Every option fits one 100vh
 * viewport, vertically centred, white ground with real breathing room top
 * and bottom. All five REASONS appear in every option; copy is only ever
 * WHY_INTRO / REASONS / PROCESS / LICENCES, nothing invented.
 */
export const optionsWhy2: Section[] = [
  // 1 · Giant Numerals — the numbers already inside the copy (2,500+, 25
  // years, 20+ years) pulled out huge, each anchoring its reason.
  {
    name: "Giant Numerals",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5 max-w-5xl mx-auto">
          {[
            { big: "QBCC", r: REASONS[0] },
            { big: "2,500+", r: REASONS[1] },
            { big: "$0", r: REASONS[2] },
            { big: "100%", r: REASONS[3] },
            { big: "25yr", r: REASONS[4] },
          ].map(({ big, r }) =>
            r ? (
              <div key={r.title} className="text-center">
                <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1 }}>
                  {big}
                </p>
                <p className="mt-2" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>
                  {r.title}
                </p>
              </div>
            ) : null,
          )}
        </div>
      </section>
    ),
  },

  // 2 · Arch Plinths — five arch-topped plinths, each a reason resting on a
  // pedestal, licence numbers as the base inscription.
  {
    name: "Arch Plinths",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-2.5 md:gap-4 max-w-5xl mx-auto items-end">
          {REASONS.map((r) => (
            <div key={r.title} className="flex flex-col items-center text-center">
              <div
                className="w-full flex items-end justify-center text-center px-1.5 pb-2"
                style={{ height: 92, background: "rgba(25,60,90,0.07)", borderRadius: "9999px 9999px 0 0", border: "1.5px solid var(--qpi-blue)" }}
              >
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10, lineHeight: 1.25 }}>{r.title}</p>
              </div>
              <div className="w-full" style={{ height: 6, background: "var(--qpi-ink)" }} />
            </div>
          ))}
        </div>
        <p className="qpi-caps text-center mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9.5, letterSpacing: "0.1em" }}>
          {LICENCES.qbcc} &middot; {LICENCES.nsw}
        </p>
      </section>
    ),
  },

  // 3 · Certificate Seal — a bordered certificate card, licence numbers as
  // the seal, reasons as the fine-print clauses.
  {
    name: "Certificate Seal",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl p-6 md:p-9" style={{ border: "2px solid var(--qpi-ink)" }}>
          <div className="p-3 md:p-4" style={{ border: "1px solid var(--qpi-ink)" }}>
            <div className="text-center mb-5">
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em" }}>
                {WHY_INTRO.kicker}
              </p>
              <h2 className="mt-1" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.1 }}>
                {WHY_INTRO.heading}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mb-5">
              {REASONS.map((r, i) => (
                <p key={r.title} style={{ color: "var(--qpi-ink)", fontSize: 11.5, lineHeight: 1.4 }}>
                  <span style={{ fontWeight: 700 }}>{String(i + 1)}. {r.title}.</span>{" "}
                  <span style={{ opacity: 0.6 }}>{r.body}</span>
                </p>
              ))}
            </div>
            <div className="flex flex-col items-center gap-1 pt-3" style={{ borderTop: "1px solid rgba(25,60,90,0.2)" }}>
              <div
                className="flex items-center justify-center text-center"
                style={{ width: 70, height: 70, borderRadius: "50%", border: "2px dashed var(--qpi-blue)" }}
              >
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 8.5, lineHeight: 1.3 }}>Licensed &amp; Insured</span>
              </div>
              <p className="qpi-caps mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9, letterSpacing: "0.08em" }}>
                {LICENCES.qbcc} &middot; {LICENCES.nsw}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Ledger, Oversized Figures — ledger rows where the numeric proof is
  // pulled left in huge tabular type, the claim sits small beside it.
  {
    name: "Ledger Oversized Figures",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mb-6">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="max-w-4xl">
          {[
            { fig: "QBCC", r: REASONS[0] },
            { fig: "2,500+", r: REASONS[1] },
            { fig: "$0", r: REASONS[2] },
            { fig: "7", r: REASONS[3] },
            { fig: "25yr", r: REASONS[4] },
          ].map(({ fig, r }, i) =>
            r ? (
              <div
                key={r.title}
                className="grid grid-cols-[96px_1fr] md:grid-cols-[140px_1fr] items-center gap-4 md:gap-8 py-2.5"
                style={{ borderTop: i === 0 ? "1px solid rgba(25,60,90,0.2)" : undefined, borderBottom: "1px solid rgba(25,60,90,0.2)" }}
              >
                <span className="tabular-nums qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(1.375rem, 2.8vw, 2rem)", lineHeight: 1 }}>
                  {fig}
                </span>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5, lineHeight: 1.3 }}>{r.title}</p>
              </div>
            ) : null,
          )}
        </div>
      </section>
    ),
  },

  // 5 · Monumental Licence Block — the licence numbers set in massive
  // display type as the visual anchor, reasons listed small beside.
  {
    name: "Monumental Licence Block",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              Licensed &amp; Insured
            </p>
            <p className="qpi-display mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 4vw, 2.75rem)", lineHeight: 1.05 }}>
              {LICENCES.qbcc}
            </p>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 4vw, 2.75rem)", lineHeight: 1.05, opacity: 0.5 }}>
              {LICENCES.nsw}
            </p>
          </div>
          <div>
            <h2 className="mb-4" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.15 }}>
              {WHY_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-2.5">
              {REASONS.map((r) => (
                <p key={r.title} style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12, lineHeight: 1.35 }}>{r.title}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Stamped Badges — five circular stamp-style badges, each holding a
  // reason title, tilted at varying angles like ink stamps on a document.
  {
    name: "Stamped Badges",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-5xl mx-auto">
          {REASONS.map((r, i) => {
            const rotate = [-6, 4, -3, 6, -4][i % 5];
            return (
              <div
                key={r.title}
                className="flex items-center justify-center text-center p-3"
                style={{
                  width: 118,
                  height: 118,
                  borderRadius: "50%",
                  border: "2px dashed var(--qpi-blue)",
                  transform: `rotate(${rotate}deg)`,
                }}
              >
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 9, letterSpacing: "0.06em", lineHeight: 1.35 }}>
                  {r.title}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 7 · Stat Anchor + Orbit — one huge stat centred, the other four
  // reasons positioned around it at the corners.
  {
    name: "Stat Anchor + Orbit",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6 items-center">
          <div className="order-1 md:order-1">
            <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{REASONS[0]?.title}</h3>
          </div>
          <div className="order-2 md:order-2">
            <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{REASONS[3]?.title}</h3>
          </div>
          <div className="col-span-2 md:col-span-2 md:row-span-2 order-5 md:order-3 text-center">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
              {WHY_INTRO.kicker}
            </p>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(3rem, 8vw, 5.5rem)", lineHeight: 1 }}>
              {"2,500+"}
            </p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 12, lineHeight: 1.4, maxWidth: 320, margin: "6px auto 0" }}>
              {REASONS[1]?.body}
            </p>
          </div>
          <div className="order-3 md:order-4">
            <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{REASONS[2]?.title}</h3>
          </div>
          <div className="order-4 md:order-5">
            <h3 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>{REASONS[4]?.title}</h3>
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Horizontal Arch Band — five arches in a row across the full width,
  // reasons inside, licence numbers as the footer inscription.
  {
    name: "Horizontal Arch Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-7">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-5 gap-2.5 md:gap-4 max-w-5xl mx-auto">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="flex items-center justify-center text-center p-3"
              style={{ height: 118, background: "rgba(25,60,90,0.06)", borderRadius: "9999px 9999px 6px 6px", border: "1.5px solid rgba(25,60,90,0.25)" }}
            >
              <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 }}>{r.title}</p>
            </div>
          ))}
        </div>
        <p className="qpi-caps text-center mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9.5, letterSpacing: "0.1em" }}>
          {LICENCES.qbcc} &middot; {LICENCES.nsw}
        </p>
      </section>
    ),
  },

  // 9 · Ink Punch-Out — an ink block with white "punched" numeral tabs,
  // reasons reversed out in white.
  {
    name: "Ink Punch-Out",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="relative max-w-5xl mx-auto w-full p-6 md:p-9 overflow-hidden"
          style={{ background: "var(--qpi-ink)", borderRadius: "9999px 9999px 24px 24px" }}
        >
          <div className="absolute inset-0" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={GALLERY_IMGS[4]} alt="A pool installed by QLD Pool Installs" className="w-full h-full object-cover" style={{ opacity: 0.22 }} loading="lazy" />
          </div>
          <div className="relative text-center mb-6">
            <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 10, letterSpacing: "0.18em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "#fff", fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)", lineHeight: 1.1 }}>
              {WHY_INTRO.heading}
            </h2>
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-5 gap-4">
            {REASONS.map((r, i) => (
              <div key={r.title} className="text-center">
                <div
                  className="mx-auto mb-2 flex items-center justify-center"
                  style={{ width: 30, height: 30, background: "#fff", borderRadius: "9999px 9999px 3px 3px" }}
                >
                  <span className="tabular-nums" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12 }}>{i + 1}</span>
                </div>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>{r.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Hand-Drawn Marks — a simple inline SVG mark precedes each reason:
  // shield, wrench, dollar, clipboard, medal.
  {
    name: "Hand-Drawn Marks",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-3xl mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 max-w-5xl">
          {REASONS.map((r, i) => (
            <div key={r.title} className="flex flex-col items-start gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--qpi-blue)" strokeWidth="1.5" aria-hidden="true">
                {i === 0 && <path d="M12 2l8 3v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V5l8-3z" strokeLinejoin="round" />}
                {i === 1 && <><circle cx="12" cy="12" r="9" /><path d="M8 12l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" /></>}
                {i === 2 && <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9 9.5c0-1.5 1.3-2.5 3-2.5s3 1 3 2.3-1.2 1.9-3 2.2-3 1-3 2.3 1.3 2.2 3 2.2 3-1 3-2.5" strokeLinecap="round" /></>}
                {i === 3 && <><rect x="5" y="4" width="14" height="17" rx="1.5" /><path d="M9 3.5h6v2H9zM8 10h8M8 13.5h8M8 17h5" strokeLinecap="round" /></>}
                {i === 4 && <><circle cx="12" cy="9" r="5.5" /><path d="M9 13.5L7.5 21 12 18.5 16.5 21 15 13.5" strokeLinejoin="round" /></>}
              </svg>
              <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12, lineHeight: 1.3 }}>{r.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Podium Steps — three podium blocks of descending height carry
  // three headline reasons; the remaining two flank as small side notes.
  {
    name: "Podium Steps",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex items-end justify-center gap-2 max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-2" style={{ width: 140 }}>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3, textAlign: "center" }}>{REASONS[3]?.title}</p>
            <div className="w-full flex items-center justify-center" style={{ height: 60, background: "rgba(25,60,90,0.1)" }}>
              <span className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: 16 }}>3</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2" style={{ width: 160 }}>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12, lineHeight: 1.3, textAlign: "center" }}>{REASONS[0]?.title}</p>
            <div className="w-full flex items-center justify-center" style={{ height: 108, background: "var(--qpi-ink)" }}>
              <span className="qpi-display" style={{ color: "#fff", fontSize: 22 }}>1</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2" style={{ width: 150 }}>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.3, textAlign: "center" }}>{REASONS[1]?.title}</p>
            <div className="w-full flex items-center justify-center" style={{ height: 80, background: "rgba(25,60,90,0.16)" }}>
              <span className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: 18 }}>2</span>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-10 mt-5">
          {[REASONS[2], REASONS[4]].map((r) =>
            r ? (
              <p key={r.title} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 9.5, letterSpacing: "0.06em" }}>
                {r.title}
              </p>
            ) : null,
          )}
        </div>
      </section>
    ),
  },

  // 12 · Fanned Card Deck — five reason cards overlapping in a gentle fan,
  // like proof documents laid out on a table.
  {
    name: "Fanned Card Deck",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="relative flex justify-center" style={{ height: 190 }}>
          {REASONS.map((r, i) => {
            const rotate = (i - (REASONS.length - 1) / 2) * 7;
            const offset = (i - (REASONS.length - 1) / 2) * 96;
            return (
              <div
                key={r.title}
                className="absolute p-3.5 text-center"
                style={{
                  width: 148,
                  height: 176,
                  left: "50%",
                  top: 0,
                  transform: `translateX(calc(-50% + ${offset}px)) rotate(${rotate}deg)`,
                  background: "#fff",
                  border: "1.5px solid var(--qpi-ink)",
                  borderRadius: "9999px 9999px 6px 6px",
                  zIndex: 10 + i,
                }}
              >
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5, lineHeight: 1.3 }}>{r.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 13 · Newspaper Masthead — heading set as a bold masthead with a double
  // rule, reasons as narrow classified columns, licences as the byline.
  {
    name: "Newspaper Masthead",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full">
          <div className="text-center" style={{ borderTop: "3px solid var(--qpi-ink)", borderBottom: "1px solid var(--qpi-ink)", padding: "10px 0" }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9.5, letterSpacing: "0.2em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
              {WHY_INTRO.heading}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-x-5 gap-y-3 pt-5">
            {REASONS.map((r, i) => (
              <div key={r.title} style={{ borderLeft: i > 0 ? "1px solid rgba(25,60,90,0.2)" : undefined, paddingLeft: i > 0 ? 16 : 0 }}>
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>{r.title}</p>
                <p className="line-clamp-2 mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 9.5, lineHeight: 1.4 }}>{r.body}</p>
              </div>
            ))}
          </div>
          <p className="qpi-caps text-center mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9, letterSpacing: "0.1em" }}>
            {LICENCES.qbcc} &middot; {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },

  // 14 · Ticker Stat Row — a single-line ticker of the proof stats, reason
  // titles echoed small beneath.
  {
    name: "Ticker Stat Row",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="w-full py-3.5 mb-6" style={{ background: "var(--qpi-ink)" }}>
          <p className="whitespace-nowrap text-center overflow-hidden" style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(0.875rem, 1.8vw, 1.25rem)" }}>
            2,500+ POOLS &nbsp;&middot;&nbsp; 25 YEAR WARRANTY &nbsp;&middot;&nbsp; FIXED PRICE &nbsp;&middot;&nbsp; QBCC LICENSED &nbsp;&middot;&nbsp; NSW LICENSED
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {REASONS.map((r) => (
            <p key={r.title} className="text-center" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>
              {r.title}
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Spine Timeline Compact — five nodes evenly spaced on a horizontal
  // spine, titles beneath each, PROCESS steps as small ticks above.
  {
    name: "Spine Timeline Compact",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="relative max-w-4xl mx-auto w-full">
          <div className="absolute left-0 right-0" style={{ top: 6, height: 1.5, background: "var(--qpi-blue)", opacity: 0.4 }} aria-hidden="true" />
          <div className="grid grid-cols-5 gap-3">
            {REASONS.map((r) => (
              <div key={r.title} className="text-center">
                <div className="mx-auto" style={{ width: 13, height: 13, borderRadius: "50%", background: "var(--qpi-blue)" }} />
                <p className="mt-3" style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 11, lineHeight: 1.35 }}>{r.title}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="qpi-caps text-center mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9, letterSpacing: "0.1em" }}>
          {PROCESS.map((p) => p.title).join("  →  ")}
        </p>
      </section>
    ),
  },

  // 16 · Split Diagonal Certificate — a diagonal ink wedge carrying the
  // licence block, reasons list on the white remainder.
  {
    name: "Split Diagonal Certificate",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 md:gap-10 items-center">
          <div
            className="relative flex flex-col justify-center p-6 md:p-8"
            style={{ background: "var(--qpi-ink)", clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)", minHeight: 240 }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 10, letterSpacing: "0.16em" }}>
              Licensed &amp; Insured
            </p>
            <p className="mt-3" style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.6 }}>{LICENCES.qbcc}</p>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, lineHeight: 1.6, opacity: 0.6 }}>{LICENCES.nsw}</p>
          </div>
          <div>
            <h2 className="mb-5" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.15 }}>
              {WHY_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-2.5">
              {REASONS.map((r) => (
                <div key={r.title} className="flex items-baseline gap-3">
                  <span aria-hidden="true" style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--qpi-blue)", flex: "none" }} />
                  <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5 }}>{r.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Number Plate — the QBCC licence formatted like an embossed number
  // plate, reasons as a bullet list beside it.
  {
    name: "Number Plate",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-8 items-center">
          <div className="flex flex-col items-center gap-3">
            <div
              className="flex flex-col items-center justify-center text-center px-5 py-4"
              style={{ border: "3px solid var(--qpi-ink)", borderRadius: 8, background: "rgba(25,60,90,0.05)" }}
            >
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9, letterSpacing: "0.14em" }}>QBCC Licence</p>
              <p className="qpi-display mt-1" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3.4vw, 2.25rem)", letterSpacing: "0.06em" }}>
                15377435
              </p>
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9.5, letterSpacing: "0.08em" }}>{LICENCES.nsw}</p>
          </div>
          <div>
            <h2 className="mb-4" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.15 }}>
              {WHY_INTRO.heading}
            </h2>
            <div className="flex flex-col gap-2">
              {REASONS.map((r) => (
                <p key={r.title} style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 12.5, lineHeight: 1.4 }}>{r.title}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Radar Dial — five reasons positioned around a circular ink ring
  // like a compass, licence numbers at the centre.
  {
    name: "Radar Dial",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto" style={{ width: "min(88vw, 480px)", height: "min(88vw, 480px)", maxHeight: 480 }}>
          <div className="absolute inset-0 rounded-full" style={{ border: "1.5px solid rgba(25,60,90,0.25)" }} aria-hidden="true" />
          <div className="absolute inset-6 rounded-full" style={{ border: "1px solid rgba(25,60,90,0.15)" }} aria-hidden="true" />
          <div
            className="absolute flex flex-col items-center justify-center text-center"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 150 }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9, letterSpacing: "0.14em" }}>{WHY_INTRO.kicker}</p>
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 8, letterSpacing: "0.06em" }}>{LICENCES.qbcc}</p>
          </div>
          {REASONS.map((r, i) => {
            const angle = (i / REASONS.length) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 47;
            const x = 50 + Math.cos(rad) * radius;
            const y = 50 + Math.sin(rad) * radius;
            return (
              <div
                key={r.title}
                className="absolute text-center"
                style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)", width: 100 }}
              >
                <p style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10, lineHeight: 1.25 }}>{r.title}</p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 19 · Stacked Plaques Pyramid — five plaques of increasing width stack
  // toward the base, forming a monument shape (not a data comparison, a
  // rhythm), each carrying a reason.
  {
    name: "Stacked Plaques Pyramid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center mb-6">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.18em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.1 }}>
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex flex-col items-center gap-1.5 mx-auto w-full max-w-xl">
          {REASONS.map((r, i) => (
            <div
              key={r.title}
              className="flex items-center justify-center text-center px-4 py-2"
              style={{
                width: `${46 + i * 13}%`,
                background: i % 2 === 0 ? "var(--qpi-ink)" : "var(--qpi-blue)",
                borderRadius: i === 0 ? "9999px 9999px 4px 4px" : 4,
              }}
            >
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 11, lineHeight: 1.3 }}>{r.title}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Arch Proscenium — one large arch frames the headline stat, a
  // footer strip beneath the arch carries all five reason titles inline
  // with the licence numbers as the corner mark.
  {
    name: "Arch Proscenium",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-3xl">
          <div
            className="flex flex-col items-center justify-center text-center px-6 pt-10 pb-6"
            style={{ border: "1.5px solid var(--qpi-ink)", borderBottom: "none", borderRadius: "9999px 9999px 0 0" }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.875rem)", lineHeight: 1.1 }}>
              {WHY_INTRO.heading}
            </h2>
            <p className="qpi-display mt-4" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2rem, 5vw, 3.25rem)", lineHeight: 1 }}>
              2,500+
            </p>
          </div>
          <div
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-4 py-4"
            style={{ borderTop: "1.5px solid var(--qpi-ink)", borderLeft: "1.5px solid var(--qpi-ink)", borderRight: "1.5px solid var(--qpi-ink)" }}
          >
            {REASONS.map((r, i) => (
              <span key={r.title} style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: 10.5 }}>
                {r.title}
                {i < REASONS.length - 1 && <span style={{ opacity: 0.35, marginLeft: 20 }}>|</span>}
              </span>
            ))}
          </div>
          <p className="qpi-caps text-center mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9, letterSpacing: "0.1em" }}>
            {LICENCES.qbcc} &middot; {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },
];
