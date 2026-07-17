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
import BadgeLogo from "@/components/qldpools/BadgeLogo";

/**
 * Family F — Brand & Credential Led
 * Logo / badge and trust signals (licences, 2500+ pools, 20+ years, 5.0 Google)
 * are the primary design element. Refined and elegant, not cluttered.
 */
export const familyF: Hero[] = [
  // 1 · Big colour logo centred on white, TAGLINE beneath, hairline ACCOLADE row below
  {
    name: "Logo + Accolade Row",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-between" style={{ paddingTop: "16vh", paddingBottom: "9vh" }}>
        <div className="flex flex-col items-center text-center px-8" style={{ maxWidth: 640 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 52, marginBottom: 40 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.875rem, 4vw, 3.125rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Hairline accolade row */}
        <div
          style={{
            display: "flex",
            width: "100%",
            maxWidth: 740,
            borderTop: "1px solid rgba(11,42,74,0.14)",
            paddingTop: 26,
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
                borderRight: i < ACCOLADES.length - 1 ? "1px solid rgba(11,42,74,0.1)" : "none",
                padding: "0 16px",
              }}
            >
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11, lineHeight: 1.4 }}>
                {a.primary}
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 11, marginTop: 3 }}>
                {a.secondary}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 2 · Oval BadgeLogo centred over dimmed image, TAGLINE under it in white
  {
    name: "Badge on Image",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.62)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <div style={{ filter: "drop-shadow(0 4px 24px rgba(0,0,0,0.35))" }}>
            <BadgeLogo className="h-40 w-auto" />
          </div>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(1.75rem, 3.75vw, 3rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              maxWidth: 620,
              marginTop: 36,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{ color: "#fff", opacity: 0.6, fontSize: 10, marginTop: 20, letterSpacing: "0.18em" }}
          >
            Brisbane · Gold Coast · Sunshine Coast
          </p>
        </div>
      </section>
    ),
  },

  // 3 · Three ACCOLADES as the hero (large), TAGLINE small above them; white ground
  {
    name: "Accolades as Hero",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center" style={{ padding: "0 6vw" }}>
        <p
          className="qpi-caps"
          style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.18em", marginBottom: 52, textAlign: "center" }}
        >
          {TAGLINE}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0,
            width: "100%",
            maxWidth: 960,
          }}
        >
          {ACCOLADES.map((a, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "40px 32px",
                borderRight: i < ACCOLADES.length - 1 ? "1px solid rgba(11,42,74,0.12)" : "none",
              }}
            >
              <p
                style={{
                  color: "var(--qpi-ink)",
                  fontWeight: 700,
                  fontSize: "clamp(2rem, 3.5vw, 3rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.03em",
                }}
              >
                {a.primary}
              </p>
              <p
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10, marginTop: 12, letterSpacing: "0.16em" }}
              >
                {a.secondary}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 4 · Trust row: "★★★★★ 5.0 on Google" large + TAGLINE; licence numbers small below
  {
    name: "Stars + Licences",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8" style={{ gap: 0 }}>
        <div className="text-center" style={{ maxWidth: 680 }}>
          <p
            style={{
              color: "var(--qpi-blue)",
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              letterSpacing: "0.06em",
              lineHeight: 1,
              marginBottom: 10,
            }}
          >
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </p>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-blue)", fontSize: 12, letterSpacing: "0.16em", marginBottom: 32 }}
          >
            5.0 on Google
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
          <div style={{ width: 48, height: 1, background: "rgba(11,42,74,0.18)", margin: "28px auto" }} />
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10, letterSpacing: "0.18em", lineHeight: 1.9 }}
          >
            QBCC Licence #15377435 &nbsp;&middot;&nbsp; NSW Builders Licence #453 712C
          </p>
        </div>
      </section>
    ),
  },

  // 5 · White: LOGO_DARK top-left, three ACCOLADES stacked right, TAGLINE centre
  {
    name: "Logo Left, Stats Right",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white">
        {/* Top-left logo */}
        <div className="absolute" style={{ top: 40, left: 48 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 32 }} />
        </div>
        {/* Centred tagline */}
        <div className="absolute inset-0 flex items-center justify-center px-8">
          <h1
            className="qpi-display text-balance text-center"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              maxWidth: 560,
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Right-side stacked accolades */}
        <div
          className="absolute"
          style={{
            right: 52,
            top: "50%",
            transform: "translateY(-50%)",
            textAlign: "right",
          }}
        >
          {ACCOLADES.map((a, i) => (
            <div key={i} style={{ marginBottom: i < ACCOLADES.length - 1 ? 24 : 0 }}>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11, lineHeight: 1.3 }}>
                {a.primary}
              </p>
              <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 11, marginTop: 2 }}>
                {a.secondary}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 6 · "5.0 on Google" with five blue stars, TAGLINE beneath, over a faint image
  {
    name: "Stars Hero on Wash",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(255,255,255,0.91)" }} />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
          <div style={{ marginBottom: 20 }}>
            <span
              style={{
                color: "var(--qpi-blue)",
                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                letterSpacing: "0.08em",
                lineHeight: 1,
              }}
            >
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </span>
            <p
              className="qpi-caps"
              style={{ color: "var(--qpi-blue)", fontSize: 11, marginTop: 8, letterSpacing: "0.2em" }}
            >
              5.0 on Google
            </p>
          </div>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.55,
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 22,
              lineHeight: 1.65,
              maxWidth: 480,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 7 · Slim banner/ribbon across a dimmed image holding BadgeLogo + TAGLINE
  {
    name: "Badge Ribbon on Image",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.45)" }} />
        {/* Centred ribbon */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center gap-10"
          style={{
            top: "50%",
            transform: "translateY(-50%)",
            background: "rgba(255,255,255,0.96)",
            padding: "32px 52px",
          }}
        >
          <BadgeLogo className="h-24 w-auto flex-shrink-0" />
          <div style={{ width: 1, height: 64, background: "rgba(11,42,74,0.18)", flexShrink: 0 }} />
          <h1
            className="qpi-display"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              maxWidth: 480,
            }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 8 · Three big stat columns: "2500+ / Pools" etc., TAGLINE header above
  {
    name: "Three Stat Columns",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        <h1
          className="qpi-caps text-center"
          style={{ color: "var(--qpi-blue)", fontSize: 12, letterSpacing: "0.18em", marginBottom: 56 }}
        >
          {TAGLINE}
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 0,
            width: "100%",
            maxWidth: 820,
            borderTop: "1px solid rgba(11,42,74,0.14)",
          }}
        >
          {[
            { num: "2500+", label: "Pools" },
            { num: "20+", label: "Years" },
            { num: "5.0", label: "Google" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                textAlign: "center",
                padding: "44px 20px 36px",
                borderRight: i < 2 ? "1px solid rgba(11,42,74,0.1)" : "none",
              }}
            >
              <p
                style={{
                  color: "var(--qpi-ink)",
                  fontWeight: 800,
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.04em",
                }}
              >
                {s.num}
              </p>
              <p
                className="qpi-caps"
                style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10, marginTop: 12, letterSpacing: "0.2em" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 9 · Huge faint LOGO_DARK watermark behind sharp TAGLINE + ACCOLADES
  {
    name: "Logo Watermark",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        {/* Giant watermark logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_DARK}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            height: "55vh",
            width: "auto",
            opacity: 0.055,
            pointerEvents: "none",
            userSelect: "none",
          }}
        />
        {/* Sharp content */}
        <div className="relative text-center" style={{ maxWidth: 660 }}>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
          <div style={{ width: 48, height: 1, background: "var(--qpi-blue)", margin: "32px auto" }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 40 }}>
            {ACCOLADES.map((a, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 10, lineHeight: 1.4 }}>
                  {a.primary}
                </p>
                <p style={{ color: "var(--qpi-ink)", opacity: 0.4, fontSize: 10, marginTop: 3 }}>
                  {a.secondary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 10 · Established seal styling: bordered navy roundel "EST · BRISBANE · QBCC LICENSED" + TAGLINE
  {
    name: "Established Seal",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        {/* Roundel seal */}
        <div
          style={{
            width: 168,
            height: 168,
            borderRadius: "50%",
            border: "2px solid var(--qpi-ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 44,
            padding: "20px",
            textAlign: "center",
            flexShrink: 0,
          }}
        >
          {/* Inner ring */}
          <div
            style={{
              position: "absolute",
              width: 152,
              height: 152,
              borderRadius: "50%",
              border: "1px solid rgba(11,42,74,0.25)",
            }}
          />
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", fontSize: 9, letterSpacing: "0.22em", lineHeight: 1.9, position: "relative" }}
          >
            Est. Brisbane
            <br />
            QBCC Licensed
            <br />
            Since 20+ Years
          </p>
        </div>
        <h1
          className="qpi-display text-balance text-center"
          style={{
            color: "var(--qpi-ink)",
            fontSize: "clamp(1.875rem, 4vw, 3.125rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            maxWidth: 560,
          }}
        >
          {TAGLINE}
        </h1>
        <p
          style={{
            color: "var(--qpi-ink)",
            opacity: 0.5,
            fontSize: "clamp(0.8125rem, 1.4vw, 0.9375rem)",
            marginTop: 20,
            lineHeight: 1.65,
            maxWidth: 420,
            textAlign: "center",
          }}
        >
          {SUB}
        </p>
      </section>
    ),
  },

  // 11 · Over image: LOGO_WHITE top-centre, bottom trust bar with licence numbers
  {
    name: "White Logo + Licence Bar",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0" style={{ background: "rgba(11,42,74,0.52)" }} />
        {/* Logo top-centre */}
        <div className="absolute left-0 right-0 flex justify-center" style={{ top: 44 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 36 }} />
        </div>
        {/* Centred tagline */}
        <div className="absolute inset-0 flex items-center justify-center px-8 text-center">
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Bottom trust bar */}
        <div
          className="absolute left-0 right-0 flex items-center justify-center gap-8"
          style={{
            bottom: 0,
            background: "rgba(11,42,74,0.82)",
            padding: "18px 40px",
          }}
        >
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.65, fontSize: 10, letterSpacing: "0.18em" }}>
            QBCC Licence #15377435
          </p>
          <span style={{ color: "#fff", opacity: 0.3, fontSize: 10 }}>&middot;</span>
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.65, fontSize: 10, letterSpacing: "0.18em" }}>
            NSW Builders Licence #453 712C
          </p>
          <span style={{ color: "#fff", opacity: 0.3, fontSize: 10 }}>&middot;</span>
          <p className="qpi-caps" style={{ color: "#fff", opacity: 0.65, fontSize: 10, letterSpacing: "0.18em" }}>
            Fully Insured
          </p>
        </div>
      </section>
    ),
  },

  // 12 · Split: navy left panel with BadgeLogo on white plinth, right image; TAGLINE on navy
  {
    name: "Split Badge Panel",
    node: (
      <section className="relative h-full w-full overflow-hidden flex">
        {/* Left navy panel */}
        <div
          style={{
            width: "42%",
            flexShrink: 0,
            background: "var(--qpi-ink)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 40px",
            textAlign: "center",
          }}
        >
          {/* White plinth / pill holding the badge */}
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "28px 28px 24px",
              marginBottom: 40,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BadgeLogo className="h-28 w-auto" />
          </div>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(1.375rem, 2.5vw, 2rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{ color: "#fff", opacity: 0.5, fontSize: 10, marginTop: 20, letterSpacing: "0.18em", lineHeight: 1.8 }}
          >
            Brisbane · Gold Coast · Sunshine Coast
          </p>
        </div>
        {/* Right image panel */}
        <div style={{ flex: 1, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={HERO_SRC} alt="Pool at dusk" className="absolute inset-0 h-full w-full object-cover" />
        </div>
      </section>
    ),
  },

  // 13 · Centred TAGLINE with licences line in qpi-caps beneath
  {
    name: "Tagline + Licences",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        <div className="text-center" style={{ maxWidth: 720 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 30, margin: "0 auto 36px" }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
          <div style={{ width: 40, height: 1, background: "rgba(11,42,74,0.2)", margin: "30px auto" }} />
          <p
            className="qpi-caps"
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.38,
              fontSize: 10,
              letterSpacing: "0.2em",
              lineHeight: 1.9,
            }}
          >
            QBCC #15377435 &nbsp;&middot;&nbsp; NSW #453 712C &nbsp;&middot;&nbsp; Fully Insured
          </p>
        </div>
      </section>
    ),
  },

  // 14 · Clean 4-up credential grid (licensed / insured / 2500+ / 20yrs) with tick marks + TAGLINE
  {
    name: "Credential Grid",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        <h1
          className="qpi-display text-balance text-center"
          style={{
            color: "var(--qpi-ink)",
            fontSize: "clamp(1.875rem, 4vw, 3.125rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
            maxWidth: 540,
            marginBottom: 52,
          }}
        >
          {TAGLINE}
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            maxWidth: 640,
            width: "100%",
          }}
        >
          {[
            { check: true, label: "QBCC & NSW Licensed" },
            { check: true, label: "Fully Insured" },
            { check: true, label: "2500+ Pools Installed" },
            { check: true, label: "20+ Years Experience" },
          ].map((c, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "18px 20px",
                border: "1px solid rgba(11,42,74,0.12)",
              }}
            >
              <span
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "var(--qpi-blue)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.8 7L9 1" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <p className="qpi-caps" style={{ color: "var(--qpi-ink)", fontSize: 11, letterSpacing: "0.12em" }}>
                {c.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    ),
  },

  // 15 · Logo + single strong line "2500+ pools across South East Queensland" + TAGLINE
  {
    name: "Strong Claim Line",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        <div className="text-center" style={{ maxWidth: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 38, margin: "0 auto 44px" }} />
          <p
            style={{
              color: "var(--qpi-blue)",
              fontWeight: 700,
              fontSize: "clamp(1.5rem, 3vw, 2.375rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: 24,
            }}
          >
            2500+ pools across South East Queensland
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.625rem, 3.25vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.5,
              fontSize: "clamp(0.8125rem, 1.3vw, 0.9375rem)",
              marginTop: 22,
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "22px auto 0",
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 16 · Testimonial-flavour: five stars + trust phrase from ACCOLADES + TAGLINE (no fake quotes)
  {
    name: "Stars + Trust Phrase",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center px-8">
        <div className="text-center" style={{ maxWidth: 640 }}>
          <p
            style={{
              color: "var(--qpi-blue)",
              fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
              letterSpacing: "0.1em",
              lineHeight: 1,
              marginBottom: 12,
            }}
          >
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </p>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 40 }}
          >
            5.0 on Google
          </p>
          {/* Trust phrase from ACCOLADES — no invented quotes */}
          <p
            style={{
              color: "var(--qpi-ink)",
              fontWeight: 600,
              fontSize: "clamp(1.25rem, 2.5vw, 1.875rem)",
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
              opacity: 0.75,
              marginBottom: 36,
            }}
          >
            {ACCOLADES[1].primary}. {ACCOLADES[2].primary}. {ACCOLADES[0].primary}.
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.875rem, 4vw, 3.25rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 17 · Minimal brand lockup: badge small top-centre, TAGLINE centred, phone + "5.0 on Google" footer row
  {
    name: "Minimal Badge Lockup",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-between" style={{ paddingTop: "14vh", paddingBottom: "10vh" }}>
        {/* Badge top-centre */}
        <BadgeLogo className="h-24 w-auto flex-shrink-0" />
        {/* Centred tagline */}
        <div className="text-center px-8" style={{ maxWidth: 600 }}>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
        {/* Footer row: phone + 5.0 Google */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{ color: "var(--qpi-blue)", fontSize: 11, letterSpacing: "0.16em", textDecoration: "none" }}
          >
            {PHONE}
          </a>
          <span style={{ color: "var(--qpi-ink)", opacity: 0.2, fontSize: 12 }}>&middot;</span>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-ink)", opacity: 0.45, fontSize: 10, letterSpacing: "0.18em" }}
          >
            &#9733;&#9733;&#9733;&#9733;&#9733; 5.0 on Google
          </p>
        </div>
      </section>
    ),
  },
];
