/**
 * Braeden homepage (final, cohesive) — FOOTER.
 *
 * Option 4 "Panel-inset grid" restyled to the cohesion spec:
 * Montserrat + Quicksand + Space Mono (tiny technical), white page ground,
 * off-white var(--paper-2) panel with 1px var(--line) border, rounded corners,
 * 4-col info grid top, award badges top-right, "BRAEDEN" wordmark cropped
 * along the inner bottom edge by panel overflow:hidden. Red on phone only.
 * Server component — no hooks, no client state.
 */

import React from "react";

/* ── Content ─────────────────────────────────────────────────────────────── */

const STUDIO_LINES = [
  "Braeden Constructions",
  "Est. 1996",
  "Lake McDonald, Noosa Hinterland",
];

const VISIT_LINES = [
  "Hoy Rd, Lake McDonald",
  "Noosa Hinterland QLD",
  "By appointment",
];

const INDEX_LINKS = ["Home", "Our Work", "History", "Awards", "Contact"];

/* Three distinct award/membership badges — Space Mono for technical codes */
const BADGES: { label: string; mono?: boolean }[] = [
  { label: "MBA Member #19831", mono: true },
  { label: "National House of the Year, 2010" },
  { label: "QBCC 1017247", mono: true },
];

/* ── Column label — Montserrat eyebrow treatment ────────────────────────── */
const COL_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.22em",
  color: "var(--ink-soft)",
  marginBottom: "0.9em",
  display: "block",
};

/* ── Column body line — Quicksand, sentence case ────────────────────────── */
const COL_LINE: React.CSSProperties = {
  fontFamily: "var(--font-quick)",
  fontSize: 14,
  fontWeight: 400,
  lineHeight: 1.9,
  color: "var(--ink-soft)",
  display: "block",
};

/* ── Phone — same as COL_LINE but brand red ─────────────────────────────── */
const COL_RED: React.CSSProperties = {
  ...COL_LINE,
  color: "var(--red)",
  fontWeight: 600,
};

/* ── Four-column info grid ───────────────────────────────────────────────── */
function InfoGrid() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "clamp(24px, 3vw, 48px)",
      }}
    >
      {/* Studio */}
      <div>
        <span style={COL_LABEL}>Studio</span>
        {STUDIO_LINES.map((l) => (
          <span key={l} style={COL_LINE}>
            {l}
          </span>
        ))}
      </div>

      {/* Visit */}
      <div>
        <span style={COL_LABEL}>Visit</span>
        {VISIT_LINES.map((l) => (
          <span key={l} style={COL_LINE}>
            {l}
          </span>
        ))}
      </div>

      {/* Index */}
      <div>
        <span style={COL_LABEL}>Index</span>
        {INDEX_LINKS.map((l) => (
          <span key={l} style={COL_LINE}>
            {l}
          </span>
        ))}
      </div>

      {/* Direct */}
      <div>
        <span style={COL_LABEL}>Direct</span>
        <span style={COL_LINE}>Mick Devlin</span>
        <span style={COL_RED}>0418 505 117</span>
        <a
          href="https://facebook.com/braedenconstructions"
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...COL_LINE, textDecoration: "none" }}
        >
          Facebook
        </a>
      </div>
    </div>
  );
}

/* ── Award badge cluster — three stacked pills, top-right of the panel ───── */
function AwardBadges() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 6,
      }}
    >
      {BADGES.map(({ label, mono }) => (
        <span
          key={label}
          className={mono ? "ff-mono" : undefined}
          style={{
            fontFamily: mono ? "var(--font-space-mono)" : "var(--font-montserrat)",
            fontSize: mono ? 9 : 9,
            fontWeight: mono ? 400 : 600,
            textTransform: "uppercase",
            letterSpacing: mono ? "0.08em" : "0.18em",
            color: "var(--ink-soft)",
            lineHeight: 1.5,
            display: "block",
            textAlign: "right",
          }}
        >
          {label}
        </span>
      ))}
    </div>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--paper)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(20px, 3vw, 32px)",
      }}
    >
      {/* ── The inset panel ─────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "var(--paper-2)",
          border: "1px solid var(--line)",
          borderRadius: "clamp(16px, 2vw, 28px)",
          overflow: "hidden",
          minHeight: "calc(100svh - clamp(40px, 6vw, 64px))",
        }}
      >
        {/* Panel interior — top content area */}
        <div
          style={{
            padding: "clamp(32px, 4vw, 60px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(32px, 4vw, 56px)",
          }}
        >
          {/* Top row: copyright left, award badges right */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "clamp(16px, 2vw, 32px)",
            }}
          >
            {/* Left: slim eyebrow */}
            <p
              className="eyebrow"
              style={{
                margin: 0,
                color: "var(--ink-soft)",
                opacity: 0.7,
              }}
            >
              Sunshine Coast custom homes since 1996
            </p>

            {/* Right: award badges */}
            <AwardBadges />
          </div>

          {/* 4-col info grid */}
          <InfoGrid />

          {/* Hairline separator */}
          <hr
            style={{
              border: 0,
              borderTop: "1px solid var(--line)",
              margin: 0,
            }}
          />

          {/* Philosophy line + legal note */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "clamp(16px, 2vw, 32px)",
              flexWrap: "wrap",
            }}
          >
            <p
              className="ff-mont"
              style={{
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                fontSize: "clamp(13px, 1.1vw, 16px)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              We listen. We ask you questions. We listen again
              <span style={{ color: "var(--red)" }}>.</span>
            </p>

            <p
              style={{
                fontFamily: "var(--font-quick)",
                fontSize: 12,
                color: "var(--ink-soft)",
                margin: 0,
                opacity: 0.65,
                letterSpacing: "0.01em",
              }}
            >
              &copy; {new Date().getFullYear()} Braeden Constructions. All rights reserved.
            </p>
          </div>
        </div>

        {/* Panel bottom — "BRAEDEN" wordmark cropped by panel overflow:hidden */}
        <div
          aria-hidden
          style={{ overflow: "hidden", flexShrink: 0 }}
        >
          <p
            className="ff-mont"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontWeight: 800,
              fontSize: "clamp(88px, 13.5vw, 220px)",
              lineHeight: 0.82,
              textTransform: "uppercase",
              letterSpacing: "-0.015em",
              /*
               * Mid-grey settling toward ink: optically reads as a tonal
               * anchor, not a ghost — the spec's "mid-grey settling toward ink".
               */
              color: "#9a9a9a",
              paddingInline: "clamp(24px, 3.5vw, 52px)",
              paddingBottom: "0.04em",
              margin: 0,
              whiteSpace: "nowrap",
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            BRAEDEN
          </p>
        </div>
      </div>
    </footer>
  );
}
