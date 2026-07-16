import { REVIEW_STATS, TESTIMONIALS, type Section } from "../kit";

/**
 * Reviews strip — SECOND, WILDER batch of 20 design options. reviews.tsx
 * already covers the safe rating-left/grid/ledger patterns; this file pushes
 * further: orbiting satellites, wax seals, receipt stacks, gauges, sunbursts,
 * newspaper columns. Every option is a single min-h-svh, vertically centred
 * viewport on a white ground.
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * Stars are drawn with a tiny inline SVG in blue/ink/white — never Google's
 * brand colours. Quotes are verbatim from TESTIMONIALS; nothing is invented.
 */

const ARCH = "9999px 9999px 0 0";
const HAIRLINE = "rgba(0,0,0,0.12)";

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
    <span role="img" aria-label={`${REVIEW_STATS.rating} out of 5 stars`} style={{ display: "inline-flex", gap }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} color={color} size={size} />
      ))}
    </span>
  );
}

export const optionsReviews2: Section[] = [
  // 1 · Orbiting Reviews — a giant 5.0 anchors the centre, short quotes
  // float around it like satellites.
  {
    name: "Orbiting Reviews",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 760, height: "clamp(300px, 44vh, 420px)" }}>
          <div className="absolute left-1/2 top-1/2 flex flex-col items-center text-center" style={{ transform: "translate(-50%, -50%)" }}>
            <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(3.5rem, 8vw, 5.5rem)", lineHeight: 0.9 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow size={16} />
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
          {[
            { top: "2%", left: "0%", w: 200 },
            { top: "6%", right: "0%", w: 190 },
            { bottom: "6%", left: "6%", w: 190 },
            { bottom: "0%", right: "8%", w: 190 },
          ].map((pos, i) => (
            <div
              key={TESTIMONIALS[i].name}
              className="absolute"
              style={{ ...pos, width: pos.w, padding: "10px 14px", border: `1px solid ${HAIRLINE}`, background: "#fff" }}
            >
              <p style={{ color: "var(--qpi-ink)", fontSize: 12, lineHeight: 1.45 }}>&ldquo;{TESTIMONIALS[i].short}&rdquo;</p>
              <p className="qpi-caps mt-1.5" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{TESTIMONIALS[i].name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 2 · Arch Quote Cards — three arch-topped panels each holding one review.
  {
    name: "Arch Quote Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <StarRow />
          <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
          </span>
        </div>
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6" style={{ maxWidth: 1000 }}>
          {TESTIMONIALS.slice(0, 3).map((t) => (
            <div
              key={t.name}
              style={{
                background: "var(--qpi-ink)",
                borderRadius: "9999px 9999px 12px 12px",
                padding: "clamp(28px, 4vw, 40px) 20px 22px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#fff", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
              <p className="qpi-caps mt-3" style={{ color: "rgba(255,255,255,0.65)", fontSize: 9 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 3 · Bleeding Ticker — a static marquee row of quotes bled off both edges.
  {
    name: "Bleeding Ticker",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20 overflow-hidden">
        <div className="flex items-center justify-center gap-3 mb-8">
          <StarRow />
          <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
          </span>
        </div>
        <div
          className="flex items-center gap-10"
          style={{ marginLeft: "calc(-1 * clamp(20px, 4vw, 56px))", marginRight: "calc(-1 * clamp(20px, 4vw, 56px))", paddingLeft: 24 }}
        >
          {TESTIMONIALS.map((t) => (
            <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 16, whiteSpace: "nowrap", flex: "0 0 auto" }}>
              &ldquo;{t.short}&rdquo;{" "}
              <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginLeft: 8 }}>
                {t.name}
              </span>
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Huge Excellent, Fine Print — the word "Excellent" enormous, reviews
  // reduced to a single fine-print caption line.
  {
    name: "Huge Excellent, Fine Print",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center">
          <p
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(3.5rem, 12vw, 8rem)", lineHeight: 0.86, letterSpacing: "-0.02em" }}
          >
            {REVIEW_STATS.word}
          </p>
          <div className="flex items-center justify-center gap-2 mt-6">
            <StarRow size={12} />
            <span style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 12 }}>
              {REVIEW_STATS.rating} rated by {REVIEW_STATS.count} on Google &middot; &ldquo;{TESTIMONIALS[3].short}&rdquo;
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Wax Seal Badge — a circular ink seal with the rating, one quote beside.
  {
    name: "Wax Seal Badge",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex flex-col md:flex-row items-center gap-10" style={{ maxWidth: 900 }}>
          <div
            className="flex flex-col items-center justify-center text-center flex-shrink-0"
            style={{
              width: "clamp(150px, 20vw, 190px)",
              height: "clamp(150px, 20vw, 190px)",
              borderRadius: "50%",
              background: "var(--qpi-ink)",
              border: "3px solid var(--qpi-blue)",
              outline: `1px solid rgba(255,255,255,0.4)`,
              outlineOffset: -8,
            }}
          >
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(1.5rem, 3vw, 2rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow color="#fff" size={11} />
            <p className="qpi-caps mt-1" style={{ color: "rgba(255,255,255,0.6)", fontSize: 8 }}>
              {REVIEW_STATS.word}
            </p>
          </div>
          <div className="text-center md:text-left">
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.0625rem, 1.8vw, 1.25rem)", lineHeight: 1.6 }}>
              &ldquo;{TESTIMONIALS[2].quote}&rdquo;
            </p>
            <p className="qpi-caps mt-4" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{TESTIMONIALS[2].name}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Receipt Stack — quotes as narrow torn-edge slips, gently offset.
  {
    name: "Receipt Stack",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="flex items-center justify-center gap-3 mb-8">
          <StarRow />
          <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.heading}
          </span>
        </div>
        <div className="mx-auto flex justify-center gap-4 flex-wrap" style={{ maxWidth: 1000 }}>
          {TESTIMONIALS.slice(0, 4).map((t, i) => (
            <div
              key={t.name}
              style={{
                width: 190,
                background: "#fff",
                border: `1px solid ${HAIRLINE}`,
                borderBottomStyle: "dashed",
                padding: "16px 14px",
                transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (2 + i)}deg)`,
                boxShadow: "0 8px 18px rgba(25,60,90,0.1)",
              }}
            >
              <StarRow size={10} />
              <p style={{ color: "var(--qpi-ink)", fontSize: 12, lineHeight: 1.5, marginTop: 8 }}>&ldquo;{t.short}&rdquo;</p>
              <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 8 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 7 · Giant Quote, Rating Chip — one enormous quote, the rating tucked in
  // as a small pill.
  {
    name: "Giant Quote, Rating Chip",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center" style={{ maxWidth: 820 }}>
          <p
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.5rem, 3.4vw, 2.5rem)",
              lineHeight: 1.25,
              fontWeight: 600,
            }}
          >
            &ldquo;{TESTIMONIALS[1].quote}&rdquo;
          </p>
          <p className="qpi-caps mt-6" style={{ color: "var(--qpi-blue)", fontSize: 12 }}>{TESTIMONIALS[1].name}</p>
          <div
            className="inline-flex items-center gap-2 mt-6"
            style={{ border: `1px solid ${HAIRLINE}`, borderRadius: 999, padding: "6px 16px" }}
          >
            <StarRow size={11} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 9 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Ink Band, Arch Cards — white arch-topped review cards punched into a
  // full ink band.
  {
    name: "Ink Band, Arch Cards",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto w-full"
          style={{ maxWidth: 1080, background: "var(--qpi-ink)", borderRadius: 20, padding: "clamp(28px, 4vw, 44px) clamp(20px, 3vw, 36px)" }}
        >
          <div className="text-center mb-8">
            <StarRow color="#fff" size={14} />
            <p className="qpi-caps mt-2" style={{ color: "rgba(255,255,255,0.65)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TESTIMONIALS.slice(2, 5).map((t) => (
              <div
                key={t.name}
                style={{
                  background: "#fff",
                  borderRadius: "9999px 9999px 8px 8px",
                  padding: "clamp(24px, 3vw, 32px) 18px 18px",
                  textAlign: "center",
                }}
              >
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-3" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Name Column + Expanded Quote — a rail of names, one expanded quote
  // beside it.
  {
    name: "Name Column + Expanded Quote",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-10" style={{ maxWidth: 980 }}>
          <div className="flex flex-row md:flex-col gap-3 md:gap-2 flex-wrap md:flex-nowrap justify-center md:justify-start">
            {TESTIMONIALS.map((t, i) => (
              <p
                key={t.name}
                className="qpi-caps"
                style={{
                  fontSize: 11,
                  color: i === 2 ? "var(--qpi-blue)" : "var(--qpi-ink)",
                  opacity: i === 2 ? 1 : 0.4,
                  borderLeft: i === 2 ? "2px solid var(--qpi-blue)" : "2px solid transparent",
                  paddingLeft: 10,
                }}
              >
                {t.name}
              </p>
            ))}
          </div>
          <div className="flex flex-col justify-center">
            <StarRow />
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.7vw, 1.1875rem)", lineHeight: 1.6, marginTop: 14 }}>
              &ldquo;{TESTIMONIALS[2].quote}&rdquo;
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Star Rhythm Rule — a full-width row of repeating stars as a
  // decorative rule, stat text set into the middle of it.
  {
    name: "Star Rhythm Rule",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto text-center" style={{ maxWidth: 900 }}>
          <div
            className="flex items-center justify-center flex-wrap"
            style={{ gap: 10, opacity: 0.18 }}
          >
            {Array.from({ length: 13 }).map((_, i) => (
              <Star key={i} color="var(--qpi-blue)" size={16} />
            ))}
          </div>
          <div style={{ marginTop: -14 }}>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12, background: "#fff", display: "inline-block", padding: "0 16px" }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Ring Gauge — a conic-gradient ring reading "full" around the rating.
  {
    name: "Ring Gauge",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto flex flex-col md:flex-row items-center gap-10" style={{ maxWidth: 900 }}>
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: "clamp(160px, 22vw, 210px)",
              height: "clamp(160px, 22vw, 210px)",
              borderRadius: "50%",
              background: "conic-gradient(var(--qpi-blue) 0deg 360deg, rgba(0,0,0,0.08) 360deg)",
              padding: 12,
            }}
          >
            <div
              className="flex flex-col items-center justify-center text-center"
              style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#fff" }}
            >
              <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1 }}>
                {REVIEW_STATS.rating}
              </p>
              <p className="qpi-caps mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9 }}>
                {REVIEW_STATS.count}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.5 }}>
                &ldquo;{t.short}&rdquo;{" "}
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginLeft: 6 }}>{t.name}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 12 · Two-Tone Split Band — a blue rating panel left, white quote list right.
  {
    name: "Two-Tone Split Band",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr]" style={{ maxWidth: 1000, border: `1px solid ${HAIRLINE}` }}>
          <div
            className="flex flex-col items-center justify-center text-center p-8"
            style={{ background: "var(--qpi-blue)" }}
          >
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(2rem, 3.6vw, 2.75rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow color="#fff" size={13} />
            <p className="qpi-caps mt-2" style={{ color: "rgba(255,255,255,0.75)", fontSize: 9 }}>{REVIEW_STATS.count}</p>
          </div>
          <div className="flex flex-col justify-center gap-5 p-8">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.5 }}>
                &ldquo;{t.short}&rdquo;{" "}
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginLeft: 6 }}>{t.name}</span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 13 · Trophy Shelf — reviews sit on staggered horizontal shelves like plaques.
  {
    name: "Trophy Shelf",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
          <StarRow />
          <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
          </p>
        </div>
        <div className="mx-auto flex flex-col gap-6" style={{ maxWidth: 620 }}>
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <div key={t.name} style={{ marginLeft: i * 40, maxWidth: 460 }}>
              <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.5 }}>&ldquo;{t.short}&rdquo;</p>
              <div className="flex items-center gap-2 mt-2">
                <div style={{ width: 24, height: 2, background: "var(--qpi-blue)" }} />
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 9 }}>{t.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 14 · Confetti Quote Scatter — quotes loosely rotated and offset around a
  // central stat.
  {
    name: "Confetti Quote Scatter",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto w-full" style={{ maxWidth: 820, height: "clamp(280px, 40vh, 380px)" }}>
          <div className="absolute left-1/2 top-1/2 text-center" style={{ transform: "translate(-50%, -50%)" }}>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <StarRow size={13} />
          </div>
          {[
            { top: "0%", left: "2%", rot: -6 },
            { top: "4%", right: "0%", rot: 5 },
            { bottom: "2%", left: "10%", rot: 4 },
            { bottom: "0%", right: "8%", rot: -4 },
          ].map((pos, i) => (
            <p
              key={TESTIMONIALS[i].name}
              className="absolute"
              style={{
                ...pos,
                transform: `rotate(${pos.rot}deg)`,
                width: 190,
                color: "var(--qpi-ink)",
                fontSize: 12,
                lineHeight: 1.45,
                background: "#fff",
                padding: "8px 10px",
                boxShadow: "0 6px 16px rgba(25,60,90,0.14)",
              }}
            >
              &ldquo;{TESTIMONIALS[i].short}&rdquo;
            </p>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Review Timeline — a dotted horizontal line with a review pinned at
  // each stop.
  {
    name: "Review Timeline",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-10">
          <StarRow />
          <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>{REVIEW_STATS.heading}</p>
        </div>
        <div className="relative mx-auto" style={{ maxWidth: 1080 }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 6, height: 1, background: HAIRLINE }} />
          <div className="flex justify-between">
            {TESTIMONIALS.slice(0, 4).map((t) => (
              <div key={t.name} className="flex flex-col items-center text-center" style={{ width: "23%" }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--qpi-blue)", marginBottom: 16 }} />
                <p style={{ color: "var(--qpi-ink)", fontSize: 12, lineHeight: 1.5 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 8 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Newspaper Clipping — quotes set in narrow columns with hairline
  // rules, like a press clipping.
  {
    name: "Newspaper Clipping",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="mx-auto" style={{ maxWidth: 980 }}>
          <div className="text-center mb-2" style={{ borderBottom: `2px solid var(--qpi-ink)`, paddingBottom: 14 }}>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>
              {REVIEW_STATS.heading}
            </p>
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {TESTIMONIALS.slice(0, 3).map((t, i) => (
              <div key={t.name} style={{ borderLeft: i > 0 ? `1px solid ${HAIRLINE}` : "none", paddingLeft: i > 0 ? 20 : 0 }}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.6, columnCount: 1 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps mt-3" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9 }}>By {t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Oversized Quotation Mark — a huge glyph behind one featured quote.
  {
    name: "Oversized Quotation Mark",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto text-center" style={{ maxWidth: 700 }}>
          <p
            aria-hidden="true"
            className="qpi-display absolute"
            style={{
              color: "var(--qpi-blue)",
              opacity: 0.12,
              fontSize: "clamp(6rem, 14vw, 11rem)",
              lineHeight: 1,
              top: "-2.6rem",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            &ldquo;
          </p>
          <div className="relative">
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)", lineHeight: 1.4, fontWeight: 600 }}>
              {TESTIMONIALS[4].quote}
            </p>
            <p className="qpi-caps mt-5" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>{TESTIMONIALS[4].name}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <StarRow size={11} />
              <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9 }}>
                {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
              </span>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Boarding Pass Card — one review styled as a ticket, dashed
  // perforation splitting rating from quote.
  {
    name: "Boarding Pass Card",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div
          className="mx-auto flex flex-col md:flex-row"
          style={{ maxWidth: 780, border: `1px solid ${HAIRLINE}`, boxShadow: "0 16px 32px rgba(25,60,90,0.1)" }}
        >
          <div
            className="flex flex-col items-center justify-center text-center p-8 flex-shrink-0"
            style={{ background: "var(--qpi-ink)", width: "100%", maxWidth: 220 }}
          >
            <p className="qpi-display" style={{ color: "#fff", fontSize: "2.25rem", lineHeight: 1 }}>{REVIEW_STATS.rating}</p>
            <StarRow color="#fff" size={11} />
            <p className="qpi-caps mt-2" style={{ color: "rgba(255,255,255,0.6)", fontSize: 8 }}>{REVIEW_STATS.count}</p>
          </div>
          <div
            className="flex flex-col justify-center p-8"
            style={{ borderLeft: `2px dashed ${HAIRLINE}`, flex: 1 }}
          >
            <p style={{ color: "var(--qpi-ink)", fontSize: 15, lineHeight: 1.6 }}>&ldquo;{TESTIMONIALS[5].quote}&rdquo;</p>
            <p className="qpi-caps mt-4" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>{TESTIMONIALS[5].name}</p>
          </div>
        </div>
      </section>
    ),
  },

  // 19 · Star Sunburst — stars radiate from a central rating like a burst.
  {
    name: "Star Sunburst",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="relative mx-auto flex items-center justify-center" style={{ width: "min(70vw, 420px)", height: "clamp(260px, 36vh, 360px)" }}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (360 / 12) * i;
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-120px)` }}
              >
                <Star color="var(--qpi-blue)" size={14} />
              </div>
            );
          })}
          <div className="flex flex-col items-center text-center">
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 4vw, 2.75rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10 }}>
              {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Mosaic Star Chips — a wall of small tiles, each a star rating + name.
  {
    name: "Mosaic Star Chips",
    node: (
      <section className="qpi-gutter relative w-full bg-white min-h-svh flex flex-col justify-center py-16 md:py-20">
        <div className="text-center mb-8">
          <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.5rem, 3vw, 2.125rem)" }}>
            {REVIEW_STATS.heading}
          </p>
        </div>
        <div className="mx-auto grid grid-cols-2 md:grid-cols-3 gap-3" style={{ maxWidth: 900 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} style={{ background: "rgba(0,0,0,0.03)", padding: "14px 16px" }}>
              <StarRow size={10} gap={2} />
              <p className="qpi-caps mt-2" style={{ color: "var(--qpi-ink)", fontSize: 9, opacity: 0.6 }}>{t.name}</p>
            </div>
          ))}
        </div>
        <p className="qpi-caps text-center mt-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
          {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
        </p>
      </section>
    ),
  },
];
