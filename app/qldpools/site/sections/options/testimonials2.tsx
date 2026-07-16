import { TESTIMONIALS_INTRO, TESTIMONIALS, GALLERY_IMGS, type Section } from "../kit";

/**
 * Second, wilder batch of 20 design directions for the Testimonials / "What
 * Our Customers Say" section. Client explicitly asked to go further than the
 * safe 25-option file (`testimonials.tsx`): no plain card grids, no repeats
 * of the moves already used there. Every quote is verbatim from TESTIMONIALS
 * (real Google reviews), shortened only via the pre-cut `short` field, never
 * reworded. Server rendered, static, no hooks. Numbered label chip is added
 * by the gallery wrapper, so every z-index in here stays <= 40.
 */
export const optionsTestimonials2: Section[] = [
  // 1 · One colossal full-width pull quote, the other five reduced to a thin ledger row
  {
    name: "Monolith Pull + Ledger Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1200px]">
          <p className="qpi-caps mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 7vw, 6rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
            }}
          >
            &ldquo;{TESTIMONIALS[1].short}&rdquo;
          </p>
          <div
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-3"
            style={{ borderTop: "1px solid rgba(25,60,90,0.15)", paddingTop: 24 }}
          >
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 10 }}>
              {TESTIMONIALS[1].name}
            </p>
            <span style={{ width: 1, height: 12, background: "rgba(25,60,90,0.25)" }} />
            {TESTIMONIALS.filter((_, i) => i !== 1).map((t) => (
              <p key={t.name} className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: 10 }}>
                {t.name}
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Three light arch-shaped pedestals; quote sits above each as an inscription, name on the plinth
  {
    name: "Arch Plinths Trio",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto mb-10 max-w-[720px] text-center">
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <h2 className="text-balance" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", lineHeight: 1.1 }}>
            {TESTIMONIALS_INTRO.heading}
          </h2>
        </div>
        <div className="mx-auto grid w-full max-w-[1000px] items-end gap-8 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div key={t.name} className="flex flex-col items-center text-center">
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 12.5, lineHeight: 1.5, marginBottom: 16 }}>{t.short}</p>
              <div
                className="flex w-full items-end justify-center pb-5"
                style={{ height: 110, background: "rgba(24,120,166,0.12)", borderRadius: "9999px 9999px 0 0" }}
              >
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                  {t.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · Huge translucent blue quotation mark as a structural pillar; two quotes flank a divider through it
  {
    name: "Structural Quotation Mark",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 select-none" style={{ overflow: "hidden", zIndex: 0 }}>
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -54%)",
              fontWeight: 700,
              fontSize: "clamp(18rem, 42vw, 34rem)",
              lineHeight: 0.6,
              color: "var(--qpi-blue)",
              opacity: 0.1,
            }}
          >
            &rdquo;
          </div>
        </div>
        <div className="relative z-10 mx-auto grid w-full max-w-[1000px] gap-10 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div className="md:text-right">
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.7, fontSize: 14, lineHeight: 1.65 }}>{TESTIMONIALS[2].short}</p>
            <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
              {TESTIMONIALS[2].name}
            </p>
          </div>
          <div
            className="hidden md:block"
            style={{ width: 1, height: 120, background: "var(--qpi-blue)", opacity: 0.4, justifySelf: "center" }}
          />
          <div>
            <p style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.5 }}>
              {TESTIMONIALS[3].quote}
            </p>
            <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10 }}>
              {TESTIMONIALS[3].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Overlapping rotated review cards, scattered like a dropped deck
  {
    name: "Scattered Review Deck",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker} &nbsp;&middot;&nbsp; 5.0 on Google
        </p>
        <div className="relative mx-auto w-full max-w-[1100px]" style={{ height: 460 }}>
          {[
            { t: TESTIMONIALS[0], rot: -6, top: 10, left: "4%", w: 300 },
            { t: TESTIMONIALS[1], rot: 4, top: 60, left: "30%", w: 320 },
            { t: TESTIMONIALS[2], rot: -3, top: 0, left: "58%", w: 300 },
            { t: TESTIMONIALS[3], rot: 7, top: 190, left: "12%", w: 300 },
            { t: TESTIMONIALS[4], rot: -8, top: 220, left: "62%", w: 300 },
          ].map((c, i) => (
            <div
              key={c.t.name}
              className="absolute p-6"
              style={{
                top: c.top,
                left: c.left,
                width: c.w,
                background: "#fff",
                border: "1px solid rgba(25,60,90,0.18)",
                boxShadow: "0 14px 30px rgba(25,60,90,0.12)",
                transform: `rotate(${c.rot}deg)`,
                zIndex: 10 + i,
              }}
            >
              <p style={{ color: "var(--qpi-blue)", fontSize: 12, letterSpacing: "0.08em" }} aria-label="5 out of 5 stars">
                ★★★★★
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 13, lineHeight: 1.55, marginTop: 10 }}>{c.t.short}</p>
              <p className="qpi-caps mt-4" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 9 }}>
                {c.t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 5 · Photo with a white quote card punching through its bottom edge
  {
    name: "Photo Punch-Through Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full max-w-[1000px]">
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[2]}
              alt="A pool installed by QLD Pool Installs"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
          <div
            className="relative mx-auto -mt-20 w-[88%] p-8 md:-mt-24 md:w-[70%] md:p-10"
            style={{ background: "#fff", boxShadow: "0 20px 40px rgba(6,26,48,0.18)", zIndex: 10 }}
          >
            <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.45, fontWeight: 600 }}
            >
              &ldquo;{TESTIMONIALS[4].short}&rdquo;
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {TESTIMONIALS[4].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · A vertical spine down the centre with quotes hanging alternately left and right
  {
    name: "Central Spine Timeline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="relative mx-auto w-full max-w-[900px]">
          <div
            className="absolute left-1/2 top-0 hidden h-full md:block"
            style={{ width: 2, background: "rgba(25,60,90,0.18)", transform: "translateX(-1px)" }}
          />
          <div className="flex flex-col gap-10 md:gap-2">
            {TESTIMONIALS.slice(0, 4).map((t, i) => (
              <div key={t.name} className="relative grid gap-4 md:grid-cols-2 md:items-center md:gap-16 md:py-8">
                <div
                  className="absolute left-1/2 top-1/2 hidden h-3 w-3 rounded-full md:block"
                  style={{ background: "var(--qpi-blue)", transform: "translate(-50%, -50%)", zIndex: 5 }}
                />
                {i % 2 === 0 ? (
                  <>
                    <div className="md:text-right">
                      <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>{t.short}</p>
                      <p className="qpi-caps mt-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                        {t.name}
                      </p>
                    </div>
                    <div />
                  </>
                ) : (
                  <>
                    <div />
                    <div>
                      <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6, opacity: 0.85 }}>{t.short}</p>
                      <p className="qpi-caps mt-3" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                        {t.name}
                      </p>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 7 · A ticker row of short quotes bleeding off both the left AND right edges
  {
    name: "Double-Bleed Ticker",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker} &nbsp;&middot;&nbsp; 5.0 on Google
        </p>
        <div
          className="relative w-full overflow-hidden"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}
        >
          <div className="flex gap-14" style={{ marginLeft: "-6%", width: "112%" }}>
            {TESTIMONIALS.map((t) => (
              <p
                key={t.name}
                className="whitespace-nowrap"
                style={{ color: "var(--qpi-ink)", fontWeight: 600, fontSize: "clamp(1.125rem, 2.2vw, 1.625rem)", flexShrink: 0 }}
              >
                &ldquo;{t.short}&rdquo;
                <span className="qpi-caps ml-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                  {t.name}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · A dense wall of ★★★★★ repeated as a background motif behind one centred quote
  {
    name: "Five-Star Wall Rhythm",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex flex-wrap content-center justify-center gap-x-8 gap-y-6 select-none"
          style={{ opacity: 0.07, zIndex: 0, padding: "0 4%", overflow: "hidden" }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <span key={i} style={{ color: "var(--qpi-blue)", fontSize: 22, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
              ★★★★★
            </span>
          ))}
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[820px] text-center">
          <p style={{ color: "var(--qpi-blue)", fontSize: 20, letterSpacing: "0.14em" }} aria-label="5 out of 5 stars">
            ★★★★★
          </p>
          <p className="qpi-caps mt-4 mb-8" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            5.0 on Google &nbsp;&middot;&nbsp; {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.75rem, 3.6vw, 2.75rem)", lineHeight: 1.2 }}
          >
            &ldquo;{TESTIMONIALS[5].short}&rdquo;
          </p>
          <p className="qpi-caps mt-8" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {TESTIMONIALS[5].name}
          </p>
        </div>
      </section>
    ),
  },

  // 9 · An arch-masked portrait photo beside a single quote, echoing the hero's arch mask
  {
    name: "Arch Window Portrait",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-12 md:grid-cols-[280px_1fr] md:items-center">
          <div
            className="relative mx-auto w-full overflow-hidden md:mx-0"
            style={{ maxWidth: 280, aspectRatio: "3 / 4", borderRadius: "9999px 9999px 0 0" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[5]}
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
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 2rem)", lineHeight: 1.45, fontWeight: 600 }}
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

  // 10 · Quotes clipped into hexagon panels via clip-path, ink ground with aqua names
  {
    name: "Clipped Hex Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto grid w-full max-w-[1100px] gap-8 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div
              key={t.name}
              className="flex flex-col justify-center gap-4 p-10 text-center"
              style={{
                background: "var(--qpi-ink)",
                clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                aspectRatio: "1 / 1.05",
              }}
            >
              <p style={{ color: "#fff", opacity: 0.92, fontSize: 13, lineHeight: 1.55 }}>{t.short}</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 10 }}>
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · A rotated navy band cutting diagonally across the white ground, one quote inside it
  {
    name: "Diagonal Quote Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="absolute inset-0" style={{ overflow: "hidden" }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute select-none"
            style={{
              left: "-10%",
              right: "-10%",
              top: "50%",
              height: 190,
              background: "var(--qpi-ink)",
              transform: "translateY(-50%) rotate(-4deg)",
              zIndex: 0,
            }}
          />
          <div
            className="qpi-gutter mx-auto flex w-full max-w-[1100px] flex-col items-center gap-3 text-center"
            style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) rotate(-4deg)", zIndex: 10 }}
          >
            <p className="qpi-caps mb-2" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker} &nbsp;&middot;&nbsp; 5.0 on Google
            </p>
            <p
              className="text-balance"
              style={{ color: "#fff", fontWeight: 700, fontSize: "clamp(1.5rem, 3.2vw, 2.5rem)", lineHeight: 1.2 }}
            >
              &ldquo;{TESTIMONIALS[0].short}&rdquo;
            </p>
            <p className="qpi-caps mt-2" style={{ color: "#fff", opacity: 0.7, fontSize: 11 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 12 · A giant typographic "5.0" dominates the layout, quotes reduced to small supporting text
  {
    name: "Giant 5.0 Dominant",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 md:grid-cols-[auto_1fr]">
          <div className="text-center md:text-left">
            <p
              className="qpi-display"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(6rem, 16vw, 13rem)", lineHeight: 0.85, letterSpacing: "-0.03em" }}
            >
              5.0
            </p>
            <p style={{ color: "var(--qpi-blue)", fontSize: 22, letterSpacing: "0.12em", marginTop: 8 }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p className="qpi-caps mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              on Google
            </p>
          </div>
          <div className="flex flex-col gap-6" style={{ borderLeft: "2px solid rgba(25,60,90,0.15)", paddingLeft: 32 }}>
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 13, lineHeight: 1.6 }}>
                &ldquo;{t.short}&rdquo;{" "}
                <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
                  {t.name}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · An asymmetric bento grid mixing one huge quote cell with several tiny cells
  {
    name: "Wild Bento Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid w-full max-w-[1100px] gap-4" style={{ gridTemplateColumns: "repeat(6, 1fr)", gridAutoRows: "70px" }}>
          <div
            className="flex flex-col justify-center p-6"
            style={{ gridColumn: "span 4", gridRow: "span 4", background: "var(--qpi-ink)" }}
          >
            <p style={{ color: "#fff", opacity: 0.92, fontSize: "clamp(1.125rem, 2vw, 1.5rem)", lineHeight: 1.45, fontWeight: 600 }}>
              {TESTIMONIALS[3].quote}
            </p>
            <p className="qpi-caps mt-5" style={{ color: "var(--qpi-aqua)", fontSize: 10 }}>
              {TESTIMONIALS[3].name}
            </p>
          </div>
          <div
            className="flex flex-col items-center justify-center p-4 text-center"
            style={{ gridColumn: "span 2", gridRow: "span 2", background: "var(--qpi-blue)" }}
          >
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 26 }}>5.0</p>
            <p style={{ color: "#fff", fontSize: 11, letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
          </div>
          <div
            className="flex items-center p-4"
            style={{ gridColumn: "span 2", gridRow: "span 2", border: "1px solid rgba(25,60,90,0.18)" }}
          >
            <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 11, lineHeight: 1.5 }}>{TESTIMONIALS[0].short}</p>
          </div>
          <div
            className="flex items-center p-4"
            style={{ gridColumn: "span 3", gridRow: "span 2", border: "1px solid rgba(25,60,90,0.18)" }}
          >
            <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 12, lineHeight: 1.55 }}>{TESTIMONIALS[1].short}</p>
          </div>
          <div
            className="flex items-center p-4"
            style={{ gridColumn: "span 3", gridRow: "span 2", background: "rgba(24,120,166,0.08)" }}
          >
            <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 12, lineHeight: 1.55 }}>{TESTIMONIALS[2].short}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Concentric arch outlines echoing outward behind a single centred quote
  {
    name: "Echoing Arches",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0" aria-hidden="true" style={{ height: 280, overflow: "hidden", zIndex: 0 }}>
          {[560, 440, 320, 200].map((size, i) => (
            <div
              key={size}
              className="absolute"
              style={{
                left: "50%",
                width: size,
                height: size / 2,
                borderRadius: "9999px 9999px 0 0",
                border: "1px solid rgba(24,120,166,0.22)",
                bottom: 0,
                transform: "translateX(-50%)",
                opacity: 1 - i * 0.15,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 mx-auto max-w-[720px] text-center">
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS_INTRO.kicker}
          </p>
          <p
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.35 }}
          >
            &ldquo;{TESTIMONIALS[4].short}&rdquo;
          </p>
          <p className="qpi-caps mt-7" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {TESTIMONIALS[4].name}
          </p>
        </div>
      </section>
    ),
  },

  // 15 · A photo framed like a doorway inside a navy panel, quote overlaid at its foot like a plaque
  {
    name: "Arch Portal Cutout",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full max-w-[820px] p-10 md:p-14" style={{ background: "var(--qpi-ink)" }}>
          <div
            className="relative mx-auto w-full overflow-hidden"
            style={{ maxWidth: 420, aspectRatio: "3 / 4", borderRadius: "9999px 9999px 0 0" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[8]}
              alt="A pool installed by QLD Pool Installs"
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-6 text-center"
              style={{ background: "linear-gradient(to top, rgba(25,60,90,0.9), transparent)" }}
            >
              <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{TESTIMONIALS[1].short}&rdquo;</p>
            </div>
          </div>
          <p className="qpi-caps mt-8 text-center" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>
            {TESTIMONIALS[1].name}
          </p>
        </div>
      </section>
    ),
  },

  // 16 · Six rotated arch-outline "stamps" scattered like a passport page, each holding a short quote
  {
    name: "Passport Stamp Cluster",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="relative mx-auto flex w-full max-w-[1000px] flex-wrap items-center justify-center gap-6">
          {[-8, 5, -3, 9, -6, 3].map((rot, i) => (
            <div
              key={TESTIMONIALS[i].name}
              className="flex flex-col items-center justify-center gap-2 px-6 py-8 text-center"
              style={{
                width: 190,
                minHeight: 190,
                borderRadius: "9999px 9999px 0 0",
                border: `2px solid ${i % 2 === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)"}`,
                transform: `rotate(${rot}deg)`,
              }}
            >
              <p
                style={{ color: i % 2 === 0 ? "var(--qpi-blue)" : "var(--qpi-ink)", fontSize: 10, letterSpacing: "0.08em" }}
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: 11, lineHeight: 1.45 }}>{TESTIMONIALS[i].short}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 17 · A diagonal clip-path divides ink from white, one quote seated in each half
  {
    name: "Diagonal Split Panel",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: "var(--qpi-ink)", clipPath: "polygon(0 0, 42% 0, 58% 100%, 0 100%)", zIndex: 0 }}
        />
        <div className="relative z-10 mx-auto grid w-full max-w-[1100px] gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="qpi-caps mb-5" style={{ color: "var(--qpi-aqua)", fontSize: 11 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: "clamp(1.25rem, 2.2vw, 1.75rem)", lineHeight: 1.45 }}>
              {TESTIMONIALS[0].quote}
            </p>
            <p className="qpi-caps mt-6" style={{ color: "#fff", opacity: 0.7, fontSize: 11 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
          <div className="md:pl-6">
            <p style={{ color: "var(--qpi-ink)", opacity: 0.8, fontSize: "clamp(1rem, 1.6vw, 1.25rem)", lineHeight: 1.6 }}>
              {TESTIMONIALS[5].quote}
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS[5].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Three overlapping circular seals of different sizes, each holding a quote
  {
    name: "Circular Seal Cluster",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-12 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="relative mx-auto flex w-full max-w-[900px] items-center justify-center" style={{ height: 380 }}>
          <div
            className="absolute flex flex-col items-center justify-center gap-2 rounded-full p-8 text-center"
            style={{ width: 300, height: 300, background: "var(--qpi-ink)", zIndex: 5 }}
          >
            <p style={{ color: "var(--qpi-aqua)", fontSize: 12, letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.5 }}>{TESTIMONIALS[0].short}</p>
            <p className="qpi-caps" style={{ color: "#fff", opacity: 0.7, fontSize: 9 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
          <div
            className="absolute flex flex-col items-center justify-center gap-2 rounded-full p-6 text-center"
            style={{ width: 190, height: 190, background: "var(--qpi-blue)", left: "6%", top: "8%", zIndex: 3 }}
          >
            <p style={{ color: "#fff", fontSize: 11, lineHeight: 1.4 }}>{TESTIMONIALS[1].short}</p>
          </div>
          <div
            className="absolute flex flex-col items-center justify-center gap-2 rounded-full border p-6 text-center"
            style={{ width: 170, height: 170, borderColor: "var(--qpi-ink)", right: "4%", bottom: "4%", zIndex: 2 }}
          >
            <p style={{ color: "var(--qpi-ink)", fontSize: 11, lineHeight: 1.4 }}>{TESTIMONIALS[2].short}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Six quotes arranged radially around a central "5.0" rating, like a burst
  {
    name: "Radial Burst",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full max-w-[1000px]" style={{ height: 480 }}>
          <div
            className="absolute left-1/2 top-1/2 flex flex-col items-center gap-3 text-center"
            style={{ transform: "translate(-50%, -50%)", width: 260, zIndex: 10 }}
          >
            <p style={{ color: "var(--qpi-blue)", fontWeight: 700, fontSize: 30 }}>5.0</p>
            <p style={{ color: "var(--qpi-blue)", fontSize: 14, letterSpacing: "0.1em" }} aria-label="5 out of 5 stars">
              ★★★★★
            </p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {TESTIMONIALS_INTRO.kicker}
            </p>
          </div>
          {[
            { angle: -60, r: 210 },
            { angle: -20, r: 230 },
            { angle: 20, r: 210 },
            { angle: 60, r: 230 },
            { angle: 140, r: 220 },
            { angle: 200, r: 220 },
          ].map((p, i) => {
            const rad = (p.angle * Math.PI) / 180;
            const x = Math.cos(rad) * p.r;
            const y = Math.sin(rad) * p.r * 0.55;
            return (
              <div
                key={TESTIMONIALS[i].name}
                className="absolute text-center"
                style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)`, transform: "translate(-50%, -50%)", width: 180 }}
              >
                <p style={{ color: "var(--qpi-ink)", opacity: 0.75, fontSize: 11.5, lineHeight: 1.45 }}>{TESTIMONIALS[i].short}</p>
                <p className="qpi-caps mt-2" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>
                  {TESTIMONIALS[i].name}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 20 · Three tall solid arch-topped columns of varying height, like a colonnade, quote inside each
  {
    name: "Colonnade of Arches",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <p className="qpi-caps mb-10 text-center" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
          {TESTIMONIALS_INTRO.kicker}
        </p>
        <div className="mx-auto flex w-full max-w-[1000px] items-end justify-center gap-4 md:gap-6">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div
              key={t.name}
              className="flex flex-1 flex-col items-center justify-end gap-3 px-5 pb-8 text-center"
              style={{
                height: i === 1 ? 440 : 380,
                background: i === 1 ? "var(--qpi-blue)" : "var(--qpi-ink)",
                borderRadius: "9999px 9999px 0 0",
              }}
            >
              <p style={{ color: "#fff", opacity: 0.92, fontSize: 12.5, lineHeight: 1.55 }}>{t.short}</p>
              <p
                className="qpi-caps"
                style={{ color: i === 1 ? "#fff" : "var(--qpi-aqua)", opacity: i === 1 ? 0.75 : 1, fontSize: 9 }}
              >
                {t.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },
];
