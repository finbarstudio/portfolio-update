/**
 * Braeden homepage (final, cohesive) — VOICES / WORD OF MOUTH.
 *
 * Restyled from chooser option 6. Off-white var(--paper-2) band, fixed left
 * heading block, two rows of slow CSS marquee (opposite directions), short
 * client fragments in Montserrat caps, red dot separators. No JS. No serifs.
 * Faithful fragments from real testimonials; microdetails threaded in.
 */

import { Fragment } from "react";

const ROW_1 = [
  "Craftsmen, not just tradesmen",
  "Outstanding results",
  "They made our dream home a reality",
  "Deal direct with Mick the whole way",
  "Service after handover of the highest order",
  "The smoothest project to date",
];

const ROW_2 = [
  "35+ years a qualified carpenter",
  "Built on referral",
  "Most of our work comes by referral",
  "Noosa since 2001",
  "We would build with them again",
  "MBA National Master Builder of the Year",
];

function RedDot({ small }: { small?: boolean }) {
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: small ? 5 : 7,
        height: small ? 5 : 7,
        borderRadius: "50%",
        background: "var(--red)",
        flexShrink: 0,
        opacity: small ? 0.65 : 1,
      } satisfies React.CSSProperties}
    />
  );
}

export default function Voices() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--paper-2)",
        overflow: "hidden",
      } satisfies React.CSSProperties}
    >
      {/* Top hairline */}
      <hr
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--line)",
          border: 0,
          margin: 0,
        } satisfies React.CSSProperties}
      />

      {/* Heading block */}
      <div
        className="frame wrap"
        style={{
          paddingTop: "clamp(64px, 9vw, 128px)",
          paddingBottom: "clamp(36px, 5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(10px, 1.2vw, 16px)",
        } satisfies React.CSSProperties}
      >
        {/* Label */}
        <p
          className="eyebrow"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7em",
            color: "var(--red)",
          } satisfies React.CSSProperties}
        >
          <span
            aria-hidden
            style={{
              display: "inline-block",
              width: 20,
              height: 2,
              background: "var(--red)",
              flexShrink: 0,
            } satisfies React.CSSProperties}
          />
          Word of mouth
        </p>

        {/* Sub-heading */}
        <p
          className="ff-quick"
          style={{
            fontSize: "clamp(16px, 1.35vw, 22px)",
            lineHeight: 1.55,
            color: "var(--ink-soft)",
            maxWidth: "46ch",
          } satisfies React.CSSProperties}
        >
          Most of our work comes by referral and repeat clients.
        </p>

        {/* Microdetail strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 1.6vw, 22px)",
            flexWrap: "wrap",
            marginTop: "clamp(4px, 0.5vw, 8px)",
          } satisfies React.CSSProperties}
        >
          {[
            "Est. 1996",
            "MBA Member #19831",
            "QBCC #1017247",
            "5× House of the Year",
          ].map((item, i) => (
            <Fragment key={item}>
              {i > 0 && (
                <span
                  aria-hidden
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: "var(--line-2)",
                    flexShrink: 0,
                  } satisfies React.CSSProperties}
                />
              )}
              <span
                className="ff-mono"
                style={{
                  fontSize: "clamp(9px, 0.72vw, 11px)",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--ink-soft)",
                  opacity: 0.75,
                } satisfies React.CSSProperties}
              >
                {item}
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      {/* Marquee rows */}
      <div
        style={{
          overflow: "hidden",
          paddingBottom: "clamp(64px, 9vw, 128px)",
          display: "flex",
          flexDirection: "column",
          gap: "clamp(14px, 1.6vw, 24px)",
        } satisfies React.CSSProperties}
      >
        {/* Row 1: left to right */}
        <div
          aria-hidden
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "brdVoicesL 48s linear infinite",
            willChange: "transform",
          } satisfies React.CSSProperties}
        >
          {Array.from({ length: 4 }).map((_, rep) => (
            <span
              key={rep}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(16px, 2vw, 28px)",
                paddingInlineEnd: "clamp(16px, 2vw, 28px)",
              } satisfies React.CSSProperties}
            >
              {ROW_1.map((frag, j) => (
                <Fragment key={j}>
                  <span
                    className="ff-mont"
                    style={{
                      fontWeight: 700,
                      fontSize: "clamp(17px, 1.7vw, 26px)",
                      letterSpacing: "0.015em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                    } satisfies React.CSSProperties}
                  >
                    {frag}
                  </span>
                  <RedDot />
                </Fragment>
              ))}
            </span>
          ))}
        </div>

        {/* Row 2: right to left */}
        <div
          aria-hidden
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "brdVoicesR 56s linear infinite",
            willChange: "transform",
          } satisfies React.CSSProperties}
        >
          {Array.from({ length: 4 }).map((_, rep) => (
            <span
              key={rep}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "clamp(14px, 1.8vw, 24px)",
                paddingInlineEnd: "clamp(14px, 1.8vw, 24px)",
              } satisfies React.CSSProperties}
            >
              {ROW_2.map((frag, j) => (
                <Fragment key={j}>
                  <span
                    className="ff-mont"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(14px, 1.3vw, 20px)",
                      letterSpacing: "0.02em",
                      textTransform: "uppercase",
                      color: "var(--ink-soft)",
                    } satisfies React.CSSProperties}
                  >
                    {frag}
                  </span>
                  <RedDot small />
                </Fragment>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom hairline */}
      <hr
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 1,
          background: "var(--line)",
          border: 0,
          margin: 0,
        } satisfies React.CSSProperties}
      />

      {/* Marquee keyframes — scoped names so they never clash */}
      <style>{`
        @keyframes brdVoicesL {
          from { transform: translateX(0); }
          to   { transform: translateX(-25%); }
        }
        @keyframes brdVoicesR {
          from { transform: translateX(-25%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
