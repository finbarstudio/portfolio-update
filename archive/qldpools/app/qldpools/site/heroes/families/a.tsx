import {
  HERO_SRC,
  LOGO_WHITE,
  LOGO_DARK,
  TAGLINE,
  SUB,
  PHONE,
  PHONE_HREF,
  ACCOLADES,
  type Hero,
} from "../kit";

/**
 * Family A — Minimalist / Editorial White
 * Restraint, whitespace, refined typography.
 * Light grounds or heavily-scrimed photo. Quiet, confident, lots of air.
 */
export const familyA: Hero[] = [
  // 1 · Pure white ground, navy headline centred, one word underlined with thin blue rule
  {
    name: "Centred Underline",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
        <div className="text-center px-8" style={{ maxWidth: 760 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.18em" }}>
            QLD Pool Installs
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            Queensland&apos;s{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              Premium
              <span
                style={{
                  position: "absolute",
                  bottom: -6,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: "var(--qpi-blue)",
                }}
              />
            </span>{" "}
            Pool Builders
          </h1>
        </div>
      </section>
    ),
  },

  // 2 · Image behind 85% white scrim, navy type centred
  {
    name: "Ghost Image",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.87)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8">
          <div className="text-center" style={{ maxWidth: 680 }}>
            <p className="qpi-caps mb-5" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
              Fibreglass &amp; Concrete Specialists
            </p>
            <h1
              className="text-balance"
              style={{
                color: "var(--qpi-ink)",
                fontWeight: 700,
                fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {TAGLINE}
            </h1>
            <p
              style={{
                color: "var(--qpi-ink)",
                opacity: 0.6,
                fontSize: "clamp(0.875rem, 1.5vw, 1.0625rem)",
                marginTop: 28,
                lineHeight: 1.65,
              }}
            >
              {SUB}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 3 · Off-white ground, oversized headline top-left, tiny SUB anchored bottom-left
  {
    name: "Top-Left Anchor",
    node: (
      <section className="relative h-full w-full overflow-hidden" style={{ background: "#f7f6f4" }}>
        <div className="absolute top-16 left-12 right-12" style={{ maxWidth: 820 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 32, marginBottom: 40, opacity: 0.9 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(3rem, 7vw, 6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        <div className="absolute bottom-12 left-12" style={{ maxWidth: 460 }}>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", opacity: 0.5, fontSize: 11, lineHeight: 1.7 }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 4 · Centred: small-caps kicker + headline + 1px hairline divider + SUB
  {
    name: "Kicker + Hairline",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-center px-8" style={{ maxWidth: 640 }}>
          <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 11 }}>
            Queensland&apos;s Premium Pool Builders
          </p>
          <h1
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 700,
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
          <div
            style={{
              width: 64,
              height: 1,
              background: "var(--qpi-ink)",
              opacity: 0.2,
              margin: "28px auto",
            }}
          />
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.55,
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              lineHeight: 1.7,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 5 · Asymmetric: headline in the left third, vast empty space right
  {
    name: "Left Third Asymmetry",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex items-center">
        <div className="pl-12 pr-8" style={{ width: "38%", flexShrink: 0 }}>
          <div
            style={{
              width: 2,
              height: 48,
              background: "var(--qpi-blue)",
              marginBottom: 28,
            }}
          />
          <h1
            className="qpi-display"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.75rem, 3vw, 2.625rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{
              color: "var(--qpi-blue)",
              fontSize: 10,
              marginTop: 24,
              letterSpacing: "0.16em",
            }}
          >
            Brisbane · Gold Coast · Sunshine Coast
          </p>
        </div>
        {/* intentional negative space */}
      </section>
    ),
  },

  // 6 · White top two-thirds with type; thin strip of photo across the bottom
  {
    name: "Photo Strip Bottom",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col">
        <div className="flex flex-col items-center justify-center flex-1 px-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 28, marginBottom: 36 }} />
          <h1
            className="qpi-display text-balance text-center"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Image strip — roughly bottom third */}
        <div style={{ height: "32%", position: "relative", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="h-full w-full object-cover" style={{ display: "block" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 30%)",
            }}
          />
        </div>
      </section>
    ),
  },

  // 7 · All white, logo top-centre, headline in the lower third
  {
    name: "Logo Top, Headline Low",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white">
        <div
          className="absolute left-0 right-0 flex justify-center"
          style={{ top: "18%" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 36 }} />
        </div>
        <div
          className="absolute left-0 right-0 flex flex-col items-center text-center px-8"
          style={{ top: "54%" }}
        >
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              maxWidth: 700,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.5,
              fontSize: "clamp(0.8125rem, 1.3vw, 0.9375rem)",
              marginTop: 20,
              maxWidth: 420,
              lineHeight: 1.65,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 8 · Headline only, no SUB, one tiny ACCOLADE line beneath in qpi-caps
  {
    name: "Headline + One Stat",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
        <div className="text-center px-8" style={{ maxWidth: 720 }}>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{
              color: "var(--qpi-blue)",
              fontSize: 11,
              marginTop: 36,
              letterSpacing: "0.18em",
            }}
          >
            {ACCOLADES[1].primary} &nbsp;·&nbsp; {ACCOLADES[2].primary}
          </p>
        </div>
      </section>
    ),
  },

  // 9 · Generous vertical rhythm, centred, small blue dot accent after headline
  {
    name: "Blue Dot Accent",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex items-center justify-center">
        <div className="text-center px-8" style={{ maxWidth: 680 }}>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", opacity: 0.35, fontSize: 10, marginBottom: 52, letterSpacing: "0.2em" }}
          >
            Est. in Queensland
          </p>
          <h1
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              display: "inline",
            }}
          >
            {TAGLINE}
          </h1>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "var(--qpi-blue)",
              marginLeft: 10,
              verticalAlign: "middle",
              flexShrink: 0,
            }}
          />
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.5,
              fontSize: "clamp(0.875rem, 1.5vw, 1rem)",
              marginTop: 40,
              lineHeight: 1.7,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 10 · Thin 1px navy border box holding centred copy, over a very faint image
  {
    name: "Float Box on Wash",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.93)" }} />
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <div
            className="text-center px-12 py-12"
            style={{
              border: "1px solid var(--qpi-ink)",
              maxWidth: 600,
              width: "100%",
            }}
          >
            <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
              QLD Pool Installs
            </p>
            <h1
              className="text-balance"
              style={{
                color: "var(--qpi-ink)",
                fontWeight: 700,
                fontSize: "clamp(1.75rem, 3.5vw, 2.875rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              {TAGLINE}
            </h1>
            <div
              style={{
                width: 40,
                height: 1,
                background: "var(--qpi-blue)",
                margin: "24px auto",
              }}
            />
            <p
              style={{
                color: "var(--qpi-ink)",
                opacity: 0.55,
                fontSize: "clamp(0.8125rem, 1.4vw, 0.9375rem)",
                lineHeight: 1.65,
              }}
            >
              {SUB}
            </p>
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Image with soft white gradient bottom→top so text sits on near-white at base
  {
    name: "Gradient Lift",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        {/* White gradient climbing from bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0.97) 25%, rgba(255,255,255,0.6) 55%, rgba(255,255,255,0) 80%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 26, marginBottom: 20 }} />
          <h1
            className="qpi-display"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.6,
              fontSize: "clamp(0.8125rem, 1.4vw, 0.9375rem)",
              marginTop: 16,
              maxWidth: 520,
              lineHeight: 1.6,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 12 · Ultra-minimal: just the headline and phone number, huge margins
  {
    name: "Headline + Phone Only",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-between" style={{ padding: "12vh 10vw" }}>
        <div />
        <h1
          className="qpi-display"
          style={{
            color: "var(--qpi-ink)",
            fontSize: "clamp(2.25rem, 5vw, 4rem)",
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            maxWidth: 760,
          }}
        >
          {TAGLINE}
        </h1>
        <a
          href={PHONE_HREF}
          className="qpi-caps"
          style={{
            color: "var(--qpi-blue)",
            fontSize: 13,
            letterSpacing: "0.14em",
            textDecoration: "none",
          }}
        >
          {PHONE}
        </a>
      </section>
    ),
  },

  // 13 · Two-line headline with large numeral "2500+" set small beside it as a quiet stat
  {
    name: "Inline Numeral Stat",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex items-center">
        <div className="px-12" style={{ maxWidth: 900 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 32 }}>
            <h1
              className="qpi-display"
              style={{
                color: "var(--qpi-ink)",
                fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
                flex: 1,
              }}
            >
              Queensland&apos;s<br />Premium Pool<br />Builders
            </h1>
            <div style={{ paddingTop: 8, flexShrink: 0, textAlign: "right" }}>
              <p
                style={{
                  color: "var(--qpi-blue)",
                  fontWeight: 700,
                  fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
                  lineHeight: 1.0,
                }}
              >
                2500+
              </p>
              <p
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 9, marginTop: 4, letterSpacing: "0.16em" }}
              >
                Pools Installed
              </p>
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: 1,
              background: "var(--qpi-ink)",
              opacity: 0.12,
              marginTop: 32,
            }}
          />
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.5,
              fontSize: "clamp(0.8125rem, 1.4vw, 0.9375rem)",
              marginTop: 20,
              maxWidth: 520,
              lineHeight: 1.65,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 14 · Left-aligned stacked headline with tight leading, SUB as narrow measure column
  {
    name: "Tight Stack + Column",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex items-center">
        <div className="px-12 w-full" style={{ maxWidth: 1100 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6vw", alignItems: "end" }}>
            <div>
              <p className="qpi-caps mb-6" style={{ color: "var(--qpi-blue)", fontSize: 10 }}>
                Premium Pool Builders
              </p>
              <h1
                className="qpi-display"
                style={{
                  color: "var(--qpi-ink)",
                  fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                }}
              >
                Queensland&apos;s<br />Premium<br />Pool Builders
              </h1>
            </div>
            <div style={{ paddingBottom: 6 }}>
              <div
                style={{
                  width: 1,
                  height: 40,
                  background: "var(--qpi-blue)",
                  marginBottom: 20,
                }}
              />
              <p
                style={{
                  color: "var(--qpi-ink)",
                  opacity: 0.6,
                  fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
                  lineHeight: 1.7,
                  maxWidth: 340,
                }}
              >
                {SUB}
              </p>
            </div>
          </div>
        </div>
      </section>
    ),
  },

  // 15 · Centred with three ACCOLADES as a single hairline-separated row far below
  {
    name: "Centred + Accolades Row",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-between" style={{ paddingTop: "22vh", paddingBottom: "10vh" }}>
        <div className="text-center px-8" style={{ maxWidth: 660 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 28, margin: "0 auto 40px" }} />
          <h1
            className="text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Accolades row */}
        <div
          style={{
            display: "flex",
            gap: 0,
            width: "100%",
            maxWidth: 720,
            borderTop: "1px solid rgba(11,42,74,0.15)",
            paddingTop: 28,
            paddingLeft: 12,
            paddingRight: 12,
          }}
        >
          {ACCOLADES.map((a, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                textAlign: "center",
                borderRight: i < ACCOLADES.length - 1 ? "1px solid rgba(11,42,74,0.12)" : "none",
                padding: "0 16px",
              }}
            >
              <p
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", fontSize: 11, lineHeight: 1.3 }}
              >
                {a.primary}
              </p>
              <p
                style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 11, marginTop: 4 }}
              >
                {a.secondary}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 16 · White ground, navy headline, SUB set very small and wide-tracked (qpi-caps)
  {
    name: "Wide-Track Sub",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
        <div className="text-center px-8" style={{ maxWidth: 720 }}>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.4,
              fontSize: 10,
              letterSpacing: "0.22em",
              marginTop: 32,
              lineHeight: 1.8,
              maxWidth: 640,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 17 · Editorial: "01 / Introduction" index label top, headline mid, SUB bottom
  {
    name: "Editorial Index",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col justify-between" style={{ padding: "10vh 10vw" }}>
        {/* Top index label */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em" }}
          >
            01 / Introduction
          </p>
          <div style={{ flex: 1, height: 1, background: "var(--qpi-blue)", opacity: 0.25 }} />
        </div>
        {/* Mid headline */}
        <div>
          <h1
            className="qpi-display"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              maxWidth: 780,
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Bottom row: SUB left, phone right */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40 }}>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.55,
              fontSize: "clamp(0.8125rem, 1.3vw, 0.9375rem)",
              lineHeight: 1.65,
              maxWidth: 420,
            }}
          >
            {SUB}
          </p>
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{
              color: "var(--qpi-blue)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },
];
