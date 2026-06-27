/**
 * Braeden homepage (final, cohesive) — AWARDS.
 *
 * The credentials beat: a vertical ledger of real awards anchors
 * Braeden&apos;s decorated record on the Sunshine Coast. Left third = heading
 * block; right two-thirds = hairline-divided rows with Space Mono years
 * and Quicksand titles. CSS-only hover tints the rule + year tick red
 * and nudges the title right. No JS, no serif fonts, white ground.
 */

import React from "react";

const ROWS: { year: string; award: string; project?: string }[] = [
  { year: "2025", award: "Best Individual Home", project: "Riverside (Noosaville)" },
  { year: "2025", award: "Best Residential Kitchen", project: "Riverside (Noosaville)" },
  { year: "2010", award: "National Residential Master Builder of the Year" },
  { year: "2010", award: "National House of the Year" },
  { year: "×3", award: "House of the Year · Sunshine Coast" },
  { year: "×2", award: "House of the Year · Queensland" },
  { year: "MBA QLD", award: "House of the Year", project: "Modern Thai House (Noosa Heads)" },
];

export default function Awards() {
  return (
    <section
      style={{
        position: "relative",
        background: "var(--paper)",
        overflow: "hidden",
      } satisfies React.CSSProperties}
    >
      <div
        className="frame wrap pad-y"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "clamp(32px, 5vw, 80px)",
          alignItems: "start",
        } satisfies React.CSSProperties}
      >
        {/* Left: heading block */}
        <div
          style={{
            paddingTop: "clamp(4px, 0.5vw, 10px)",
            position: "sticky",
            top: "clamp(80px, 10vw, 120px)",
          } satisfies React.CSSProperties}
        >
          <p className="eyebrow" style={{ marginBottom: "1.4em" } satisfies React.CSSProperties}>
            Recognition
          </p>
          <h2
            className="ff-mont"
            style={{
              fontWeight: 800,
              fontSize: "clamp(32px, 3.6vw, 58px)",
              lineHeight: 1.0,
              letterSpacing: "0.015em",
              textTransform: "UPPERCASE",
              color: "var(--ink)",
              marginBottom: "0.75em",
            } satisfies React.CSSProperties}
          >
            Awards
          </h2>
          <p
            className="ff-quick"
            style={{
              fontSize: "clamp(14px, 1vw, 16px)",
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              maxWidth: "22ch",
              marginBottom: "2em",
            } satisfies React.CSSProperties}
          >
            A decorated record on the Sunshine Coast.
          </p>
          {/* Red accent rule */}
          <span
            aria-hidden
            style={{
              display: "block",
              width: 32,
              height: 2,
              background: "var(--red)",
            } satisfies React.CSSProperties}
          />
        </div>

        {/* Right: ledger */}
        <div>
          {/* Top border to open the ledger */}
          <div
            aria-hidden
            style={{ borderTop: "1px solid var(--line)" } satisfies React.CSSProperties}
          />
          {ROWS.map((row, i) => (
            <div key={i} className="brd-award-row">
              {/* Year / count column */}
              <span
                className="ff-mono brd-award-year"
                aria-label={row.year}
              >
                {row.year}
              </span>
              {/* Award + optional project */}
              <span className="brd-award-title ff-quick">
                {row.award}
                {row.project && (
                  <span
                    className="brd-award-project eyebrow"
                    style={{
                      display: "block",
                      marginTop: "0.35em",
                      fontSize: "clamp(9px, 0.72vw, 10px)",
                      letterSpacing: "0.14em",
                      color: "var(--ink-soft)",
                    } satisfies React.CSSProperties}
                  >
                    {row.project}
                  </span>
                )}
              </span>
            </div>
          ))}
          {/* Bottom border to close the last row */}
          <div
            aria-hidden
            style={{ borderTop: "1px solid var(--line)" } satisfies React.CSSProperties}
          />

          {/* MBA member note */}
          <p
            className="ff-mono"
            style={{
              marginTop: "clamp(20px, 2.5vw, 32px)",
              fontSize: "clamp(9px, 0.72vw, 10px)",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--ink-soft)",
            } satisfies React.CSSProperties}
          >
            MBA Member #19831 · QBCC #1017247 · Est. 1996
          </p>
        </div>
      </div>

      {/* Scoped styles: hover tints rule + year red, nudges title right */}
      <style>{`
        .brd-award-row {
          display: grid;
          grid-template-columns: clamp(56px, 5.5vw, 82px) 1fr;
          gap: clamp(14px, 2.2vw, 32px);
          align-items: center;
          padding: clamp(16px, 1.8vw, 26px) 0;
          border-top: 1px solid var(--line);
          transition: border-color 0.22s var(--ease, ease);
          cursor: default;
        }
        .brd-award-year {
          font-size: clamp(9px, 0.72vw, 10px);
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink-soft);
          transition: color 0.22s var(--ease, ease);
          line-height: 1;
        }
        .brd-award-title {
          font-size: clamp(14px, 1.05vw, 17px);
          line-height: 1.45;
          color: var(--ink);
          transition: transform 0.22s var(--ease, ease), color 0.22s var(--ease, ease);
          display: block;
        }
        .brd-award-row:hover {
          border-color: var(--red);
        }
        .brd-award-row:hover .brd-award-year {
          color: var(--red);
        }
        .brd-award-row:hover .brd-award-title {
          transform: translateX(5px);
        }

        /* Responsive: stack columns below 600px */
        @media (max-width: 680px) {
          .brd-award-row {
            grid-template-columns: clamp(44px, 12vw, 58px) 1fr;
            gap: 12px;
          }
        }
      `}</style>
    </section>
  );
}
