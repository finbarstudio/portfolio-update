/**
 * Braeden homepage (final, cohesive) — CONTACT.
 *
 * Option 6 "Inset card panel" restyled to the cohesion spec: Montserrat +
 * Quicksand only, white ground, off-white card, brand red sparingly. Two-
 * column card: left = details (eyebrow "Enquire", bold Montserrat headline,
 * three detail rows), right = compact form (Name / Email / Message + red
 * submit). Microdetails: QBCC licence, MBA member no., est. year, 2025 award.
 * Server component — no hooks, button type="button".
 */

import React from "react";

const DETAILS: { label: string; value: string }[] = [
  { label: "Call", value: "0418 505 117" },
  { label: "Facebook", value: "/braedenconstructions" },
  { label: "Visit", value: "Lake McDonald, Noosa Hinterland" },
];

export default function Contact() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--paper)",
        overflow: "hidden",
      } satisfies React.CSSProperties}
    >
      <div
        className="frame pad-y"
        style={{
          display: "grid",
          placeItems: "center",
        } satisfies React.CSSProperties}
      >
        {/* Centred inset card */}
        <div
          className="wrap"
          style={{ width: "100%" } satisfies React.CSSProperties}
        >
          <div
            style={{
              background: "var(--paper-2)",
              border: "1px solid var(--line)",
              borderRadius: 16,
              boxShadow:
                "0 8px 48px rgba(34,34,34,0.08), 0 2px 10px rgba(34,34,34,0.04)",
              padding: "clamp(36px, 5.5vw, 80px)",
              display: "grid",
              gridTemplateColumns: "1fr 1px 1fr",
              gap: "clamp(32px, 5vw, 72px)",
              alignItems: "center",
            } satisfies React.CSSProperties}
          >
            {/* ── LEFT: details ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              } satisfies React.CSSProperties}
            >
              {/* Eyebrow */}
              <p
                className="eyebrow"
                style={{
                  marginBottom: "1.3em",
                } satisfies React.CSSProperties}
              >
                Enquire
              </p>

              {/* Headline */}
              <h2
                className="ff-mont"
                style={{
                  fontWeight: 700,
                  fontSize: "clamp(22px, 2.4vw, 36px)",
                  lineHeight: 1.15,
                  letterSpacing: "0.01em",
                  color: "var(--ink)",
                  maxWidth: "16ch",
                  marginBottom: "1.8em",
                  textTransform: "none",
                } satisfies React.CSSProperties}
              >
                Start a conversation with Mick.
              </h2>

              {/* Detail rows */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.3em",
                  marginBottom: "2.4em",
                } satisfies React.CSSProperties}
              >
                {DETAILS.map((d) => (
                  <div
                    key={d.label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25em",
                    } satisfies React.CSSProperties}
                  >
                    <span
                      className="eyebrow"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.22em",
                        color: "var(--ink-soft)",
                      } satisfies React.CSSProperties}
                    >
                      {d.label}
                    </span>
                    <span
                      className="ff-quick"
                      style={{
                        fontSize: "clamp(14px, 1.05vw, 16px)",
                        color: "var(--ink)",
                        lineHeight: 1.4,
                      } satisfies React.CSSProperties}
                    >
                      {d.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Microdetails: licence + award thread */}
              <div
                style={{
                  borderTop: "1px solid var(--line)",
                  paddingTop: "1.4em",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.55em",
                } satisfies React.CSSProperties}
              >
                {[
                  "QBCC #1017247",
                  "MBA Member #19831",
                  "2025 Best Individual Home, Sunshine Coast",
                ].map((item) => (
                  <span
                    key={item}
                    className="ff-mono"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.08em",
                      color: "var(--ink-soft)",
                    } satisfies React.CSSProperties}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* ── DIVIDER ── */}
            <div
              aria-hidden
              style={{
                background: "var(--line)",
                width: 1,
                alignSelf: "stretch",
              } satisfies React.CSSProperties}
            />

            {/* ── RIGHT: compact form ── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              } satisfies React.CSSProperties}
            >
              {/* Form label above */}
              <p
                className="ff-mont"
                style={{
                  fontSize: "clamp(13px, 1vw, 15px)",
                  fontWeight: 600,
                  color: "var(--ink-soft)",
                  letterSpacing: "0.01em",
                  marginBottom: "1.8em",
                  lineHeight: 1.5,
                } satisfies React.CSSProperties}
              >
                You deal direct with Mick on every build. Most work is referral
                and repeat. Tell us what you have in mind.
              </p>

              <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                } satisfies React.CSSProperties}
              >
                <input
                  className="brd-input"
                  type="text"
                  placeholder="Name"
                  style={{
                    marginBottom: "1.4em",
                  } satisfies React.CSSProperties}
                />
                <input
                  className="brd-input"
                  type="email"
                  placeholder="Email"
                  style={{
                    marginBottom: "1.4em",
                  } satisfies React.CSSProperties}
                />
                <textarea
                  className="brd-input"
                  placeholder="Message"
                  rows={3}
                  style={{
                    marginBottom: "2em",
                    resize: "none",
                    fontFamily: "inherit",
                  } satisfies React.CSSProperties}
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

              {/* Reassurance line */}
              <p
                className="ff-quick"
                style={{
                  fontSize: "clamp(12px, 0.85vw, 13px)",
                  color: "var(--ink-soft)",
                  marginTop: "1.4em",
                  lineHeight: 1.5,
                } satisfies React.CSSProperties}
              >
                Est. 1996 in Victoria &middot; Noosa since 2001 &middot; 35+ years as a qualified carpenter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
