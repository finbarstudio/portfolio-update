/**
 * Braeden homepage CHOOSER — CONTACT, six options.
 *
 * The closing CTA block: six distinct treatments for the bottom-of-home contact
 * section. Each fills ~100svh, uses a different display font + colour shift, all
 * within ~20% of the DNA: light grounds, charcoal #222 ink, brand red #e1251b
 * used sparingly, Montserrat/Quicksand as the system fonts. Imagery leads where
 * photos appear; copy is faithful to Braeden (no invented facts, no em dashes).
 */

import { Tag, Photo, P, BOTTOM_SCRIM } from "./_kit";
import React from "react";

/* ── Shared detail rows used across several options ── */
const DETAILS: { label: string; value: string }[] = [
  { label: "Call", value: "0418 505 117" },
  { label: "Facebook", value: "/braedenconstructions" },
  { label: "Location", value: "Lake McDonald, Noosa Hinterland" },
];

export default function ContactOptions() {
  return (
    <>
      {/* ── 1 · Split invitation ──────────────────────────────────────────────
          50/50 grid. Left pane (off-white): Fraunces invitation, detail rows,
          redlink. Right pane: full-height project photo. No form. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper-2)",
          overflow: "hidden",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={1} label="Split invitation" />

        {/* Left pane */}
        <div
          className="frame"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingBlock: "clamp(80px, 12vw, 160px)",
            background: "var(--paper-2)",
            zIndex: 1,
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "1.4em" } satisfies React.CSSProperties}
          >
            Contact
          </p>

          <h2
            className="ff-fraunces"
            style={{
              fontWeight: 300,
              fontSize: "clamp(32px, 3.4vw, 58px)",
              lineHeight: 1.1,
              letterSpacing: "-0.01em",
              color: "var(--ink)",
              maxWidth: "16ch",
              marginBottom: "1.6em",
            } satisfies React.CSSProperties}
          >
            Let&apos;s talk about your block.
          </h2>

          <hr
            style={{
              height: 1,
              background: "var(--line-2)",
              border: 0,
              marginBottom: "1.8em",
            } satisfies React.CSSProperties}
          />

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.1em",
              marginBottom: "2.2em",
            } satisfies React.CSSProperties}
          >
            {DETAILS.map((d) => (
              <div
                key={d.label}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "0.9em",
                } satisfies React.CSSProperties}
              >
                <span
                  className="eyebrow"
                  style={{
                    color: "var(--ink-soft)",
                    minWidth: "6em",
                    flexShrink: 0,
                  } satisfies React.CSSProperties}
                >
                  {d.label}
                </span>
                <span
                  className="ff-quick"
                  style={{
                    fontSize: "clamp(14px, 1.1vw, 16px)",
                    color: "var(--ink)",
                  } satisfies React.CSSProperties}
                >
                  {d.value}
                </span>
              </div>
            ))}
          </div>

          <a
            href="https://www.facebook.com/braedenconstructions"
            className="redlink"
          >
            Start a conversation <span className="ar">&#8594;</span>
          </a>
        </div>

        {/* Right pane: full-height photo */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
          } satisfies React.CSSProperties}
        >
          <Photo src={`${P}/noosaville.webp`} pos="center" />
        </div>
      </section>

      {/* ── 2 · Centred type-led form ─────────────────────────────────────────
          Pure white. Centred column max 620px, vertically centred. Space Grotesk
          headline, three underline fields, red pill submit, quiet reassurance. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={2} label="Centred type-led form" />

        <div
          className="frame"
          style={{
            width: "100%",
            maxWidth: "620px",
            textAlign: "center",
            paddingBlock: "clamp(80px, 11vw, 140px)",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "1.3em" } satisfies React.CSSProperties}
          >
            Enquire
          </p>

          <h2
            className="ff-grotesk"
            style={{
              fontWeight: 600,
              fontSize: "clamp(26px, 3vw, 46px)",
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              marginBottom: "2.2em",
              maxWidth: "22ch",
              marginInline: "auto",
            } satisfies React.CSSProperties}
          >
            Tell us about the home you have in mind.
          </h2>

          <form
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0",
              textAlign: "left",
              marginBottom: "1.6em",
            } satisfies React.CSSProperties}
          >
            <input
              className="brd-input"
              type="text"
              placeholder="Name"
              style={{ marginBottom: "1.4em" } satisfies React.CSSProperties}
            />
            <input
              className="brd-input"
              type="email"
              placeholder="Email"
              style={{ marginBottom: "1.4em" } satisfies React.CSSProperties}
            />
            <input
              className="brd-input"
              type="text"
              placeholder="A few words about your project"
              style={{ marginBottom: "2em" } satisfies React.CSSProperties}
            />
            <button
              type="button"
              className="brd-btn"
              style={{
                width: "100%",
              } satisfies React.CSSProperties}
            >
              Send enquiry
            </button>
          </form>

          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(13px, 1vw, 15px)",
              color: "var(--ink-soft)",
            } satisfies React.CSSProperties}
          >
            You&apos;ll deal directly with Mick.
          </p>
        </div>
      </section>

      {/* ── 3 · Oversized wordmark CTA ────────────────────────────────────────
          White / #f7f7f7. Centred 100vh. "READY WHEN YOU ARE" eyebrow, oversized
          "LET'S BUILD" Archivo headline, red get-in-touch link, quiet detail row. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper-2)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={3} label="Oversized wordmark CTA" />

        <div
          className="frame"
          style={{
            width: "100%",
            textAlign: "center",
            paddingBlock: "clamp(80px, 10vw, 130px)",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{ marginBottom: "1.5em" } satisfies React.CSSProperties}
          >
            Ready when you are
          </p>

          <h2
            className="ff-archivo"
            style={{
              fontWeight: 900,
              fontSize: "clamp(64px, 11.5vw, 140px)",
              lineHeight: 0.94,
              letterSpacing: "-0.03em",
              color: "var(--ink)",
              textTransform: "uppercase",
              marginBottom: "0.65em",
            } satisfies React.CSSProperties}
          >
            Let&apos;s Build
          </h2>

          <a
            href="https://www.facebook.com/braedenconstructions"
            className="redlink"
            style={{ marginBottom: "clamp(48px, 8vw, 96px)", display: "inline-flex" } satisfies React.CSSProperties}
          >
            Get in touch <span className="ar">&#8594;</span>
          </a>

          {/* Bottom baseline row */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(24px, 3.5vw, 44px)",
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              gap: "clamp(20px, 4vw, 56px)",
            } satisfies React.CSSProperties}
          >
            {["0418 505 117", "Facebook", "Lake McDonald"].map((item) => (
              <span
                key={item}
                className="eyebrow"
                style={{
                  color: "var(--ink-soft)",
                  letterSpacing: "0.18em",
                } satisfies React.CSSProperties}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4 · Accent band ───────────────────────────────────────────────────
          White upper half, full-bleed red band below. Inside band: overline, white
          Poppins headline, white-outline button. Below: slim charcoal detail row. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={4} label="Accent band" />

        {/* Upper white area with a quiet heading teaser */}
        <div
          className="frame"
          style={{
            flex: 1,
            display: "grid",
            placeItems: "center",
            paddingBlock: "clamp(60px, 8vw, 100px)",
            textAlign: "center",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              color: "var(--ink-soft)",
              fontSize: "clamp(10px, 0.85vw, 11px)",
            } satisfies React.CSSProperties}
          >
            Award-winning custom builder · Noosa · Est. 1996
          </p>
        </div>

        {/* Red band */}
        <div
          style={{
            background: "var(--red)",
            padding: "clamp(52px, 8vw, 96px) var(--gutter)",
            textAlign: "center",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.72)",
              marginBottom: "1em",
            } satisfies React.CSSProperties}
          >
            Start your build
          </p>

          <h2
            className="ff-poppins"
            style={{
              fontWeight: 700,
              fontSize: "clamp(26px, 3.4vw, 50px)",
              lineHeight: 1.1,
              letterSpacing: "-0.015em",
              color: "#fff",
              maxWidth: "22ch",
              marginInline: "auto",
              marginBottom: "2em",
            } satisfies React.CSSProperties}
          >
            Bring us your block. We&apos;ll bring the rest.
          </h2>

          {/* White outline button on red */}
          <a
            href="tel:0418505117"
            className="brd-btn ghost"
            style={{
              color: "#fff",
              borderColor: "#fff",
            } satisfies React.CSSProperties}
          >
            Talk to Mick
          </a>
        </div>

        {/* Slim detail row below band */}
        <div
          className="frame"
          style={{
            background: "var(--paper)",
            padding: "clamp(16px, 2.5vw, 28px) var(--gutter)",
            display: "flex",
            justifyContent: "center",
            gap: "clamp(20px, 4vw, 56px)",
          } satisfies React.CSSProperties}
        >
          {["0418 505 117", "Facebook · /braedenconstructions", "Lake McDonald, Noosa Hinterland"].map((item) => (
            <span
              key={item}
              className="eyebrow"
              style={{
                color: "var(--ink-soft)",
                fontSize: "10px",
                letterSpacing: "0.18em",
              } satisfies React.CSSProperties}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── 5 · Full-bleed overlay ───────────────────────────────────────────
          Full-bleed photo at 100vh with bottom scrim. Bottom-left: Montserrat
          eyebrow, Cormorant headline, white redlink, hairline detail row. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          overflow: "hidden",
          background: "#161618",
          display: "flex",
          flexDirection: "column",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={5} label="Full-bleed overlay" />

        <Photo src={`${P}/modern-thai.webp`} pos="center 42%" />

        {/* Bottom scrim */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: BOTTOM_SCRIM,
          } satisfies React.CSSProperties}
        />

        {/* Bottom-left content */}
        <div
          className="frame"
          style={{
            position: "relative",
            marginTop: "auto",
            paddingBottom: "clamp(52px, 7vw, 88px)",
            maxWidth: "640px",
          } satisfies React.CSSProperties}
        >
          <p
            className="eyebrow"
            style={{
              color: "rgba(255,255,255,0.75)",
              marginBottom: "1em",
            } satisfies React.CSSProperties}
          >
            Contact
          </p>

          <h2
            className="ff-cormorant"
            style={{
              fontWeight: 400,
              fontSize: "clamp(32px, 4.4vw, 70px)",
              lineHeight: 1.06,
              letterSpacing: "0",
              color: "#fff",
              maxWidth: "18ch",
              marginBottom: "1.4em",
            } satisfies React.CSSProperties}
          >
            Let&apos;s make the most of your block.
          </h2>

          <a
            href="https://www.facebook.com/braedenconstructions"
            className="redlink"
            style={{ color: "#fff" } satisfies React.CSSProperties}
          >
            Get in touch{" "}
            <span
              className="ar"
              style={{ color: "var(--red)" } satisfies React.CSSProperties}
            >
              &#8594;
            </span>
          </a>
        </div>

        {/* Hairline bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            borderTop: "1px solid rgba(255,255,255,0.18)",
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 5vw, 64px)",
            padding: "clamp(12px, 1.6vw, 18px) var(--gutter)",
          } satisfies React.CSSProperties}
        >
          {["0418 505 117", "Facebook", "Lake McDonald"].map((item) => (
            <span
              key={item}
              className="eyebrow"
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "10px",
              } satisfies React.CSSProperties}
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── 6 · Inset card panel ─────────────────────────────────────────────
          Centred rounded card (off-white, 1px border, soft shadow) inset with wide
          margin in a white 100svh. Two columns: left details, right compact form. */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
        } satisfies React.CSSProperties}
      >
        <Tag section="Contact" n={6} label="Inset card panel" />

        <div
          className="frame"
          style={{
            width: "100%",
            paddingBlock: "clamp(60px, 8vw, 100px)",
          } satisfies React.CSSProperties}
        >
          <div
            style={{
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: "12px",
              boxShadow: "0 8px 40px rgba(34,34,34,0.07), 0 2px 8px rgba(34,34,34,0.04)",
              padding: "clamp(36px, 5vw, 72px)",
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              gap: "clamp(28px, 4vw, 64px)",
              maxWidth: "1060px",
              marginInline: "auto",
            } satisfies React.CSSProperties}
          >
            {/* Left: details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              } satisfies React.CSSProperties}
            >
              <p
                className="eyebrow"
                style={{ marginBottom: "1.2em" } satisfies React.CSSProperties}
              >
                Enquire
              </p>

              <h2
                className="ff-poppins"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2.4vw, 36px)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.015em",
                  color: "var(--ink)",
                  maxWidth: "16ch",
                  marginBottom: "1.8em",
                } satisfies React.CSSProperties}
              >
                Start a conversation with Mick.
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1em",
                } satisfies React.CSSProperties}
              >
                {DETAILS.map((d) => (
                  <div
                    key={d.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.2em",
                    } satisfies React.CSSProperties}
                  >
                    <span
                      className="eyebrow"
                      style={{
                        color: "var(--ink-soft)",
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                      } satisfies React.CSSProperties}
                    >
                      {d.label}
                    </span>
                    <span
                      className="ff-quick"
                      style={{
                        fontSize: "clamp(14px, 1.05vw, 15px)",
                        color: "var(--ink)",
                      } satisfies React.CSSProperties}
                    >
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vertical divider */}
            <div
              aria-hidden
              style={{
                background: "var(--line)",
                width: "1px",
                alignSelf: "stretch",
              } satisfies React.CSSProperties}
            />

            {/* Right: compact form */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              } satisfies React.CSSProperties}
            >
              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0",
                } satisfies React.CSSProperties}
              >
                <input
                  className="brd-input"
                  type="text"
                  placeholder="Name"
                  style={{ marginBottom: "1.3em" } satisfies React.CSSProperties}
                />
                <input
                  className="brd-input"
                  type="email"
                  placeholder="Email"
                  style={{ marginBottom: "1.3em" } satisfies React.CSSProperties}
                />
                <input
                  className="brd-input"
                  type="text"
                  placeholder="Message"
                  style={{ marginBottom: "2em" } satisfies React.CSSProperties}
                />
                <button
                  type="button"
                  className="brd-btn"
                  style={{
                    alignSelf: "flex-start",
                  } satisfies React.CSSProperties}
                >
                  Send enquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
