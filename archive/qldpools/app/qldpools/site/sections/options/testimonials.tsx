import { TESTIMONIALS_INTRO, TESTIMONIALS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Third batch: 20 completely new design directions for the Testimonials /
 * "What Our Customers Say" section, replacing the earlier 25-option file
 * wholesale. Client rejected the prior batch outright and asked for fresh,
 * genuinely creative territory (and has already picked "Scattered Review
 * Deck" from testimonials2.tsx, so that move is off limits here too). Every
 * quote is verbatim from TESTIMONIALS (real Google reviews), shortened only
 * via the pre-cut `short` field, never reworded. Server rendered, static, no
 * hooks. Numbered label chip is added by the gallery wrapper, so every
 * z-index in here stays <= 40.
 */
export const optionsTestimonials: Section[] = [
  // 1 · A single quote broken across two wildly different type weights/sizes, like a headline reading itself aloud
  {
    name: "Two-Weight Quote Break",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[880px]">
          <p className="qpi-caps mb-10" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p className="text-balance">
            <span
              style={{
                display: "block",
                color: "var(--qpi-ink)",
                opacity: 0.35,
                fontWeight: 400,
                fontSize: "clamp(1.375rem, 2.6vw, 2rem)",
                lineHeight: 1.3,
              }}
            >
              &ldquo;{TESTIMONIALS[0].quote.split("swimming")[0]}
            </span>
            <span
              style={{
                display: "block",
                color: "var(--qpi-ink)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4.4vw, 3.5rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                marginTop: 6,
              }}
            >
              swimming{TESTIMONIALS[0].quote.split("swimming")[1]}&rdquo;
            </span>
          </p>
          <p className="qpi-caps mt-10" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {TESTIMONIALS[0].name}
          </p>
        </div>
      </section>
    ),
  },

  // 2 · Quote seated inside a chevron formed by clip-path, name notched below the point
  {
    name: "Chevron Cut Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[860px] flex-col items-center">
          <div
            className="flex w-full flex-col justify-center px-10 py-14 text-center md:px-16"
            style={{
              background: "var(--qpi-ink)",
              clipPath: "polygon(0 0, 100% 0, 100% 78%, 50% 100%, 0 78%)",
              paddingBottom: "clamp(64px, 8vw, 96px)",
            }}
          >
            <p
              className="text-balance"
              style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)", lineHeight: 1.45 }}
            >
              &ldquo;{TESTIMONIALS[3].quote}&rdquo;
            </p>
          </div>
          <p className="qpi-caps mt-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS[3].name}
          </p>
        </div>
      </section>
    ),
  },

  // 3 · One review spotlighted large at top, remaining five recede into a single compact strip beneath
  {
    name: "Spotlight + Receding Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1000px]">
          <div className="mx-auto max-w-[760px] text-center">
            <p style={{ color: "var(--qpi-blue)", fontSize: 15, letterSpacing: "0.1em", marginBottom: 20 }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.25 }}
            >
              &ldquo;{TESTIMONIALS[1].short}&rdquo;
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {TESTIMONIALS[1].name}
            </p>
          </div>
          <div
            className="mx-auto mt-16 flex flex-wrap items-start justify-center gap-x-10 gap-y-5"
            style={{ borderTop: "1px solid rgba(25,60,90,0.15)", paddingTop: 28, maxWidth: 1000 }}
          >
            {TESTIMONIALS.filter((_, i) => i !== 1).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 11.5, lineHeight: 1.5, maxWidth: 170 }}>
                &ldquo;{t.short}&rdquo;
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Attribution treated as a running ledger/index column, quotes as a numbered list of amounts on the right
  {
    name: "Ledger Index Column",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-3 md:grid-cols-[200px_1fr]">
          <div className="hidden flex-col justify-between md:flex" style={{ borderRight: "1px solid rgba(25,60,90,0.15)" }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
              6 verified reviews
            </p>
          </div>
          <div>
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="grid grid-cols-[36px_1fr] items-baseline gap-4 py-4 md:grid-cols-[36px_1fr_auto] md:gap-8"
                style={{ borderBottom: i === TESTIMONIALS.length - 1 ? "none" : "1px solid rgba(25,60,90,0.1)" }}
              >
                <span style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 14, lineHeight: 1.55 }}>{t.short}</p>
                <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · An engraved plaque: quote set inside a thin double-rule frame like a brass inscription
  {
    name: "Engraved Plaque",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[720px] text-center">
          <div className="p-10 md:p-14" style={{ border: "1px solid var(--qpi-ink)", boxShadow: "inset 0 0 0 4px #fff, inset 0 0 0 5px rgba(25,60,90,0.35)" }}>
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.22em" }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              style={{
                color: "var(--qpi-ink)",
                fontWeight: 600,
                fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
                lineHeight: 1.6,
                letterSpacing: "0.01em",
              }}
            >
              {TESTIMONIALS[5].quote}
            </p>
            <div style={{ width: 24, height: 1, background: "var(--qpi-blue)", margin: "24px auto" }} />
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10, letterSpacing: "0.18em" }}>
              {TESTIMONIALS[5].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Extreme scale contrast: the word "5.0" fills the viewport width, real quotes tiny beneath as a footnote row
  {
    name: "Billboard Rating, Footnote Quotes",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px] text-center">
          <p className="qpi-caps mb-2" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker} &nbsp;&middot;&nbsp; on Google
          </p>
          <p
            className="qpi-display"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(7rem, 19vw, 15rem)",
              lineHeight: 0.82,
              letterSpacing: "-0.03em",
            }}
          >
            5.0
          </p>
          <p style={{ color: "var(--qpi-blue)", fontSize: 22, letterSpacing: "0.14em", marginTop: 6 }} aria-label="5 out of 5 stars">
            ★★★★★
          </p>
          <div
            className="mx-auto mt-12 grid gap-x-10 gap-y-3 text-left md:grid-cols-3"
            style={{ maxWidth: 980, borderTop: "1px solid rgba(25,60,90,0.15)", paddingTop: 20 }}
          >
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 11.5, lineHeight: 1.5 }}>
                &ldquo;{t.short}&rdquo;{" "}
                <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: 9 }}>
                  {t.name}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Negative space does the work: one short line, set far off-centre, with a huge empty field around it
  {
    name: "Off-Centre Isolate",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="ml-0 max-w-[520px] md:ml-[8%]">
            <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)", lineHeight: 1.25 }}
            >
              &ldquo;{TESTIMONIALS[2].short}&rdquo;
            </p>
            <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 11 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 8 · A stepped panel (staircase clip-path) in ink, each step carrying one review name only, full quote on the top step
  {
    name: "Stepped Panel",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1000px]">
          <div
            className="relative w-full p-10 md:p-14"
            style={{
              background: "var(--qpi-ink)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 66% 100%, 66% 82%, 33% 82%, 33% 100%, 0 100%)",
              paddingBottom: "clamp(64px, 9vw, 96px)",
            }}
          >
            <p className="qpi-caps mb-5" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="max-w-[620px] text-balance"
              style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.4 }}
            >
              {TESTIMONIALS[4].quote}
            </p>
            <div className="mt-10 flex gap-8">
              <p className="qpi-caps" style={{ color: "#fff", fontSize: 10 }}>
                {TESTIMONIALS[4].name}
              </p>
              <p className="qpi-caps hidden md:block" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>
                {TESTIMONIALS[1].name}
              </p>
              <p className="qpi-caps hidden md:block" style={{ color: "#fff", opacity: 0.4, fontSize: 10 }}>
                {TESTIMONIALS[5].name}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Grid of short pull-lines at wildly different sizes, like a type specimen sheet
  {
    name: "Type Specimen Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto flex w-full max-w-[1100px] flex-wrap items-baseline justify-center gap-x-8 gap-y-6">
          {[
            { t: TESTIMONIALS[0], size: "clamp(2rem, 5vw, 3.5rem)", weight: 700, op: 1 },
            { t: TESTIMONIALS[3], size: "clamp(1.125rem, 2vw, 1.5rem)", weight: 500, op: 0.6 },
            { t: TESTIMONIALS[5], size: "clamp(1.5rem, 3.4vw, 2.5rem)", weight: 700, op: 0.85 },
            { t: TESTIMONIALS[2], size: "clamp(1rem, 1.6vw, 1.25rem)", weight: 500, op: 0.5 },
            { t: TESTIMONIALS[4], size: "clamp(1.75rem, 4vw, 2.875rem)", weight: 700, op: 0.95 },
            { t: TESTIMONIALS[1], size: "clamp(1rem, 1.4vw, 1.125rem)", weight: 500, op: 0.45 },
          ].map((row) => (
            <p
              key={row.t.name}
              style={{ color: "var(--qpi-ink)", opacity: row.op, fontWeight: row.weight, fontSize: row.size, lineHeight: 1.15, letterSpacing: "-0.01em" }}
            >
              &ldquo;{row.t.short}&rdquo;
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 10 · A single striking wide-crop photo band paired with one quote set into a narrow sidebar rail
  {
    name: "Wide Crop + Rail Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "21 / 6" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[9]}
              alt="A pool installed by QLD Pool Installs"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <p
              className="max-w-[640px] text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.45 }}
            >
              &ldquo;{TESTIMONIALS[3].short}&rdquo;
            </p>
            <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS[3].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Quote set as a vertical banner running top-to-bottom (rotated 90deg) beside a horizontal name block
  {
    name: "Vertical Banner Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex w-full max-w-[1000px] items-center gap-10 md:gap-16">
          <div className="hidden shrink-0 items-center justify-center md:flex" style={{ width: 60, height: 320 }}>
            <p
              className="qpi-caps whitespace-nowrap"
              style={{ color: "var(--qpi-blue)", fontSize: 12, transform: "rotate(-90deg)", letterSpacing: "0.3em" }}
            >
              {TESTIMONIALS_INTRO.kicker}
            </p>
          </div>
          <div style={{ borderLeft: "1px solid rgba(25,60,90,0.2)", paddingLeft: 32 }}>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.2 }}
            >
              &ldquo;{TESTIMONIALS[0].short}&rdquo;
            </p>
            <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 12 · A skewed parallelogram cut through a photo, quote laid inside the skewed shape counter-skewed to stay legible
  {
    name: "Skewed Photo Parallelogram",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto w-full overflow-hidden" style={{ aspectRatio: "5 / 6", clipPath: "polygon(12% 0, 100% 0, 88% 100%, 0 100%)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[11]}
              alt="A pool installed by QLD Pool Installs"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div>
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.375rem, 2.4vw, 2rem)", lineHeight: 1.45 }}
            >
              {TESTIMONIALS[2].quote}
            </p>
            <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Name-first hierarchy: the customer's name is the dominant graphic, quote is the small supporting caption
  {
    name: "Name-Dominant Byline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
          <p
            className="qpi-display text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 6.5vw, 5rem)", lineHeight: 0.95, letterSpacing: "-0.02em" }}
          >
            {TESTIMONIALS[1].name}
          </p>
          <p style={{ color: "var(--qpi-blue)", fontSize: 16, letterSpacing: "0.12em", marginTop: 18 }} aria-label="5 out of 5 stars">
            ★★★★★
          </p>
          <p
            className="mt-8 max-w-[560px] text-balance"
            style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: "clamp(1rem, 1.6vw, 1.25rem)", lineHeight: 1.65 }}
          >
            &ldquo;{TESTIMONIALS[1].short}&rdquo;
          </p>
        </div>
      </section>
    ),
  },

  // 14 · Two quotes locked in direct opposition across a hairline vertical divide, like a face-off
  {
    name: "Face-Off Divide",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="relative mx-auto grid w-full max-w-[1000px] gap-10 md:grid-cols-2">
          <div
            className="absolute left-1/2 top-0 hidden h-full md:block"
            style={{ width: 1, background: "var(--qpi-blue)", transform: "translateX(-0.5px)" }}
          />
          <div className="text-center md:pr-10 md:text-right">
            <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.5 }}>
              &ldquo;{TESTIMONIALS[4].short}&rdquo;
            </p>
            <p className="qpi-caps mt-5" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[4].name}
            </p>
          </div>
          <div className="text-center md:pl-10 md:text-left">
            <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.5 }}>
              &ldquo;{TESTIMONIALS[5].short}&rdquo;
            </p>
            <p className="qpi-caps mt-5" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[5].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 15 · A timestamp/receipt aesthetic: monospaced ledger lines styled like a printed docket, quote as the itemised line
  {
    name: "Receipt Docket",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[560px]" style={{ border: "1px dashed rgba(25,60,90,0.35)", padding: "36px 28px" }}>
          <p className="qpi-caps mb-1 text-center" style={{ color: "var(--qpi-ink)", fontSize: 12 }}>
            QLD POOL INSTALLS
          </p>
          <p className="qpi-caps mb-6 text-center" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
            verified google reviews
          </p>
          <div style={{ borderTop: "1px dashed rgba(25,60,90,0.35)" }} />
          {TESTIMONIALS.map((t, i) => (
            <div key={t.name} className="py-4" style={{ borderBottom: i === TESTIMONIALS.length - 1 ? "none" : "1px dashed rgba(25,60,90,0.2)" }}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 10 }}>
                  {t.name}
                </span>
                <span style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.08em" }} aria-label="5 out of 5 stars">
                  ★★★★★
                </span>
              </div>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: 12, lineHeight: 1.5, marginTop: 6 }}>{t.short}</p>
            </div>
          ))}
          <div style={{ borderTop: "1px dashed rgba(25,60,90,0.35)", marginTop: 4 }} />
          <p className="qpi-caps mt-5 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            5.0 average &nbsp;&middot;&nbsp; 6 of 6
          </p>
        </div>
      </section>
    ),
  },

  // 16 · A single long quote set as continuous justified text wrapping tightly around a small square photo (editorial run-around)
  {
    name: "Text Run-Around Photo",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[760px]">
          <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <div>
            <div
              className="relative float-right ml-6 mb-2 overflow-hidden"
              style={{ width: "38%", maxWidth: 240, aspectRatio: "1 / 1" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={GALLERY_IMGS[6]}
                alt="A pool installed by QLD Pool Installs"
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.85, fontSize: "clamp(1.0625rem, 1.8vw, 1.3125rem)", lineHeight: 1.65 }}>
              {TESTIMONIALS[0].quote}
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11, clear: "both" }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Quotes as a horizontal bar chart of relative excitement, each bar length keyed to quote length, name at bar end
  {
    name: "Quote Bar Chart",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto mb-12 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex w-full max-w-[900px] flex-col gap-5">
          {[
            { t: TESTIMONIALS[0], w: "94%" },
            { t: TESTIMONIALS[2], w: "78%" },
            { t: TESTIMONIALS[4], w: "62%" },
            { t: TESTIMONIALS[3], w: "50%" },
          ].map((row) => (
            <div key={row.t.name} className="flex items-center gap-4">
              <div
                className="flex items-center py-3 pl-5 pr-4"
                style={{ width: row.w, background: "rgba(24,120,166,0.1)", borderLeft: "3px solid var(--qpi-blue)" }}
              >
                <p style={{ color: "var(--qpi-ink)", opacity: 0.85, fontSize: 13, lineHeight: 1.5 }}>{row.t.short}</p>
              </div>
              <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9 }}>
                {row.t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · A pair of quotes framed like facing pages of an open book, ink spine down the middle
  {
    name: "Open Book Spread",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div
          className="relative mx-auto grid w-full max-w-[980px] gap-0 md:grid-cols-2"
          style={{ border: "1px solid rgba(25,60,90,0.2)", boxShadow: "0 24px 48px rgba(25,60,90,0.1)" }}
        >
          <div
            className="p-9 md:p-12"
            style={{ borderRight: "1px solid rgba(25,60,90,0.2)", background: "linear-gradient(to right, rgba(25,60,90,0.05), transparent)" }}
          >
            <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 14, lineHeight: 1.7 }}>{TESTIMONIALS[1].quote}</p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[1].name}
            </p>
          </div>
          <div className="p-9 md:p-12" style={{ background: "linear-gradient(to left, rgba(25,60,90,0.05), transparent)" }}>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 14, lineHeight: 1.7 }}>{TESTIMONIALS[2].quote}</p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 19 · A photo strip of three narrow tall crops beneath one wide overline quote, gallery-as-proof composition
  {
    name: "Overline Quote, Photo Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1100px]">
          <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
            <p
              className="max-w-[700px] text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.25 }}
            >
              &ldquo;{TESTIMONIALS[4].short}&rdquo;
            </p>
            <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS[4].name}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[GALLERY_IMGS[7], GALLERY_IMGS[8], GALLERY_IMGS[12]].map((src) => (
              <div key={src} className="relative w-full overflow-hidden" style={{ aspectRatio: "3 / 4" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="A pool installed by QLD Pool Installs" className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 20 · A quote rendered as if punched into a strip of perforated ticket stubs, one stub per word-cluster
  {
    name: "Ticket Stub Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto flex w-full max-w-[1000px] flex-col divide-y md:flex-row md:divide-x md:divide-y-0" style={{ borderTop: "1px solid rgba(25,60,90,0.2)", borderBottom: "1px solid rgba(25,60,90,0.2)" }}>
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div key={t.name} className="relative flex flex-1 flex-col items-center gap-3 px-6 py-8 text-center" style={{ borderColor: "rgba(25,60,90,0.2)" }}>
              <div
                aria-hidden="true"
                className="absolute -top-1.5 left-1/2 hidden h-3 w-3 rounded-full bg-white md:block"
                style={{ transform: "translateX(-50%)", border: "1px solid rgba(25,60,90,0.2)" }}
              />
              <p style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.08em" }} aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 13, lineHeight: 1.55 }}>{t.short}</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                {t.name}
              </p>
              <div
                aria-hidden="true"
                className="absolute -bottom-1.5 left-1/2 hidden h-3 w-3 rounded-full bg-white md:block"
                style={{ transform: "translateX(-50%)", border: "1px solid rgba(25,60,90,0.2)" }}
              />
            </div>
          ))}
        </div>
      </section>
    ),
  },
];
