import { REVIEW_STATS, TESTIMONIALS, LOGO_DARK, LOGO_WHITE, type Section } from "../kit";

/**
 * Reviews strip — 25 design options for the trust band that sits directly
 * under the QLD Pool Installs hero. This mirrors their real Google-reviews
 * widget: a rating summary (Excellent · 5.0 · 41 reviews) plus review cards.
 * It is a TRUST STRIP, not the full testimonials section further down the
 * page, so most options stay compact (py-10 to py-20).
 *
 * Server-rendered only: no hooks, no client directive, no event handlers.
 * Colours are limited to white, --qpi-ink (navy), --qpi-blue, and white/black
 * opacity — stars are drawn with a tiny inline SVG rather than borrowing
 * Google's red/yellow/green brand colours. Quotes are verbatim from
 * TESTIMONIALS in ../kit; nothing here is invented copy.
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

function Hairline({ color = "var(--qpi-ink)", opacity = 0.12 }: { color?: string; opacity?: number }) {
  return <div style={{ width: "100%", height: 1, background: color, opacity }} />;
}

export const optionsReviews: Section[] = [
  // 1 · One line: stars + 5.0 + 41 reviews + Google Reviews, hairlines above/below
  {
    name: "Single Line Strip",
    node: (
      <section className="relative w-full bg-white py-10 px-6 md:px-14">
        <div className="mx-auto flex flex-col items-center gap-4" style={{ maxWidth: 620 }}>
          <Hairline />
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12, letterSpacing: "0.1em" }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} &middot; Google Reviews
            </span>
          </div>
          <Hairline />
        </div>
      </section>
    ),
  },

  // 2 · Rating block left (big 5.0), three short quotes right in a row
  {
    name: "Rating Left, Quotes Row",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto flex flex-col md:flex-row items-start md:items-center gap-10" style={{ maxWidth: 1140 }}>
          <div style={{ minWidth: 150, flexShrink: 0 }}>
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 4.5vw, 3.5rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 8 }}>
              <StarRow />
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, marginTop: 8 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
          <div className="hidden md:block" style={{ width: 1, alignSelf: "stretch", background: "var(--qpi-ink)", opacity: 0.12 }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 w-full">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div key={t.name}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 10 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Enormous "5.0" in blue as the anchor, stars + count stacked beside it
  {
    name: "Giant Blue Numeral",
    node: (
      <section className="relative w-full bg-white py-16 px-6 md:px-14">
        <div className="mx-auto flex items-center justify-center gap-8" style={{ maxWidth: 720 }}>
          <p className="qpi-display" style={{ color: "var(--qpi-blue)", fontSize: "clamp(4.5rem, 12vw, 8rem)", lineHeight: 0.85 }}>
            {REVIEW_STATS.rating}
          </p>
          <div className="flex flex-col gap-3">
            <StarRow size={18} />
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12, letterSpacing: "0.08em" }}>
              {REVIEW_STATS.word}
            </p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 13 }}>{REVIEW_STATS.count} on Google</p>
          </div>
        </div>
      </section>
    ),
  },

  // 4 · Three review cards with hairline top rules, rating summary above left
  {
    name: "Hairline Top Cards",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto" style={{ maxWidth: 1140 }}>
          <div className="flex items-center gap-3 mb-10">
            <StarRow />
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(3, 6).map((t) => (
              <div key={t.name} className="pt-5" style={{ borderTop: "1px solid rgba(11,42,74,0.15)" }}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10, marginTop: 14 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 5 · Navy full-bleed compact band, white stars, three short quotes
  {
    name: "Navy Band",
    node: (
      <section className="relative w-full py-12 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <div className="mx-auto flex flex-col items-center text-center gap-6" style={{ maxWidth: 980 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 22, opacity: 0.9 }} />
          <StarRow color="#fff" size={16} />
          <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} on Google
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4 w-full">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <p key={t.name} style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, lineHeight: 1.6 }}>
                &ldquo;{t.short}&rdquo;
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 6 · Static marquee-feel: six short quotes in one row bleeding off the right edge
  {
    name: "Bleeding Row",
    node: (
      <section className="relative w-full bg-white py-12 overflow-hidden">
        <div className="px-6 md:px-14 mb-6 flex items-center gap-3">
          <StarRow />
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
          </p>
        </div>
        <div className="flex items-stretch gap-8 pl-6 md:pl-14" style={{ width: "max-content" }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex-shrink-0"
              style={{ width: 260, paddingRight: 24, borderRight: "1px solid rgba(11,42,74,0.12)" }}
            >
              <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 10 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 7 · Centred: kicker, heading, sub, then a single rating row beneath
  {
    name: "Kicker Heading Rating",
    node: (
      <section className="relative w-full bg-white py-16 px-6 md:px-14">
        <div className="mx-auto text-center" style={{ maxWidth: 640 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 22, margin: "0 auto 24px", opacity: 0.85 }} />
          <p className="qpi-caps mb-4" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {REVIEW_STATS.kicker}
          </p>
          <h2 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.25rem)", lineHeight: 1.15 }}>
            {REVIEW_STATS.heading}
          </h2>
          <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 14, lineHeight: 1.65, marginTop: 16 }}>
            {REVIEW_STATS.sub}
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Split: heading + sub left, rating + stars right, thin rule between
  {
    name: "Split Heading Rating",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
          style={{ maxWidth: 1080 }}
        >
          <div>
            <h2 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.125rem)", lineHeight: 1.15 }}>
              {REVIEW_STATS.heading}
            </h2>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 13, lineHeight: 1.6, marginTop: 12, maxWidth: 420 }}>
              {REVIEW_STATS.sub}
            </p>
          </div>
          <div
            className="flex flex-col items-start md:pl-8"
            style={{ borderLeft: "1px solid rgba(11,42,74,0.15)" }}
          >
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 3.5vw, 2.75rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 10 }}>
              <StarRow />
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, marginTop: 8 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 9 · Compact 6-up grid of short quotes with tiny names, rating pinned top-right
  {
    name: "6-Up Grid, Pinned Rating",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto" style={{ maxWidth: 1140 }}>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12 }}>
              {REVIEW_STATS.heading}
            </p>
            <div className="flex items-center gap-2">
              <StarRow size={12} />
              <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 10 }}>
                {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.5 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9, marginTop: 8 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Rating card (bordered) beside two review cards, equal widths
  {
    name: "Bordered Rating + Two Cards",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6" style={{ maxWidth: 1080 }}>
          <div
            className="p-6 flex flex-col items-center justify-center text-center"
            style={{ border: "1px solid rgba(11,42,74,0.18)" }}
          >
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "2.25rem", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 10 }}>
              <StarRow />
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9, marginTop: 8 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
          {TESTIMONIALS.slice(0, 2).map((t) => (
            <div key={t.name} className="p-6" style={{ border: "1px solid rgba(11,42,74,0.18)" }}>
              <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 12 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 11 · Stars huge and centred, "Excellent" above, "41 reviews" below
  {
    name: "Huge Centred Stars",
    node: (
      <section className="relative w-full bg-white py-16 px-6 md:px-14">
        <div className="mx-auto flex flex-col items-center text-center gap-5" style={{ maxWidth: 500 }}>
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 12, letterSpacing: "0.18em" }}>
            {REVIEW_STATS.word}
          </p>
          <StarRow size={28} gap={6} />
          <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11 }}>
            {REVIEW_STATS.rating} rating &middot; {REVIEW_STATS.count}
          </p>
        </div>
      </section>
    ),
  },

  // 12 · Ledger: each review as a row (stars, short, name), five rows, hairlines
  {
    name: "Review Ledger",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto" style={{ maxWidth: 860 }}>
          <div className="flex items-center justify-between mb-6">
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12 }}>{REVIEW_STATS.heading}</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <Hairline />
          {TESTIMONIALS.slice(0, 5).map((t) => (
            <div key={t.name}>
              <div className="flex items-center justify-between gap-6 py-4 flex-wrap">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <StarRow size={12} />
                  <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.4 }}>&ldquo;{t.short}&rdquo;</p>
                </div>
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, whiteSpace: "nowrap" }}>{t.name}</p>
              </div>
              <Hairline />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 13 · Blue band, white type, rating left, one long quote right
  {
    name: "Blue Band Feature Quote",
    node: (
      <section className="relative w-full py-14 px-6 md:px-14" style={{ background: "var(--qpi-blue)" }}>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 items-center" style={{ maxWidth: 1080 }}>
          <div className="flex flex-col items-start" style={{ minWidth: 140 }}>
            <p className="qpi-display" style={{ color: "#fff", fontSize: "clamp(2.25rem, 4vw, 3rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 10 }}>
              <StarRow color="#fff" />
            </div>
            <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 8 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
          <div>
            <p style={{ color: "#fff", fontSize: "clamp(1rem, 1.6vw, 1.25rem)", lineHeight: 1.6 }}>
              &ldquo;{TESTIMONIALS[4].quote}&rdquo;
            </p>
            <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 16 }}>
              {TESTIMONIALS[4].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 14 · Minimal strip: just "★★★★★ 5.0 on Google · 41 reviews", tiny, centred
  {
    name: "Ultra Minimal",
    node: (
      <section className="relative w-full bg-white py-8 px-6 md:px-14">
        <div className="mx-auto flex items-center justify-center gap-2.5">
          <StarRow size={11} gap={2} />
          <span style={{ color: "var(--qpi-ink)", opacity: 0.65, fontSize: 12 }}>
            {REVIEW_STATS.rating} on Google &middot; {REVIEW_STATS.count}
          </span>
        </div>
      </section>
    ),
  },

  // 15 · Two-up: big rating panel and one featured long quote
  {
    name: "Rating Panel + Featured Quote",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10" style={{ maxWidth: 1080 }}>
          <div
            className="flex flex-col items-center justify-center text-center p-10"
            style={{ background: "rgba(0,0,0,0.02)" }}
          >
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(3rem, 5vw, 4rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 12 }}>
              <StarRow size={18} />
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, marginTop: 10 }}>
              {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="flex flex-col justify-center">
            <p style={{ color: "var(--qpi-ink)", fontSize: "clamp(1rem, 1.6vw, 1.1875rem)", lineHeight: 1.6 }}>
              &ldquo;{TESTIMONIALS[0].quote}&rdquo;
            </p>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, marginTop: 16 }}>
              {TESTIMONIALS[0].name}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 16 · Rating row above a three-column set of short quotes with blue names
  {
    name: "Rating Row Above Quotes",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <div className="flex flex-col items-center text-center mb-10">
            <StarRow size={16} />
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12, marginTop: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[TESTIMONIALS[1], TESTIMONIALS[3], TESTIMONIALS[5]].map((t) => (
              <div key={t.name} className="text-center">
                <p style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.6 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 12 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 17 · Off-white (black-opacity wash) ground, four compact cards, generous padding
  {
    name: "Wash Ground Cards",
    node: (
      <section className="relative w-full py-16 px-6 md:px-14" style={{ background: "rgba(0,0,0,0.02)" }}>
        <div className="mx-auto" style={{ maxWidth: 1080 }}>
          <div className="flex items-center justify-center gap-3 mb-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 20, opacity: 0.85 }} />
            <span style={{ width: 1, height: 16, background: "var(--qpi-ink)", opacity: 0.2 }} />
            <StarRow size={12} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {TESTIMONIALS.slice(0, 4).map((t) => (
              <div key={t.name} className="bg-white p-6">
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9, marginTop: 14 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 18 · Heading centred, rating beneath, three quotes as a hairline-separated row
  {
    name: "Heading, Rating, Hairline Row",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto text-center mb-10">
          <h2 style={{ color: "var(--qpi-ink)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.125rem)" }}>
            {REVIEW_STATS.heading}
          </h2>
          <div className="flex items-center justify-center gap-2.5 mt-4">
            <StarRow size={13} />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 10 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
            </span>
          </div>
        </div>
        <div
          className="mx-auto grid grid-cols-1 md:grid-cols-3"
          style={{ maxWidth: 980, borderTop: "1px solid rgba(11,42,74,0.15)" }}
        >
          {[TESTIMONIALS[0], TESTIMONIALS[2], TESTIMONIALS[4]].map((t, i) => (
            <div
              key={t.name}
              className="py-6 px-6 text-center"
              style={{ borderLeft: i > 0 ? "1px solid rgba(11,42,74,0.12)" : "none" }}
            >
              <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
              <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 12 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 19 · Rating anchored left as a tall column, quotes stacked right
  {
    name: "Tall Column Anchor",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto flex flex-col md:flex-row gap-10" style={{ maxWidth: 980 }}>
          <div
            className="flex flex-col items-start justify-center md:pr-10 flex-shrink-0"
            style={{ borderRight: "1px solid rgba(11,42,74,0.15)", minWidth: 160 }}
          >
            <p className="qpi-display" style={{ color: "var(--qpi-ink)", fontSize: "clamp(2.5rem, 4vw, 3.25rem)", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <div style={{ marginTop: 10 }}>
              <StarRow />
            </div>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10, marginTop: 8 }}>
              {REVIEW_STATS.word}
            </p>
            <p style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 12, marginTop: 4 }}>{REVIEW_STATS.count}</p>
          </div>
          <div className="flex flex-col gap-6 justify-center flex-1">
            {TESTIMONIALS.slice(2, 5).map((t) => (
              <p key={t.name} style={{ color: "var(--qpi-ink)", fontSize: 14, lineHeight: 1.55 }}>
                &ldquo;{t.short}&rdquo;
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginLeft: 10 }}>
                  {t.name}
                </span>
              </p>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 20 · Full-width single row of five short quotes separated by vertical rules
  {
    name: "Five-Up Vertical Rules",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto flex items-center gap-3 mb-8 justify-center">
          <StarRow size={13} />
          <span className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
          </span>
        </div>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-5" style={{ maxWidth: 1200 }}>
          {TESTIMONIALS.slice(0, 5).map((t, i) => (
            <div
              key={t.name}
              className="px-5 py-3 md:py-0 text-center"
              style={{ borderLeft: i > 0 ? "1px solid rgba(11,42,74,0.12)" : "none" }}
            >
              <p style={{ color: "var(--qpi-ink)", fontSize: 12, lineHeight: 1.5 }}>&ldquo;{t.short}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 21 · Bordered outer card holding rating + three quotes inside
  {
    name: "Outer Bordered Card",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div
          className="mx-auto p-8 md:p-10"
          style={{ maxWidth: 1000, border: "1px solid rgba(11,42,74,0.18)" }}
        >
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 13 }}>{REVIEW_STATS.heading}</p>
            <div className="flex items-center gap-2.5">
              <StarRow size={13} />
              <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10 }}>
                {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.slice(2, 5).map((t) => (
              <div key={t.name}>
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.55 }}>&ldquo;{t.short}&rdquo;</p>
                <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginTop: 12 }}>{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 22 · Stars per card, cards in a 2x3 grid, rating summary as the first cell
  {
    name: "2x3 Grid, Rating as Cell",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto grid grid-cols-2 md:grid-cols-3 gap-5" style={{ maxWidth: 1080 }}>
          <div
            className="flex flex-col items-center justify-center text-center p-6"
            style={{ background: "var(--qpi-ink)" }}
          >
            <p className="qpi-display" style={{ color: "#fff", fontSize: "1.75rem", lineHeight: 1 }}>
              {REVIEW_STATS.rating}
            </p>
            <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.65)", fontSize: 9, marginTop: 8 }}>
              {REVIEW_STATS.count}
            </p>
          </div>
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="p-6" style={{ background: "rgba(0,0,0,0.02)" }}>
              <StarRow size={11} />
              <p style={{ color: "var(--qpi-ink)", fontSize: 12, lineHeight: 1.5, marginTop: 10 }}>
                &ldquo;{t.short}&rdquo;
              </p>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9, marginTop: 8 }}>{t.name}</p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 23 · Very tall type: "Excellent" as a huge word, rating small beneath
  {
    name: "Huge Excellent Word",
    node: (
      <section className="relative w-full bg-white py-16 px-6 md:px-14">
        <div className="mx-auto text-center">
          <p
            className="qpi-display"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(3rem, 10vw, 7rem)", lineHeight: 0.9, letterSpacing: "-0.02em" }}
          >
            {REVIEW_STATS.word}
          </p>
          <div className="flex items-center justify-center gap-2.5 mt-6">
            <StarRow />
            <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 11 }}>
              {REVIEW_STATS.rating} &middot; {REVIEW_STATS.count} on Google
            </span>
          </div>
        </div>
      </section>
    ),
  },

  // 24 · Wide ledger with the count and rating right-aligned per row
  {
    name: "Wide Ledger, Rating Right",
    node: (
      <section className="relative w-full bg-white py-14 px-6 md:px-14">
        <div className="mx-auto" style={{ maxWidth: 940 }}>
          <div className="flex items-center justify-between mb-5">
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 12 }}>{REVIEW_STATS.heading}</p>
            <p className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9 }}>
              {REVIEW_STATS.word}
            </p>
          </div>
          <Hairline />
          {TESTIMONIALS.slice(0, 4).map((t) => (
            <div key={t.name}>
              <div className="flex items-center justify-between gap-6 py-4">
                <p style={{ color: "var(--qpi-ink)", fontSize: 13, lineHeight: 1.4, flex: 1 }}>
                  &ldquo;{t.short}&rdquo;
                  <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10, marginLeft: 10 }}>
                    {t.name}
                  </span>
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <StarRow size={11} />
                  <span className="qpi-caps" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 9, whiteSpace: "nowrap" }}>
                    {REVIEW_STATS.rating}
                  </span>
                </div>
              </div>
              <Hairline />
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 25 · Navy inner card on white holding the rating and one short quote
  {
    name: "Navy Inner Card",
    node: (
      <section className="relative w-full bg-white py-16 px-6 md:px-14">
        <div
          className="mx-auto flex flex-col items-center text-center p-10"
          style={{ maxWidth: 560, background: "var(--qpi-ink)" }}
        >
          <StarRow color="#fff" size={16} />
          <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 12 }}>
            {REVIEW_STATS.rating} &middot; {REVIEW_STATS.word} &middot; {REVIEW_STATS.count}
          </p>
          <p style={{ color: "#fff", fontSize: 15, lineHeight: 1.6, marginTop: 24 }}>
            &ldquo;{TESTIMONIALS[2].short}&rdquo;
          </p>
          <p className="qpi-caps" style={{ color: "rgba(255,255,255,0.7)", fontSize: 10, marginTop: 14 }}>
            {TESTIMONIALS[2].name}
          </p>
        </div>
      </section>
    ),
  },
];
