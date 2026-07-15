import { TESTIMONIALS_INTRO, TESTIMONIALS, GALLERY_IMGS, type Section } from "../kit";

/**
 * 25 design directions for the Testimonials / "What Our Customers Say"
 * section. Every quote is verbatim from TESTIMONIALS (real Google reviews) —
 * shortened only via the pre-cut `short` field, never reworded. Server
 * rendered, static, no hooks. Numbered label chip is added by the gallery
 * wrapper, so every z-index in here stays <= 40.
 */
export const optionsTestimonials: Section[] = [
  // 1 · One enormous pull quote, tiny attribution, vast whitespace
  {
    name: "Vast Whitespace Pull",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto flex max-w-[900px] flex-col items-center text-center">
          <p className="qpi-caps mb-10 md:mb-16" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
            }}
          >
            &ldquo;{TESTIMONIALS[0].short}&rdquo;
          </p>
          <div style={{ width: 40, height: 1, background: "var(--qpi-blue)", margin: "40px 0 20px" }} />
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {TESTIMONIALS[0].name}
          </p>
        </div>
      </section>
    ),
  },

  // 2 · Three-up cards with hairline top rules
  {
    name: "Three-Up Hairline Cards",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div key={t.name} className="pt-6" style={{ borderTop: "2px solid var(--qpi-blue)" }}>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 15, lineHeight: 1.7 }}>{t.quote}</p>
              <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · Navy full-bleed band, white quotes, 3-up
  {
    name: "Navy Full-Bleed Band",
    node: (
      <section className="relative w-full overflow-hidden py-20 md:py-28 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "#fff", opacity: 0.6, fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 className="text-balance" style={{ color: "#fff", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-3">
          {TESTIMONIALS.slice(3, 6).map((t) => (
            <div key={t.name}>
              <p style={{ color: "#fff", fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.6, fontWeight: 600 }}>
                &ldquo;{t.short}&rdquo;
              </p>
              <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Ledger rows: quote left, name right, thin rule between, 6 rows
  {
    name: "Ledger Rows",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-4 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <h2 className="mb-14 text-balance text-center" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
          {TESTIMONIALS_INTRO.heading}
        </h2>
        <div className="mx-auto max-w-[1100px]">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="flex flex-col gap-3 py-7 md:flex-row md:items-center md:justify-between md:gap-10"
              style={{ borderTop: i === 0 ? "1px solid rgba(11,42,74,0.15)" : undefined, borderBottom: "1px solid rgba(11,42,74,0.15)" }}
            >
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 15, lineHeight: 1.6, flex: 1 }}>{t.short}</p>
              <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Magazine spread: one big quote left, two small stacked right
  {
    name: "Magazine Spread",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.75rem, 3.5vw, 3rem)", lineHeight: 1.25 }}
            >
              &ldquo;{TESTIMONIALS[2].quote}&rdquo;
            </p>
            <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
          <div className="flex flex-col gap-10 md:pt-16">
            {TESTIMONIALS.slice(4, 6).map((t) => (
              <div key={t.name} style={{ borderLeft: "2px solid var(--qpi-blue)", paddingLeft: 20 }}>
                <p style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: 14, lineHeight: 1.65 }}>{t.short}</p>
                <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Big blue quotation mark as graphic anchor beside one quote
  {
    name: "Big Blue Mark",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto flex max-w-[900px] items-start gap-6 md:gap-10">
          <div
            aria-hidden="true"
            style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: "clamp(4rem, 10vw, 9rem)", lineHeight: 0.6, flexShrink: 0 }}
          >
            &ldquo;
          </div>
          <div className="pt-6 md:pt-10">
            <p className="qpi-caps mb-5" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.4, fontWeight: 600 }}>
              {TESTIMONIALS[1].quote}
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[1].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Stars row above each quote, 2-up grid, generous spacing
  {
    name: "Stars Grid Two-Up",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-16 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1100px] gap-x-16 gap-y-14 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <div key={t.name}>
              <p style={{ color: "var(--qpi-blue)", fontSize: 16, letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 16, lineHeight: 1.7, marginTop: 16 }}>{t.quote}</p>
              <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 8 · Alternating left/right aligned quotes down the page, no boxes
  {
    name: "Alternating Rag",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-14 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto flex max-w-[900px] flex-col gap-16">
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <div key={t.name} style={{ textAlign: i % 2 === 0 ? "left" : "right" }}>
              <p
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.45, fontWeight: 600 }}
              >
                &ldquo;{t.short}&rdquo;
              </p>
              <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Outlined 1px navy boxes, name outside the box beneath
  {
    name: "Outlined Boxes",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-x-8 gap-y-12 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name}>
              <div className="p-7" style={{ border: "1px solid var(--qpi-ink)" }}>
                <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 14, lineHeight: 1.65 }}>{t.short}</p>
              </div>
              <p className="qpi-caps mt-4 text-center" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 10 · Photo left half, single long quote right half
  {
    name: "Photo Half Quote Half",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-2 md:items-center">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[3]}
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
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.875rem)", lineHeight: 1.5, fontWeight: 600 }}
            >
              {TESTIMONIALS[4].quote}
            </p>
            <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[4].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Centred single quote, thin rule above and below, name in qpi-caps
  {
    name: "Centred Rule Quote",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <div style={{ width: 56, height: 1, background: "var(--qpi-ink)", opacity: 0.25, marginBottom: 32 }} />
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.45, fontWeight: 600 }}
          >
            {TESTIMONIALS[5].quote}
          </p>
          <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {TESTIMONIALS[5].name}
          </p>
          <div style={{ width: 56, height: 1, background: "var(--qpi-ink)", opacity: 0.25, marginTop: 32 }} />
        </div>
      </section>
    ),
  },

  // 12 · Four short pull quotes as a 2x2 of huge type, names tiny
  {
    name: "Four Big Pulls",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-14 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto grid max-w-[1200px] gap-x-14 gap-y-16 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <div key={t.name}>
              <p
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.375rem)", lineHeight: 1.15, letterSpacing: "-0.015em" }}
              >
                {t.short}
              </p>
              <p className="qpi-caps mt-5" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Marquee-feel: quotes in one long row bleeding off the right edge
  {
    name: "Marquee Row",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28">
        <p className="qpi-caps mb-12 px-6 text-center md:px-14" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="flex gap-16 overflow-x-hidden pl-6 md:pl-14" style={{ maskImage: "linear-gradient(to right, black 82%, transparent 100%)" }}>
          {TESTIMONIALS.map((t) => (
            <p
              key={t.name}
              className="whitespace-nowrap"
              style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)", flexShrink: 0 }}
            >
              &ldquo;{t.short}&rdquo;
              <span className="qpi-caps ml-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                {t.name}
              </span>
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · Numbered (01-06) quote list, very editorial, tight rules
  {
    name: "Numbered Editorial List",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 flex max-w-[1100px] items-end justify-between gap-6" style={{ borderBottom: "1px solid var(--qpi-ink)", paddingBottom: 20 }}>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
          <p className="qpi-caps whitespace-nowrap" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
        </div>
        <div className="mx-auto max-w-[1100px]">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="grid grid-cols-[auto_1fr] gap-6 py-6 md:grid-cols-[60px_1fr_auto] md:items-center md:gap-10"
              style={{ borderBottom: "1px solid rgba(11,42,74,0.12)" }}
            >
              <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 12 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 15, lineHeight: 1.6 }}>{t.short}</p>
              <p className="qpi-caps col-span-2 md:col-span-1" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Two columns of three, each quote with stars and a blue name
  {
    name: "Two Column Six",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 className="text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 15, lineHeight: 1.6, marginTop: 16 }}>{TESTIMONIALS_INTRO.sub}</p>
        </div>
        <div className="mx-auto grid max-w-[1100px] gap-x-16 gap-y-10 md:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="flex flex-col gap-3 py-6" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
              <p style={{ color: "var(--qpi-blue)", fontSize: 13, letterSpacing: "0.08em" }} aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 14, lineHeight: 1.65 }}>{t.short}</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · Full-bleed photo background, single white quote card floating over it
  {
    name: "Floating Card on Photo",
    node: (
      <section className="relative w-full overflow-hidden py-24 md:py-32 px-6 md:px-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={GALLERY_IMGS[4]}
          alt="A pool installed by QLD Pool Installs, lit at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.35)" }} />
        <div className="relative z-10 mx-auto max-w-[640px] bg-white p-10 md:p-14">
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.4, fontWeight: 600 }}
          >
            &ldquo;{TESTIMONIALS[2].short}&rdquo;
          </p>
          <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {TESTIMONIALS[2].name}
          </p>
        </div>
      </section>
    ),
  },

  // 17 · Compact strip: six short quotes as small hairline-separated cells
  {
    name: "Compact Strip Six",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker} &nbsp;·&nbsp; {TESTIMONIALS_INTRO.heading}
        </p>
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.name}
              className="px-4 py-2 text-center md:py-0 md:text-left"
              style={{ borderLeft: i === 0 ? undefined : undefined, borderTop: "1px solid rgba(11,42,74,0.15)", paddingTop: 16 }}
            >
              <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 12.5, lineHeight: 1.5 }}>{t.short}</p>
              <p className="qpi-caps mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Heading huge on the left, single quote stacked right with big leading
  {
    name: "Huge Heading Split",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <h2
              className="qpi-display text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.25rem, 5vw, 4rem)", lineHeight: 0.98, letterSpacing: "-0.02em" }}
            >
              {TESTIMONIALS_INTRO.heading}
            </h2>
          </div>
          <div>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.85 }}>
              {TESTIMONIALS[3].quote}
            </p>
            <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[3].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Navy card grid on white ground, white type inside cards
  {
    name: "Navy Card Grid",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1200px] gap-6 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div key={t.name} className="p-8" style={{ background: "var(--qpi-ink)" }}>
              <p style={{ color: "#fff", opacity: 0.9, fontSize: 15, lineHeight: 1.7 }}>{t.short}</p>
              <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 20 · Quote with an oversized initial letter (drop cap) on the first word
  {
    name: "Drop Cap Quote",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto max-w-[820px]">
          <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2.125rem)", lineHeight: 1.5, fontWeight: 500 }}>
            <span
              aria-hidden="true"
              style={{
                float: "left",
                fontWeight: 700,
                fontSize: "clamp(4.5rem, 9vw, 7rem)",
                lineHeight: 0.8,
                color: "var(--qpi-blue)",
                marginRight: 14,
              }}
            >
              {TESTIMONIALS[0].quote.charAt(0)}
            </span>
            {TESTIMONIALS[0].quote.slice(1)}
          </p>
          <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11, clear: "both" }}>
            {TESTIMONIALS[0].name}
          </p>
        </div>
      </section>
    ),
  },

  // 21 · Stacked full-width quotes, each separated by a wide blue rule
  {
    name: "Stacked Blue Rules",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-14 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto max-w-[860px]">
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <div key={t.name}>
              {i > 0 && <div style={{ height: 3, background: "var(--qpi-blue)", opacity: 0.85, margin: "36px 0" }} />}
              <p
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.45, fontWeight: 600 }}
              >
                &ldquo;{t.short}&rdquo;
              </p>
              <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 22 · Centred column, one quote per "page" block, lots of vertical rhythm
  {
    name: "Vertical Rhythm Pages",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-24 text-center md:gap-32">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.name}>
              {i === 0 && (
                <p className="qpi-caps mb-10" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
                  {TESTIMONIALS_INTRO.kicker}
                </p>
              )}
              <p
                className="text-balance"
                style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.5, fontWeight: 600 }}
              >
                {t.short}
              </p>
              <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Grid where one cell is a blue block holding "5.0 on Google ★★★★★"
  {
    name: "Google Rating Cell",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-14 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid max-w-[1100px] gap-px" style={{ gridTemplateColumns: "repeat(3, 1fr)", background: "rgba(11,42,74,0.15)" }}>
          <div className="flex flex-col items-center justify-center gap-3 p-8 text-center" style={{ background: "var(--qpi-blue)" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1 }}>5.0</p>
            <p style={{ color: "#fff", fontSize: 15, letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p className="qpi-caps" style={{ color: "#fff", opacity: 0.85, fontSize: 10 }}>
              on Google
            </p>
          </div>
          {TESTIMONIALS.slice(0, 5).map((t) => (
            <div key={t.name} className="flex flex-col justify-center gap-3 bg-white p-8">
              <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 13, lineHeight: 1.6 }}>{t.short}</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 24 · Sidebar: names listed left as an index, the selected quote large right
  {
    name: "Index Sidebar",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <p className="qpi-caps mb-14" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[220px_1fr] md:gap-16">
          <div className="flex flex-row flex-wrap gap-x-6 gap-y-2 md:flex-col md:gap-y-5">
            {TESTIMONIALS.map((t, i) => (
              <p
                key={t.name}
                className="qpi-caps"
                style={{ color: i === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)", opacity: i === 0 ? 1 : 0.35, fontSize: 11 }}
              >
                {t.name}
              </p>
            ))}
          </div>
          <div style={{ borderLeft: "2px solid var(--qpi-blue)", paddingLeft: 32 }}>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.4, fontWeight: 600 }}
            >
              {TESTIMONIALS[0].quote}
            </p>
            <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 25 · Minimal: all six short quotes as a simple centred list, names in blue
  {
    name: "Minimal Centred List",
    node: (
      <section className="relative w-full overflow-hidden bg-white py-20 md:py-28 px-6 md:px-14">
        <div className="mx-auto mb-16 max-w-[600px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-10 text-center">
          {TESTIMONIALS.map((t) => (
            <div key={t.name}>
              <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.0625rem, 1.8vw, 1.3125rem)", lineHeight: 1.55, fontWeight: 500 }}>
                {t.short}
              </p>
              <p className="qpi-caps mt-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },
];
