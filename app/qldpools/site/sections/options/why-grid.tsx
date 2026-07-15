import { WHY_INTRO, REASONS, PROCESS, GALLERY_IMGS, LICENCES, type Section } from "../kit";

/**
 * "Why Choose Us" — targeted follow-up set (10 options).
 * Client feedback on the first 25-option pass: liked the BIG TEXT of
 * option 3 ("Stat Led") and the ICONS of option 7 ("Tick Checklist"), but
 * wants less scroll and more horizontal grid sections. Every entry here is
 * built to sit in a single wide band (~60-85vh), keep an oversized
 * typographic moment, and carry hand-drawn inline-SVG line icons per
 * reason (stroke 1.5, currentColor, ~24px, no icon libraries).
 */

/* ── Inline icon set (stroke-based, 1.5px, currentColor, 24px) ──────────── */
/* Order matches REASONS: licensed, 2,500+ pools, fixed price, council, warranty */

function IconShield() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l9 4.5-9 4.5-9-4.5L12 3z" />
      <path d="M3 12l9 4.5 9-4.5" />
      <path d="M3 16.5l9 4.5 9-4.5" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 12.5L12.5 20a1.5 1.5 0 01-2.12 0L4 13.62V4h9.62l6.38 6.38a1.5 1.5 0 010 2.12z" />
      <circle cx="8.5" cy="8.5" r="1.5" />
    </svg>
  );
}

function IconDocument() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 3h8l4 4v14H6V3z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h6" />
    </svg>
  );
}

function IconSeal() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14.5L7.5 21l4.5-2.5 4.5 2.5-1.5-6.5" />
    </svg>
  );
}

const ICONS = [IconShield, IconLayers, IconTag, IconDocument, IconSeal];

export const optionsWhyGrid: Section[] = [
  // 1 · Five equal columns across one wide band; heading pinned left
  {
    name: "Five Column Band",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-md">
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-3"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 4vw, 3.25rem)", lineHeight: 1.05, fontWeight: 700, letterSpacing: "-0.01em" }}
            >
              {WHY_INTRO.heading}
            </h2>
          </div>
          <p className="max-w-xs" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13.5, lineHeight: 1.55 }}>
            {WHY_INTRO.sub}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-5" style={{ borderTop: "1px solid rgba(30,63,74,0.15)", paddingTop: 28 }}>
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return (
              <div key={r.title}>
                <div style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <h3 className="mt-3" style={{ color: "var(--qpi-ink)", fontSize: 14.5, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h3>
                <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 12, lineHeight: 1.5 }}>
                  {r.body}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 2 · Heading + big number left third, 5-up icon grid right
  {
    name: "Left Anchor Right Grid",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.7fr] gap-10 md:gap-14 items-center">
          <div>
            <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
              {WHY_INTRO.kicker}
            </p>
            <h2
              className="text-balance mt-3"
              style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.08, fontWeight: 700 }}
            >
              {WHY_INTRO.heading}
            </h2>
            <div className="qpi-display leading-none mt-6" style={{ color: "var(--qpi-blue)", fontSize: "clamp(3.5rem, 7vw, 5.5rem)" }}>
              2,500+
            </div>
            <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13, lineHeight: 1.5 }}>
              Pools installed across SEQ &amp; Northern NSW
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {REASONS.map((r, i) => {
              const Icon = ICONS[i] ?? IconShield;
              return (
                <div key={r.title} className="flex flex-col gap-2">
                  <div style={{ color: "var(--qpi-blue)" }}>
                    <Icon />
                  </div>
                  <h3 style={{ color: "var(--qpi-ink)", fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),
  },

  // 3 · One wide row of 5 icon cards with vertical hairline dividers
  {
    name: "Hairline Divided Row",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="max-w-2xl mx-auto text-center mb-10 md:mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.1, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div
          className="grid grid-cols-1 md:grid-cols-5"
          style={{ border: "1px solid rgba(30,63,74,0.15)", borderLeft: "none", borderRight: "none" }}
        >
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return (
              <div
                key={r.title}
                className="px-5 py-6 md:py-8 text-center flex flex-col items-center"
                style={{ borderLeft: i === 0 ? "none" : "1px solid rgba(30,63,74,0.15)" }}
              >
                <div style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <h3 className="mt-3" style={{ color: "var(--qpi-ink)", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 4 · Two-tier horizontal: three big stat columns on top, two-wide split beneath
  {
    name: "Stat Tier Split",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8 md:mb-10">
          <h2
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.1, fontWeight: 700, maxWidth: 500 }}
          >
            {WHY_INTRO.heading}
          </h2>
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {PROCESS.map((p, i) => (
              <span key={p.step} className="flex items-center gap-2 md:gap-3">
                <span className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 10.5, letterSpacing: "0.08em" }}>
                  {p.step} {p.title}
                </span>
                {i < PROCESS.length - 1 ? (
                  <span aria-hidden="true" style={{ color: "var(--qpi-ink)", opacity: 0.3, fontSize: 11 }}>
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-8" style={{ borderTop: "1px solid rgba(30,63,74,0.15)", paddingTop: 24 }}>
          <div>
            <div className="qpi-display leading-none" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)" }}>
              2,500+
            </div>
            <p className="mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13, lineHeight: 1.4 }}>Pools installed</p>
          </div>
          <div>
            <div className="qpi-display leading-none" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)" }}>
              20+
            </div>
            <p className="mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13, lineHeight: 1.4 }}>Years in business</p>
          </div>
          <div>
            <div className="qpi-display leading-none" style={{ color: "var(--qpi-blue)", fontSize: "clamp(2.5rem, 4.6vw, 3.75rem)" }}>
              25yr
            </div>
            <p className="mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 13, lineHeight: 1.4 }}>Shell warranty</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ borderTop: "1px solid rgba(30,63,74,0.15)", paddingTop: 24 }}>
          {[REASONS[2], REASONS[3]].map((r, i) => {
            if (!r) return null;
            const Icon = ICONS[i === 0 ? 2 : 3] ?? IconTag;
            return (
              <div key={r.title} className="flex items-start gap-4">
                <div className="flex-none" style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <div>
                  <h3 style={{ color: "var(--qpi-ink)", fontSize: 15, fontWeight: 700 }}>{r.title}</h3>
                  <p className="mt-1" style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 12.5, lineHeight: 1.5 }}>{r.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 5 · Icons in a row across the top, titles beneath, tight caption bodies
  {
    name: "Icon Row Captions",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.1, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-8 md:mb-0">
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return <div key={`icon-${r.title}`} className="flex md:justify-center" style={{ color: "var(--qpi-blue)" }}><Icon /></div>;
          })}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-3">
          {REASONS.map((r) => (
            <div key={r.title} className="md:text-center">
              <h3 style={{ color: "var(--qpi-ink)", fontSize: 14, fontWeight: 700, lineHeight: 1.3 }}>{r.title}</h3>
              <p className="mt-1.5" style={{ color: "var(--qpi-ink)", opacity: 0.55, fontSize: 11.5, lineHeight: 1.45 }}>
                {r.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · Wide band, big heading left, 3+2 icon grid right, arch-topped wells
  {
    name: "Arch Wells 3+2",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-10 md:gap-14 items-center">
          <h2
            className="text-balance"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(2rem, 4.2vw, 3.5rem)", lineHeight: 1.03, fontWeight: 700, letterSpacing: "-0.01em" }}
          >
            {WHY_INTRO.heading}
          </h2>
          <div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              {REASONS.slice(0, 3).map((r, i) => {
                const Icon = ICONS[i] ?? IconShield;
                return (
                  <div
                    key={r.title}
                    className="p-4 flex flex-col items-center text-center"
                    style={{ background: "rgba(26,126,155,0.06)", borderRadius: "9999px 9999px 12px 12px" }}
                  >
                    <div style={{ color: "var(--qpi-blue)" }}>
                      <Icon />
                    </div>
                    <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>
                      {r.title}
                    </h3>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {REASONS.slice(3, 5).map((r, i) => {
                const Icon = ICONS[i + 3] ?? IconShield;
                return (
                  <div
                    key={r.title}
                    className="p-4 flex flex-col items-center text-center"
                    style={{ background: "rgba(26,126,155,0.06)", borderRadius: "9999px 9999px 12px 12px" }}
                  >
                    <div style={{ color: "var(--qpi-blue)" }}>
                      <Icon />
                    </div>
                    <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: 12.5, fontWeight: 700, lineHeight: 1.3 }}>
                      {r.title}
                    </h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 7 · Horizontal scroll-look: 5 cards in one row bleeding off the right (static)
  {
    name: "Bleeding Row",
    node: (
      <section className="relative w-full py-16 md:py-20 bg-white overflow-hidden">
        <div className="px-6 md:px-14 mb-8 md:mb-10">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.1, fontWeight: 700, maxWidth: 640 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="flex gap-4 px-6 md:px-14" style={{ width: "max-content" }}>
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return (
              <div
                key={r.title}
                className="flex-none p-6"
                style={{ width: 260, background: "rgba(30,63,74,0.03)", border: "1px solid rgba(30,63,74,0.12)" }}
              >
                <div style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <h3 className="mt-4" style={{ color: "var(--qpi-ink)", fontSize: 15, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h3>
                <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.58, fontSize: 12.5, lineHeight: 1.55 }}>
                  {r.body}
                </p>
              </div>
            );
          })}
          <div className="flex-none relative overflow-hidden" style={{ width: 200, borderRadius: "9999px 9999px 8px 8px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GALLERY_IMGS[0]}
              alt="A pool installed by QLD Pool Installs"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="flex-none" style={{ width: 8 }} aria-hidden="true" />
        </div>
      </section>
    ),
  },

  // 8 · Dark ink band, aqua icons, 5 columns, white oversized numbers
  {
    name: "Dark Aqua Band",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14" style={{ background: "var(--qpi-ink)" }}>
        <p className="qpi-caps" style={{ color: "var(--qpi-aqua)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <h2
          className="text-balance mt-3 mb-10 md:mb-14"
          style={{ color: "var(--white)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.1, fontWeight: 700, maxWidth: 720 }}
        >
          {WHY_INTRO.heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return (
              <div key={r.title}>
                <div style={{ color: "var(--qpi-aqua)" }}>
                  <Icon />
                </div>
                <span
                  className="qpi-display block leading-none mt-3"
                  style={{ color: "var(--white)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2" style={{ color: "var(--white)", fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h3>
              </div>
            );
          })}
        </div>
      </section>
    ),
  },

  // 9 · Big "2,500+" huge left anchor, other 4 reasons as a 2x2 icon grid beside it
  {
    name: "Huge Number 2x2",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
          {WHY_INTRO.kicker}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <div className="qpi-display leading-none" style={{ color: "var(--qpi-blue)", fontSize: "clamp(5rem, 11vw, 8.5rem)" }}>
              2,500+
            </div>
            <h3 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.125rem, 1.8vw, 1.5rem)", fontWeight: 700 }}>
              {REASONS[1]?.title}
            </h3>
            <p className="mt-2" style={{ color: "var(--qpi-ink)", opacity: 0.6, fontSize: 14, lineHeight: 1.6, maxWidth: 460 }}>
              {REASONS[1]?.body}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 md:gap-8">
            {[REASONS[0], REASONS[2], REASONS[3], REASONS[4]].map((r, i) => {
              if (!r) return null;
              const iconIdx = [0, 2, 3, 4][i] ?? 0;
              const Icon = ICONS[iconIdx] ?? IconShield;
              return (
                <div key={r.title}>
                  <div style={{ color: "var(--qpi-blue)" }}>
                    <Icon />
                  </div>
                  <h4 className="mt-2" style={{ color: "var(--qpi-ink)", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                    {r.title}
                  </h4>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Compact 5-across, arch-topped outline cells, licences as a fine print row
  {
    name: "Arch Cells + Licence Row",
    node: (
      <section className="relative w-full py-16 md:py-20 px-6 md:px-14 bg-white">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
          <p className="qpi-caps" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em" }}>
            {WHY_INTRO.kicker}
          </p>
          <h2
            className="text-balance mt-3"
            style={{ color: "var(--qpi-ink)", fontSize: "clamp(1.875rem, 3.4vw, 2.75rem)", lineHeight: 1.1, fontWeight: 700 }}
          >
            {WHY_INTRO.heading}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 md:mb-10">
          {REASONS.map((r, i) => {
            const Icon = ICONS[i] ?? IconShield;
            return (
              <div
                key={r.title}
                className="p-5 text-center flex flex-col items-center"
                style={{ border: "1px solid rgba(30,63,74,0.18)", borderRadius: "9999px 9999px 8px 8px" }}
              >
                <div style={{ color: "var(--qpi-blue)" }}>
                  <Icon />
                </div>
                <h3 className="mt-3" style={{ color: "var(--qpi-ink)", fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>
                  {r.title}
                </h3>
              </div>
            );
          })}
        </div>
        <div
          className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 justify-center"
          style={{ borderTop: "1px solid rgba(30,63,74,0.12)", paddingTop: 16 }}
        >
          <p className="qpi-caps text-center" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10.5, letterSpacing: "0.1em" }}>
            {LICENCES.qbcc}
          </p>
          <p className="qpi-caps text-center" style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 10.5, letterSpacing: "0.1em" }}>
            {LICENCES.nsw}
          </p>
        </div>
      </section>
    ),
  },
];
