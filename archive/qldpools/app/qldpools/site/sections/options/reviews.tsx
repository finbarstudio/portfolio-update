import { REVIEW_STATS, TESTIMONIALS, type Section } from "../kit";

/**
 * Reviews strip — 20 completely fresh design directions for the Google
 * trust band under the hero. Every previous attempt (the old reviews.tsx /
 * reviews2.tsx, 45 options total) has been retired and none of those
 * layouts are repeated here. Each option is a single, vertically centred
 * 100vh viewport on a white ground: editorial composition, off-grid
 * placement, type-as-architecture and negative space instead of more
 * cards/badges/arches. Server-rendered only: no hooks, no client
 * directive, no event handlers. Colours stay inside white / --qpi-ink /
 * --qpi-blue / --qpi-aqua (dark grounds only). Copy is verbatim from
 * REVIEW_STATS and TESTIMONIALS in ../kit.
 */

function Star({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 2.5l2.9 6.4 6.9.6-5.3 4.7 1.6 6.8L12 17.6l-6.1 3.4 1.6-6.8-5.3-4.7 6.9-.6z" />
    </svg>
  );
}

function StarRow({
  color = "var(--qpi-blue)",
  size = 14,
  gap = 3,
}: {
  color?: string;
  size?: number;
  gap?: number;
}) {
  return (
    <span
      role="img"
      aria-label={`${REVIEW_STATS.rating} out of 5 stars`}
      style={{ display: "inline-flex", gap }}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} color={color} size={size} />
      ))}
    </span>
  );
}

const HAIRLINE = "1px solid color-mix(in srgb, var(--qpi-ink) 14%, white)";

export const optionsReviews: Section[] = [
  // 1 · Narrow margin column holds the rating, one large quote fills the rest
  {
    name: "Margin Note Column",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 md:gap-16 items-center w-full"
          style={{ maxWidth: 900 }}
        >
          <div className="flex md:flex-col items-center md:items-start gap-3">
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2.25rem, 4vw, 3rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow size={13} />
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>{REVIEW_STATS.count}</p>
          </div>
          <div>
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.3, fontWeight: 600 }}
            >
              &ldquo;{TESTIMONIALS[0].short}&rdquo;
            </p>
            <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{TESTIMONIALS[0].name}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 2 · Rating set as a huge stacked figure with a rule beneath it, names + tiny star rows run as an index to the right
  {
    name: "Stacked Fraction",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 md:gap-20 items-center w-full"
          style={{ maxWidth: 980 }}
        >
          <div className="flex flex-col items-start">
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(4rem, 10vw, 7rem)", lineHeight: 0.85 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ height: 1, width: 64, background: "var(--qpi-ink)", opacity: 0.3, margin: "10px 0" }} />
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{REVIEW_STATS.count}</p>
          </div>
          <div className="flex flex-col gap-5">
            {TESTIMONIALS.slice(0, 4).map((t) => (
              <div key={t.name} className="flex items-center justify-between gap-6">
                <span style={{ color: "var(--qpi-ink)", fontSize: "clamp(0.9375rem, 1.4vw, 1.125rem)", fontWeight: 600 }}>
                  {t.name}
                </span>
                <StarRow size={11} />
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Dense numbered index, hanging numerals left, name right, hairline rows
  {
    name: "Reading Order Index",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 760 }}>
          <div className="flex items-baseline justify-between mb-8">
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>Google Reviews</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="flex flex-col">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="flex items-baseline gap-4 py-3" style={i === 0 ? undefined : { borderTop: HAIRLINE }}>
                <span className="tabular-nums" style={{ color: "var(--qpi-blue)", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.5 }}>{t.short}</span>
                <span className="qpi-caps ml-auto" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10, flexShrink: 0 }}>
                  {t.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Three short quotes set on a slightly rotated baseline, rating sits plainly beneath
  {
    name: "Diagonal Baseline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-center gap-14" style={{ maxWidth: 1080 }}>
          <div
            className="flex flex-col md:flex-row items-start md:items-center justify-center gap-8 md:gap-14 w-full"
            style={{ transform: "rotate(-1.5deg)" }}
          >
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.6vw, 1.25rem)", fontWeight: 600, maxWidth: 260 }}>
                &ldquo;{t.short}&rdquo;
              </p>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} &middot; Google Reviews
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Empty left third with a vertical word running along a rule, quotes bled hard right
  {
    name: "Vertical Word, Bled Right",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid grid-cols-[auto_1fr] gap-10 md:gap-20 items-center w-full"
          style={{ maxWidth: 1100 }}
        >
          <div className="hidden md:flex flex-col items-center gap-4" style={{ height: 220 }}>
            <div style={{ width: 1, flex: 1, background: "var(--qpi-ink)", opacity: 0.2 }} />
            <span
              className="qpi-display"
              style={{ writingMode: "vertical-rl", color: "var(--qpi-blue)", fontSize: 13, letterSpacing: "0.2em" }}
            >
              {REVIEW_STATS.word}
            </span>
            <div style={{ width: 1, flex: 1, background: "var(--qpi-ink)", opacity: 0.2 }} />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <StarRow />
              <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
                {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
              {TESTIMONIALS.slice(0, 4).map((t) => (
                <div key={t.name}>
                  <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6 }}>&ldquo;{t.short}&rdquo;</p>
                  <p className="qpi-caps mt-2" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Tall ink monolith holding the rating, one huge quote fills the rest
  {
    name: "Monolith + Single Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-[120px_1fr] gap-0 md:gap-14 items-stretch w-full"
          style={{ maxWidth: 980 }}
        >
          <div
            className="flex md:flex-col items-center justify-center gap-3 px-6 py-8 md:py-0"
            style={{ background: "var(--qpi-ink)", borderRadius: 4 }}
          >
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(1.75rem, 3vw, 2.25rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow color="var(--qpi-aqua)" size={12} />
            <p className="qpi-caps" style={{ color: "#fff", opacity: 0.6, fontSize: 9, textAlign: "center" }}>{REVIEW_STATS.count}</p>
          </div>
          <div className="flex items-center py-8">
            <p
              className="text-balance"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3.2vw, 2.375rem)", lineHeight: 1.28, fontWeight: 600 }}
            >
              &ldquo;{TESTIMONIALS[2].short}&rdquo;
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Three columns whose top rules are staggered at different heights, syncopated rhythm
  {
    name: "Staggered Rule Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 1080 }}>
          <div className="flex items-center gap-3 mb-10 justify-center">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} &middot; {REVIEW_STATS.word}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <div key={t.name} style={{ marginTop: i * 28 }}>
                <div style={{ height: 1, background: "var(--qpi-blue)", opacity: 0.5, marginBottom: 16 }} />
                <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Rating chip floats absolutely, overlapping the top edge of a centred quote
  {
    name: "Overlapping Rating Chip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative flex flex-col items-center text-center" style={{ maxWidth: 620, paddingTop: 36 }}>
          <div
            className="absolute flex items-center gap-2"
            style={{ top: 0, left: "8%", background: "var(--qpi-ink)", color: "#fff", borderRadius: 999, padding: "8px 16px" }}
          >
            <StarRow color="var(--qpi-aqua)" size={11} />
            <span className="qpi-caps" style={{ fontSize: 10 }}>{REVIEW_STATS.rating}</span>
          </div>
          <p
            className="text-balance mt-10"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.375rem, 2.6vw, 1.875rem)", lineHeight: 1.35, fontWeight: 600 }}
          >
            &ldquo;{TESTIMONIALS[4].short}&rdquo;
          </p>
          <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            {TESTIMONIALS[4].name} &middot; {REVIEW_STATS.count}
          </p>
        </div>
      </section>
    ),
  },

  // 9 · Oversized numerals bleed off the left edge of a tight quote ledger
  {
    name: "Bleeding Ledger Numerals",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 820 }}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.name} className="flex items-center gap-2 md:gap-4" style={{ marginBottom: i < 2 ? 4 : 0 }}>
              <span
                className="qpi-display tabular-nums"
                style={{ color: "var(--qpi-blue)", opacity: 0.18, fontSize: "clamp(3rem, 7vw, 5rem)", lineHeight: 1, marginLeft: "-0.06em" }}
              >
                {i + 1}
              </span>
              <div>
                <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(0.9375rem, 1.3vw, 1.0625rem)", lineHeight: 1.5 }}>
                  &ldquo;{t.short}&rdquo;
                </p>
                <p className="qpi-caps mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>{t.name}</p>
              </div>
            </div>
          ))}
          <div className="flex items-center gap-3 mt-8 justify-end">
            <StarRow size={11} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Word "Excellent" cascades into rating then a single quote, decreasing scale
  {
    name: "Cascading Excellent",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col gap-2" style={{ maxWidth: 760 }}>
          <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.75rem, 7vw, 5rem)", lineHeight: 0.95 }}>
            {REVIEW_STATS.word}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 14 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
          <p className="mt-6" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: "0.9375rem", lineHeight: 1.6, maxWidth: 480 }}>
            &ldquo;{TESTIMONIALS[1].short}&rdquo; <span className="qpi-caps" style={{ fontSize: 11 }}>{TESTIMONIALS[1].name}</span>
          </p>
        </div>
      </section>
    ),
  },

  // 11 · Everything right-aligned, huge negative space on the left
  {
    name: "Right-Ledger",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col items-end text-right gap-6" style={{ maxWidth: 1100 }}>
          <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2.5rem, 5vw, 3.75rem)", lineHeight: 1 }}>
            {REVIEW_STATS.rating}
          </p>
          <div className="flex items-center gap-3">
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
              {REVIEW_STATS.count} &middot; Google Reviews
            </span>
            <StarRow size={12} />
          </div>
          <div className="flex flex-col items-end gap-3 mt-4" style={{ maxWidth: 420 }}>
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55 }}>
                &ldquo;{t.short}&rdquo; <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{t.name}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Large rating block left, three compact quotes stacked right
  {
    name: "Quadrant Deck",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center"
          style={{ maxWidth: 940 }}
        >
          <div>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(3.5rem, 8vw, 6rem)", lineHeight: 0.9 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow size={16} />
            <p className="qpi-caps mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>{REVIEW_STATS.count}</p>
          </div>
          <div className="grid grid-cols-1 gap-5">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.5 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-1" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Plain quote rows, each marked by a coloured underline of a different width instead of a card
  {
    name: "Underline Field",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full flex flex-col gap-7" style={{ maxWidth: 720 }}>
          <div className="flex items-center gap-3">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <div key={t.name}>
              <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(0.9375rem, 1.2vw, 1.0625rem)", lineHeight: 1.55 }}>
                &ldquo;{t.short}&rdquo; <span style={{ opacity: 0.5 }}>{t.name}</span>
              </p>
              <div style={{ height: 2, width: `${34 + i * 12}%`, background: "var(--qpi-blue)", marginTop: 8, opacity: 0.7 }} />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · A giant "5.0" floats off-centre, overlapping a thin rule; rating info sits opposite as microtype
  {
    name: "Floating Off-Centre Numeral",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full" style={{ maxWidth: 900, height: 260 }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 1, background: "var(--qpi-ink)", opacity: 0.15 }} />
          <p
            className="qpi-display"
            style={{ position: "absolute", top: "8%", left: "6%", color: "var(--qpi-blue)", fontSize: "clamp(4rem, 11vw, 7.5rem)", lineHeight: 0.85 }}
          >
            {REVIEW_STATS.rating}
          </p>
          <div style={{ position: "absolute", bottom: "10%", right: "4%", textAlign: "right" }}>
            <StarRow />
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.count} &middot; {REVIEW_STATS.word}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Every quote flows as continuous magazine-column body copy, rating breaks in as a small stat line
  {
    name: "Magazine Columns",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 860 }}>
          <div className="flex items-center gap-3 mb-6">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} &middot; {REVIEW_STATS.word}
            </span>
          </div>
          <div style={{ columns: "2 260px", columnGap: 32 }}>
            {TESTIMONIALS.map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 13.5, lineHeight: 1.6, breakInside: "avoid", marginBottom: 16 }}>
                &ldquo;{t.short}&rdquo; <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · One quote set very large and full-width, rating tucked small beneath it
  {
    name: "Overflowing Baseline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto w-full" style={{ maxWidth: 1200 }}>
          <p
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 6vw, 4.5rem)", lineHeight: 1.02, fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            &ldquo;{TESTIMONIALS[5].short}&rdquo;
          </p>
          <div className="flex items-center gap-3 mt-8">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              {TESTIMONIALS[5].name} &middot; {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 17 · A bare 3-column grid of hairline dividers, no card backgrounds; the centre cell holds the rating instead of a quote
  {
    name: "Bare Hairline Grid",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full grid grid-cols-1 md:grid-cols-3"
          style={{ maxWidth: 1000, border: "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)" }}
        >
          {[TESTIMONIALS[0], TESTIMONIALS[1], null, TESTIMONIALS[2], TESTIMONIALS[3], TESTIMONIALS[4]].map((t, i) => (
            <div
              key={t ? t.name : "rating-cell"}
              className="p-6 md:p-8 flex flex-col justify-center"
              style={{
                borderRight: (i + 1) % 3 !== 0 ? "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)" : "none",
                borderBottom: i < 3 ? "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)" : "none",
                minHeight: 120,
              }}
            >
              {t ? (
                <>
                  <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                  <p className="qpi-caps mt-2" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</p>
                </>
              ) : (
                <div className="flex flex-col items-center text-center">
                  <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "2rem", lineHeight: 1 }}>{REVIEW_STATS.rating}</p>
                  <StarRow size={11} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 18 · Rating and stars run down a narrow vertical strip in writing-mode, quotes sit alongside
  {
    name: "Vertical Rating Strip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid grid-cols-[auto_1fr] gap-8 md:gap-14 items-stretch w-full" style={{ maxWidth: 860 }}>
          <div
            className="flex items-center justify-center"
            style={{
              writingMode: "vertical-rl",
              color: "var(--qpi-ink)",
              borderRight: "1px solid color-mix(in srgb, var(--qpi-ink) 18%, white)",
              paddingRight: 20,
            }}
          >
            <span className="qpi-display" style={{ fontSize: "1.5rem" }}>{REVIEW_STATS.rating}</span>
            <span className="qpi-caps ml-4" style={{ fontSize: 10, opacity: 0.5 }}>{REVIEW_STATS.count}</span>
          </div>
          <div className="flex flex-col justify-center gap-6">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-1" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 19 · The word "Excellent" as a pale full-bleed watermark, a precise stat card floats on top
  {
    name: "Watermark Ground",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full flex items-center justify-center" style={{ maxWidth: 1100, height: 260 }}>
          <p
            className="qpi-display absolute inset-0 flex items-center justify-center text-center"
            style={{ color: "var(--qpi-ink)", opacity: 0.06, fontSize: "clamp(4rem, 14vw, 11rem)", lineHeight: 1, whiteSpace: "nowrap" }}
          >
            {REVIEW_STATS.word}
          </p>
          <div className="relative flex flex-col items-center gap-2" style={{ zIndex: 10 }}>
            <StarRow size={16} />
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "2.5rem", lineHeight: 1 }}>{REVIEW_STATS.rating}</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.count} &middot; Google Reviews
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Two outlined rectangles overlap at a corner, layered depth instead of a single card
  {
    name: "Interlocking Frames",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto relative w-full" style={{ maxWidth: 760, minHeight: 260 }}>
          <div
            className="absolute p-7 flex flex-col items-start gap-3"
            style={{ top: 0, left: 0, width: "62%", border: "1px solid color-mix(in srgb, var(--qpi-ink) 30%, white)" }}
          >
            <StarRow />
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "2.25rem", lineHeight: 1 }}>{REVIEW_STATS.rating}</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>{REVIEW_STATS.count}</p>
          </div>
          <div
            className="absolute p-7 flex flex-col justify-center"
            style={{ bottom: 0, right: 0, width: "62%", background: "white", border: "1px solid var(--qpi-blue)" }}
          >
            <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6 }}>&ldquo;{TESTIMONIALS[3].short}&rdquo;</p>
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{TESTIMONIALS[3].name}</p>
          </div>
        </div>
      </section>
    ),
  },
];
