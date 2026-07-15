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
 * Family E — Image Treatments
 * The photo processing IS the design idea.
 * Each entry applies a distinct filter, blend, mask, or overlay treatment.
 */
export const familyE: Hero[] = [
  // 1 · Blue duotone: grayscale image + blue multiply layer + lighten for highlights
  {
    name: "Blue Duotone",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Base image in grayscale */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(1)" }}
        />
        {/* Blue multiply layer — shadows become blue */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--qpi-blue)",
            mixBlendMode: "multiply",
            opacity: 0.85,
          }}
        />
        {/* Lighten layer — preserve bright sky highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
            mixBlendMode: "lighten",
          }}
        />
        {/* Dark scrim bottom so text pops */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 55%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-14">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 28, marginBottom: 20 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 700,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 14,
              maxWidth: 480,
              lineHeight: 1.65,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 2 · Full grayscale image + bold blue horizontal accent bar behind headline
  {
    name: "Grayscale + Blue Bar",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(1) brightness(0.55)" }}
        />
        {/* Centred blue accent bar behind headline text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div style={{ position: "relative", maxWidth: 800, width: "100%", padding: "0 48px" }}>
            {/* Blue bar spans full width behind headline */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 48,
                right: 48,
                height: 56,
                background: "var(--qpi-blue)",
                transform: "translateY(-50%)",
              }}
            />
            <h1
              className="qpi-display text-balance"
              style={{
                position: "relative",
                color: "#fff",
                fontSize: "clamp(1.875rem, 3.75vw, 3.25rem)",
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
                textAlign: "center",
                padding: "10px 20px",
              }}
            >
              {TAGLINE}
            </h1>
          </div>
          <p
            className="qpi-caps"
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 11,
              marginTop: 32,
              letterSpacing: "0.18em",
              textAlign: "center",
            }}
          >
            Brisbane &nbsp;·&nbsp; Gold Coast &nbsp;·&nbsp; Sunshine Coast
          </p>
        </div>
      </section>
    ),
  },

  // 3 · Navy duotone — deep, moody — white headline centred
  {
    name: "Navy Duotone Moody",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(1) brightness(0.7)" }}
        />
        {/* Navy multiply layer */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--qpi-ink)",
            mixBlendMode: "multiply",
            opacity: 0.9,
          }}
        />
        {/* Subtle blue tint in the highlights */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(17,115,184,0.25) 0%, transparent 70%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: "0.22em", marginBottom: 32 }}
          >
            QLD Pool Installs
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              maxWidth: 720,
            }}
          >
            {TAGLINE}
          </h1>
          <div
            style={{
              width: 48,
              height: 2,
              background: "var(--qpi-blue)",
              margin: "32px auto",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              maxWidth: 460,
              lineHeight: 1.7,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 4 · Heavy dark vignette focusing a bright centred middle + type
  {
    name: "Dark Vignette Spotlight",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(1.1) saturate(1.2)" }}
        />
        {/* Heavy radial vignette — bright centre fades to near-black edges */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.85) 100%)",
          }}
        />
        {/* Top scrim for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 35%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 px-10 pt-10 flex items-center gap-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 24 }} />
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, letterSpacing: "0.14em", textDecoration: "none", marginLeft: "auto" }}
          >
            {PHONE}
          </a>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8" style={{ paddingTop: "10vh" }}>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2.25rem, 5vw, 4.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 700,
              textShadow: "0 2px 24px rgba(0,0,0,0.5)",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 5 · Split-tone: blue gradient over top half fading to clear over the pool below
  {
    name: "Split-Tone Blue Top",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.15)" }}
        />
        {/* Blue gradient overlay — dense top, fades out before reaching the pool */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(11,42,74,0.88) 0%, rgba(11,42,74,0.5) 38%, rgba(11,42,74,0) 65%)",
          }}
        />
        <div className="absolute top-0 left-0 right-0 px-12 pt-14" style={{ maxWidth: 820 }}>
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 22 }}
          >
            Fibreglass &amp; Concrete Specialists
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 20,
              maxWidth: 480,
              lineHeight: 1.65,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 6 · Colour-block: solid navy diagonal corner (clip-path) over untreated image, type on navy
  {
    name: "Navy Diagonal Corner",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "saturate(1.1)" }}
        />
        {/* Navy diagonal block — lower-left triangle fills ~55% of the viewport */}
        <div
          className="absolute inset-0"
          style={{
            background: "var(--qpi-ink)",
            clipPath: "polygon(0 30%, 62% 100%, 0 100%)",
          }}
        />
        {/* Type sits on the navy triangle */}
        <div
          className="absolute"
          style={{
            bottom: "10%",
            left: "5%",
            maxWidth: 420,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 26, marginBottom: 20 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(1.625rem, 3vw, 2.625rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{
              display: "inline-block",
              color: "var(--qpi-blue)",
              fontSize: 11,
              letterSpacing: "0.16em",
              textDecoration: "none",
              marginTop: 16,
              background: "rgba(17,115,184,0.18)",
              padding: "6px 14px",
            }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  // 7 · High-contrast + brightness filter + CSS grain overlay + bold type
  {
    name: "High Contrast + Grain",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "contrast(1.5) brightness(0.65) saturate(0.7)" }}
        />
        {/* Grain layer using SVG feTurbulence via data URI */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.12'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "200px 200px",
            mixBlendMode: "overlay",
            opacity: 0.6,
          }}
        />
        {/* Bottom dark gradient for text */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-14">
          <h1
            className="qpi-display"
            style={{
              color: "#fff",
              fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.025em",
              maxWidth: 760,
            }}
          >
            Queensland&apos;s<br />Premium Pool<br />Builders
          </h1>
          <div style={{ display: "flex", gap: 32, marginTop: 28, alignItems: "center" }}>
            {ACCOLADES.map((a, i) => (
              <div key={i}>
                <p
                  className="qpi-caps"
                  style={{ color: "rgba(255,255,255,0.9)", fontSize: 10, letterSpacing: "0.16em" }}
                >
                  {a.primary}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 8 · Image masked into a large arch shape, centred, on a white ground, type beneath
  {
    name: "Arch Mask on White",
    node: (
      <section className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
        {/* Arch-masked image — tall pill / pointed arch shape */}
        <div
          style={{
            position: "relative",
            width: "clamp(220px, 38vw, 380px)",
            height: "clamp(300px, 52vh, 480px)",
            borderRadius: "9999px 9999px 0 0",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 40%",
              display: "block",
            }}
          />
        </div>
        {/* Type beneath the arch */}
        <div className="text-center px-8" style={{ marginTop: 28, maxWidth: 540 }}>
          <p
            className="qpi-caps"
            style={{ color: "var(--qpi-blue)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 14 }}
          >
            QLD Pool Installs
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.625rem, 3.25vw, 2.625rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 9 · Blurred full background + small sharp framed rectangle inset top-right + type left
  {
    name: "Blur + Sharp Inset",
    node: (
      <section className="relative h-full w-full overflow-hidden" style={{ background: "var(--qpi-ink)" }}>
        {/* Full blurred background */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(18px) brightness(0.35) saturate(0.6)", transform: "scale(1.08)" }}
        />
        {/* Sharp framed inset — top right */}
        <div
          style={{
            position: "absolute",
            top: "8%",
            right: "6%",
            width: "clamp(160px, 28vw, 280px)",
            aspectRatio: "4/3",
            border: "3px solid rgba(255,255,255,0.25)",
            boxShadow: "0 8px 48px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        {/* Type — left aligned, vertically centred */}
        <div
          className="absolute"
          style={{ left: "7%", top: "50%", transform: "translateY(-50%)", maxWidth: 520 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 26, marginBottom: 28, opacity: 0.9 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 20,
              lineHeight: 1.65,
              maxWidth: 400,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 10 · Monochrome navy wash — image at low opacity over solid navy, blue headline
  {
    name: "Navy Wash Monochrome",
    node: (
      <section className="relative h-full w-full overflow-hidden" style={{ background: "var(--qpi-ink)" }}>
        {/* Image at low opacity — creates a textured navy field */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "grayscale(1)", opacity: 0.14, mixBlendMode: "luminosity" }}
        />
        {/* Top to bottom subtle gradient for depth */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(11,42,74,0) 0%, rgba(11,42,74,0.6) 100%)",
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, letterSpacing: "0.24em", marginBottom: 28 }}
          >
            Queensland&apos;s Premium Pool Builders
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-blue)",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              maxWidth: 720,
            }}
          >
            {TAGLINE}
          </h1>
          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 44,
              borderTop: "1px solid rgba(255,255,255,0.12)",
              paddingTop: 28,
            }}
          >
            {ACCOLADES.map((a, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p
                  className="qpi-caps"
                  style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, letterSpacing: "0.12em" }}
                >
                  {a.primary}
                </p>
                <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, marginTop: 4 }}>{a.secondary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    ),
  },

  // 11 · Repeating thin horizontal line overlay (venetian-blind) + type over a clear band
  {
    name: "Venetian Blind",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.75) saturate(0.9)" }}
        />
        {/* Venetian-blind line overlay using repeating-linear-gradient */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.38) 0px, rgba(0,0,0,0.38) 2px, transparent 2px, transparent 12px)",
            backgroundSize: "100% 14px",
          }}
        />
        {/* Clear band in the lower third for type */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: "38%",
            background: "linear-gradient(to top, rgba(11,42,74,0.92) 0%, rgba(11,42,74,0.7) 60%, transparent 100%)",
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-12">
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              letterSpacing: "0.16em",
              marginTop: 16,
            }}
          >
            Brisbane &nbsp;·&nbsp; Gold Coast &nbsp;·&nbsp; Sunshine Coast
          </p>
        </div>
      </section>
    ),
  },

  // 12 · Full colour image with solid white bottom third (hard edge) holding navy type
  {
    name: "White Footer Block",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Full colour image fills top ~65% */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "center 30%" }}
        />
        {/* Hard-edge white block from 65% down */}
        <div
          className="absolute"
          style={{
            bottom: 0,
            left: 0,
            right: 0,
            height: "36%",
            background: "#fff",
          }}
        />
        {/* Gradient to smooth the edge slightly */}
        <div
          className="absolute"
          style={{
            bottom: "36%",
            left: 0,
            right: 0,
            height: 2,
            background: "#fff",
          }}
        />
        {/* Type in the white block */}
        <div
          className="absolute"
          style={{ bottom: 0, left: 0, right: 0, height: "36%", padding: "0 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_DARK} alt="QLD Pool Installs" style={{ height: 24, marginBottom: 14 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 620,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.5,
              fontSize: "clamp(0.8125rem, 1.3vw, 0.9375rem)",
              marginTop: 10,
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 13 · Circular vignette spotlight on pool lights, darkness everywhere else, type top
  {
    name: "Circular Spotlight",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.3)", objectPosition: "center 60%" }}
        />
        {/* Circular spotlight — centred on the pool */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 42% 38% at 50% 62%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 30%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.92) 100%)",
          }}
        />
        {/* Top header area with dark gradient */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        {/* Type at top */}
        <div className="absolute top-0 left-0 right-0 px-12 pt-12" style={{ maxWidth: 700 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 26, marginBottom: 24 }} />
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 4vw, 3.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 580,
              textShadow: "0 1px 16px rgba(0,0,0,0.4)",
            }}
          >
            {TAGLINE}
          </h1>
        </div>
      </section>
    ),
  },

  // 14 · Two-tone: left half grayscale, right half full colour (hard vertical seam), type over seam
  {
    name: "Half Grayscale / Half Colour",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Left half — grayscale */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            style={{ position: "absolute", top: 0, left: 0, width: "200%", height: "100%", objectFit: "cover", filter: "grayscale(1) brightness(0.6)", objectPosition: "0 center" }}
          />
        </div>
        {/* Right half — full colour */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt=""
            style={{ position: "absolute", top: 0, right: 0, width: "200%", height: "100%", objectFit: "cover", filter: "brightness(0.7) saturate(1.2)", objectPosition: "100% center" }}
          />
        </div>
        {/* Dark seam overlay — centred vertical band */}
        <div
          className="absolute"
          style={{
            top: 0,
            bottom: 0,
            left: "calc(50% - 1px)",
            width: 2,
            background: "rgba(255,255,255,0.3)",
          }}
        />
        {/* Bottom scrim for type */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 45%)",
          }}
        />
        {/* Type centred over the seam */}
        <div
          className="absolute bottom-0 left-0 right-0 flex flex-col items-center text-center px-8 pb-12"
        >
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 680,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.18em", marginTop: 16 }}
          >
            {ACCOLADES[0].primary} &nbsp;·&nbsp; {ACCOLADES[1].primary}
          </p>
        </div>
      </section>
    ),
  },

  // 15 · Warm-to-cool: cool blue gradient mapping the shadows, type bottom-left
  {
    name: "Cool Blue Gradient Map",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Base image slightly warm */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(0.8) saturate(0.5)" }}
        />
        {/* Cool blue shadow overlay — screen blend pushes blues into shadow areas */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, rgba(17,115,184,0.55) 0%, rgba(11,42,74,0.7) 60%, rgba(11,42,74,0.4) 100%)",
            mixBlendMode: "multiply",
          }}
        />
        {/* Subtle warm highlight preservation at the sky */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "linear-gradient(to bottom, rgba(255,200,100,0.08) 0%, transparent 100%)",
            mixBlendMode: "screen",
          }}
        />
        {/* Bottom scrim */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)",
          }}
        />
        {/* Type bottom-left */}
        <div className="absolute bottom-0 left-0 right-0 px-12 pb-14" style={{ maxWidth: 760 }}>
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, letterSpacing: "0.2em", marginBottom: 16 }}
          >
            Brisbane &nbsp;·&nbsp; Gold Coast &nbsp;·&nbsp; Sunshine Coast
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "#fff",
              fontSize: "clamp(2.25rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              maxWidth: 660,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 16,
              lineHeight: 1.65,
              maxWidth: 460,
            }}
          >
            {SUB}
          </p>
        </div>
      </section>
    ),
  },

  // 16 · Image inset inside a thick navy border/frame filling most of viewport, headline in frame
  {
    name: "Navy Frame Inset",
    node: (
      <section className="relative h-full w-full overflow-hidden" style={{ background: "var(--qpi-ink)", padding: "clamp(16px, 4vw, 40px)" }}>
        {/* Outer header row inside the frame — logo + accolade */}
        <div
          style={{
            position: "absolute",
            top: "clamp(12px, 3vw, 32px)",
            left: "clamp(16px, 4vw, 40px)",
            right: "clamp(16px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={LOGO_WHITE} alt="QLD Pool Installs" style={{ height: 22 }} />
          <p
            className="qpi-caps"
            style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, letterSpacing: "0.18em" }}
          >
            {ACCOLADES[2].primary}
          </p>
        </div>

        {/* The framed image — inset rectangle */}
        <div
          style={{
            position: "absolute",
            top: "clamp(52px, 10vw, 90px)",
            left: "clamp(16px, 4vw, 40px)",
            right: "clamp(16px, 4vw, 40px)",
            bottom: "clamp(72px, 14vw, 120px)",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={HERO_SRC}
            alt="Pool at dusk"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Subtle darken at base of framed image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(11,42,74,0.4) 0%, rgba(11,42,74,0) 40%)",
            }}
          />
        </div>

        {/* Headline in the navy footer of the frame */}
        <div
          style={{
            position: "absolute",
            bottom: "clamp(16px, 3.5vw, 36px)",
            left: "clamp(16px, 4vw, 40px)",
            right: "clamp(16px, 4vw, 40px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          <h1
            className="qpi-display"
            style={{
              color: "#fff",
              fontSize: "clamp(1.25rem, 2.5vw, 2.125rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              flex: 1,
            }}
          >
            {TAGLINE}
          </h1>
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{
              color: "var(--qpi-blue)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },

  // 17 · Faded/washed image (low contrast, high brightness) — dreamy — with strong navy type
  {
    name: "Dreamy Wash + Navy Type",
    node: (
      <section className="relative h-full w-full overflow-hidden">
        {/* Heavily washed out image — low contrast, pushed bright */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERO_SRC}
          alt="Pool at dusk"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "brightness(1.6) contrast(0.55) saturate(0.4)", opacity: 0.85 }}
        />
        {/* White overlay to further wash — creates a milky, dreamy ground */}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(255,255,255,0.42)" }}
        />
        {/* Gentle vignette to keep edges from looking clipped */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(200,210,220,0.25) 100%)",
          }}
        />
        {/* Type — strong navy for maximum contrast against the washed ground */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
          <p
            className="qpi-caps"
            style={{
              color: "var(--qpi-blue)",
              fontSize: 11,
              letterSpacing: "0.22em",
              marginBottom: 28,
            }}
          >
            QLD Pool Installs
          </p>
          <h1
            className="qpi-display text-balance"
            style={{
              color: "var(--qpi-ink)",
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              maxWidth: 720,
            }}
          >
            {TAGLINE}
          </h1>
          <p
            style={{
              color: "var(--qpi-ink)",
              opacity: 0.6,
              fontSize: "clamp(0.875rem, 1.4vw, 1rem)",
              marginTop: 28,
              maxWidth: 480,
              lineHeight: 1.7,
            }}
          >
            {SUB}
          </p>
          <a
            href={PHONE_HREF}
            className="qpi-caps"
            style={{
              display: "inline-block",
              color: "var(--qpi-blue)",
              fontSize: 12,
              letterSpacing: "0.16em",
              textDecoration: "none",
              marginTop: 32,
              border: "1px solid var(--qpi-blue)",
              padding: "10px 24px",
            }}
          >
            {PHONE}
          </a>
        </div>
      </section>
    ),
  },
];
