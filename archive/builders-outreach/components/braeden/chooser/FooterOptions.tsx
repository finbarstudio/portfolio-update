/**
 * Braeden homepage CHOOSER — FOOTER, six options.
 *
 * Each option is a full ~100svh footer grounded in a real footer archetype:
 * tall multi-column info grid + a giant wordmark sweep. Six distinct
 * display-font + colour-shift treatments, all within ~20% of Braeden DNA
 * (light ground, ink #222, red #e1251b sparingly). No em dashes. No invented
 * client facts. No public email or Instagram (none exists). No photo of Mick.
 */

import { Tag, P, Photo } from "./_kit";
import React from "react";

/* ── Faithful content ─────────────────────────────────────────────────────── */

const STUDIO_LINES = ["Braeden Constructions", "Est. 1996", "Lake McDonald, Noosa Hinterland"];
const VISIT_LINES  = ["Hoy Rd, Lake McDonald", "Noosa Hinterland QLD", "By appointment"];
const INDEX_LINKS  = ["Home", "Our Work", "History", "Awards", "Contact"];
const DIRECT_LINES = ["Mick Devlin", "0418 505 117", "Facebook"];

const AWARDS_BADGE =
  "MBA Member · National House of the Year 2010";

/* Shared column-label style */
const COL_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-montserrat)",
  fontSize: 9,
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.22em",
  color: "var(--ink-soft)",
  marginBottom: "0.9em",
  display: "block",
};

const COL_LINE: React.CSSProperties = {
  fontSize: 14,
  lineHeight: 1.85,
  color: "var(--ink-soft)",
  display: "block",
};

const COL_RED: React.CSSProperties = {
  ...COL_LINE,
  color: "var(--red)",
  fontWeight: 600,
};

/* ── Award badge row ─────────────────────────────────────────────────────── */
function AwardBadge({ style }: { style?: React.CSSProperties }) {
  return (
    <p
      style={{
        fontFamily: "var(--font-montserrat)",
        fontSize: 9,
        fontWeight: 600,
        textTransform: "uppercase" as const,
        letterSpacing: "0.18em",
        color: "var(--ink-soft)",
        lineHeight: 1.5,
        ...style,
      }}
    >
      {AWARDS_BADGE}
    </p>
  );
}

/* ── Four-column info grid (used in options 1 and 4) ─────────────────────── */
function InfoGrid({ redPhone = true }: { redPhone?: boolean }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "clamp(24px,3vw,48px)",
      }}
    >
      {/* Studio */}
      <div>
        <span style={COL_LABEL}>Studio</span>
        {STUDIO_LINES.map((l) => (
          <span key={l} style={COL_LINE}>{l}</span>
        ))}
      </div>
      {/* Visit */}
      <div>
        <span style={COL_LABEL}>Visit</span>
        {VISIT_LINES.map((l) => (
          <span key={l} style={COL_LINE}>{l}</span>
        ))}
      </div>
      {/* Index */}
      <div>
        <span style={COL_LABEL}>Index</span>
        {INDEX_LINKS.map((l) => (
          <span key={l} style={COL_LINE}>{l}</span>
        ))}
      </div>
      {/* Direct */}
      <div>
        <span style={COL_LABEL}>Direct</span>
        <span style={COL_LINE}>Mick Devlin</span>
        <span style={redPhone ? COL_RED : COL_LINE}>0418 505 117</span>
        <span style={COL_LINE}>Facebook</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════ */

export default function FooterOptions() {
  return (
    <>
      {/* ─────────────────────────────────────────────────────────────────────
          1 — Cropped wordmark sweep
          White ground. 4-col info grid, then a rule, then "BRAEDEN" as a
          giant barely-there watermark (#ebebeb) cropped by the bottom edge.
          Award row bottom-left above the wordmark. Red on phone + no-op links.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Tag section="Footer" n={1} label="Cropped wordmark sweep" />

        {/* Top: info grid */}
        <div
          className="frame"
          style={{
            paddingTop: "clamp(72px,9vw,140px)",
            paddingBottom: "clamp(28px,3vw,44px)",
          }}
        >
          <InfoGrid redPhone />
          <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "clamp(28px,3.5vw,48px) 0 0" }} />
        </div>

        {/* Bottom: award row + giant watermark wordmark */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            flex: 1,
            minHeight: "clamp(100px,18vw,220px)",
          }}
        >
          {/* Award badges bottom-left above the wordmark */}
          <div
            className="frame"
            style={{
              position: "absolute",
              bottom: "clamp(55px,8vw,120px)",
              left: 0,
              zIndex: 2,
            }}
          >
            <AwardBadge />
          </div>

          {/* Giant cropped watermark */}
          <p
            className="ff-mont"
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-0.12em",
              left: "var(--gutter)",
              right: "var(--gutter)",
              fontWeight: 800,
              fontSize: "clamp(120px,19vw,320px)",
              lineHeight: 1,
              textTransform: "uppercase" as const,
              letterSpacing: "-0.02em",
              color: "var(--line)",
              whiteSpace: "nowrap" as const,
              userSelect: "none" as const,
              pointerEvents: "none" as const,
              margin: 0,
            }}
          >
            BRAEDEN
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          2 — Split editorial ledger
          Off-white #f7f7f7. Upper band 5/7 split: left = big philosophy
          sentence, period in red; right = 3-col ledger. Full-width wordmark
          along the bottom band in Poppins 700. Award badges flush-left above.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper-2)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tag section="Footer" n={2} label="Split editorial ledger" />

        {/* Upper split band */}
        <div
          className="frame"
          style={{
            flex: 1,
            display: "grid",
            gridTemplateColumns: "5fr 7fr",
            gap: "clamp(32px,4vw,64px)",
            paddingTop: "clamp(72px,9vw,140px)",
            paddingBottom: "clamp(40px,5vw,80px)",
            alignItems: "center",
            position: "relative",
          }}
        >
          {/* Vertical divider */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              top: "clamp(72px,9vw,140px)",
              bottom: "clamp(40px,5vw,80px)",
              left: "calc(5 / 12 * 100%)",
              width: 1,
              background: "var(--line-2)",
            }}
          />

          {/* Left: big editorial sentence */}
          <div>
            <p
              className="ff-grotesk"
              style={{
                fontWeight: 500,
                fontSize: "clamp(24px,2.8vw,44px)",
                lineHeight: 1.25,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                margin: 0,
              }}
            >
              We listen. We ask you questions. We listen again
              <span style={{ color: "var(--red)" }}>.</span>
            </p>
          </div>

          {/* Right: 3-col ledger */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(16px,2vw,32px)",
              paddingLeft: "clamp(24px,3vw,48px)",
            }}
          >
            <div>
              <span style={COL_LABEL}>Contact</span>
              <span style={COL_LINE}>Mick Devlin</span>
              <span style={COL_RED}>0418 505 117</span>
            </div>
            <div>
              <span style={COL_LABEL}>Visit</span>
              {VISIT_LINES.map((l) => (
                <span key={l} style={COL_LINE}>{l}</span>
              ))}
            </div>
            <div>
              <span style={COL_LABEL}>Follow</span>
              <span style={COL_LINE}>Facebook</span>
              <span style={{ ...COL_LINE, marginTop: "1.4em", display: "block" }}>
                MBA Member
              </span>
            </div>
          </div>
        </div>

        {/* Bottom band: award row + full-width Poppins wordmark */}
        <div style={{ overflow: "hidden" }}>
          <div className="frame" style={{ paddingBottom: "0.3em" }}>
            <AwardBadge />
          </div>
          <p
            className="ff-poppins"
            aria-hidden
            style={{
              fontWeight: 700,
              fontSize: "clamp(40px,8vw,140px)",
              lineHeight: 0.88,
              textTransform: "uppercase" as const,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
              paddingInline: "var(--gutter)",
              margin: 0,
              whiteSpace: "nowrap" as const,
              userSelect: "none" as const,
            }}
          >
            BRAEDEN CONSTRUCTIONS
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          3 — Centred monument
          White, centred. Eyebrow + inline contact row (middots) + index row.
          Stacked centred "BRAEDEN" over "CONSTRUCTIONS" in Montserrat 800.
          Award badge row centred below. Red only on the eyebrow leading mark.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          overflow: "hidden",
          gap: 0,
        }}
      >
        <Tag section="Footer" n={3} label="Centred monument" />

        <div
          className="frame"
          style={{
            width: "100%",
            paddingTop: "clamp(72px,9vw,120px)",
            paddingBottom: "clamp(28px,3vw,48px)",
          }}
        >
          {/* Eyebrow */}
          <p className="eyebrow" style={{ marginBottom: "1.6em" }}>
            <span style={{ color: "var(--red)" }}>&#x2022;</span>
            {" "}Sunshine Coast custom homes since 1996
          </p>

          {/* Inline contact row with middots */}
          <p
            style={{
              fontSize: "clamp(14px,1.2vw,18px)",
              color: "var(--ink-soft)",
              lineHeight: 1.5,
              letterSpacing: "0.01em",
              marginBottom: "1em",
            }}
          >
            0418 505 117
            <span style={{ margin: "0 0.7em", color: "var(--line-2)" }}>&#xB7;</span>
            Facebook
            <span style={{ margin: "0 0.7em", color: "var(--line-2)" }}>&#xB7;</span>
            Hoy Rd, Lake McDonald
          </p>

          {/* Index row */}
          <p
            style={{
              fontSize: "clamp(11px,1vw,13px)",
              color: "var(--ink-soft)",
              lineHeight: 2,
              letterSpacing: "0.08em",
              marginBottom: "clamp(40px,6vw,90px)",
            }}
          >
            {INDEX_LINKS.join("  ·  ")}
          </p>

          {/* Stacked wordmark */}
          <div
            aria-hidden
            style={{
              lineHeight: 0.9,
              userSelect: "none" as const,
              marginBottom: "clamp(20px,3vw,40px)",
            }}
          >
            <p
              className="ff-mont"
              style={{
                fontWeight: 800,
                fontSize: "clamp(80px,14vw,240px)",
                textTransform: "uppercase" as const,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 0.88,
              }}
            >
              BRAEDEN
            </p>
            <p
              className="ff-mont"
              style={{
                fontWeight: 800,
                fontSize: "clamp(36px,6.2vw,108px)",
                textTransform: "uppercase" as const,
                letterSpacing: "0.02em",
                color: "var(--ink)",
                margin: 0,
                lineHeight: 1,
              }}
            >
              CONSTRUCTIONS
            </p>
          </div>

          {/* Award badges centred */}
          <AwardBadge style={{ textAlign: "center" }} />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          4 — Panel-inset grid
          White page, the footer content inside one large rounded off-white
          panel inset ~32px from edges, 1px #ebebeb border. 4-col grid top,
          "BRAEDEN" along the inner bottom cropped by panel radius. Award
          badges top-right inside. Red on phone.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(20px,3vw,32px)",
        }}
      >
        <Tag section="Footer" n={4} label="Panel-inset grid" />

        {/* The inset panel */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "var(--paper-2)",
            border: "1px solid var(--line)",
            borderRadius: "clamp(12px,1.5vw,24px)",
            overflow: "hidden",
            minHeight: "calc(100svh - clamp(40px,6vw,64px))",
          }}
        >
          {/* Panel top: award badges top-right + 4-col info grid */}
          <div style={{ padding: "clamp(32px,4vw,60px)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "clamp(28px,3.5vw,52px)",
              }}
            >
              <AwardBadge style={{ textAlign: "right" }} />
            </div>
            <InfoGrid redPhone />
          </div>

          {/* Panel bottom: wordmark cropped by panel radius */}
          <div style={{ overflow: "hidden" }}>
            <p
              className="ff-mont"
              aria-hidden
              style={{
                fontWeight: 700,
                fontSize: "clamp(80px,12vw,200px)",
                lineHeight: 0.85,
                textTransform: "uppercase" as const,
                letterSpacing: "-0.015em",
                color: "#888888",
                paddingInline: "clamp(20px,3vw,48px)",
                margin: 0,
                whiteSpace: "nowrap" as const,
                userSelect: "none" as const,
                paddingBottom: "0.04em",
              }}
            >
              BRAEDEN
            </p>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          5 — Ground-line baseline
          White, heavy top padding (~55% near-empty). Sparse two-column:
          left = one-line statement, period in red; right = compact stack.
          Bottom ~30% is the wordmark full-width on the baseline, colour
          #484848. A 1px #ebebeb rule above as horizon + small left award row.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Tag section="Footer" n={5} label="Ground-line baseline" />

        {/* Upper ~55%: empty breathing space */}
        <div style={{ flex: "0 0 55%" }} />

        {/* Two-column sparse content */}
        <div
          className="frame"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "clamp(32px,4vw,64px)",
            alignItems: "start",
            paddingBottom: "clamp(28px,3vw,48px)",
          }}
        >
          {/* Left: statement */}
          <p
            className="ff-archivo"
            style={{
              fontWeight: 600,
              fontSize: "clamp(18px,2vw,28px)",
              lineHeight: 1.35,
              color: "var(--ink)",
              margin: 0,
            }}
          >
            Deal direct with Mick, start to finish
            <span style={{ color: "var(--red)" }}>.</span>
          </p>

          {/* Right: compact stack */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25em" }}>
            <span style={{ ...COL_LINE, color: "var(--red)", fontWeight: 600 }}>0418 505 117</span>
            <span style={COL_LINE}>Facebook</span>
            <span style={COL_LINE}>Hoy Rd, Lake McDonald</span>
            <div
              style={{
                display: "flex",
                gap: "1em",
                flexWrap: "wrap" as const,
                marginTop: "0.6em",
              }}
            >
              {INDEX_LINKS.map((l) => (
                <span
                  key={l}
                  style={{
                    fontSize: 12,
                    color: "var(--ink-soft)",
                    fontFamily: "var(--font-montserrat)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase" as const,
                  }}
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Horizon rule with award row */}
        <div
          className="frame"
          style={{ paddingBottom: "0.3em" }}
        >
          <div
            style={{
              borderTop: "1px solid var(--line)",
              paddingTop: "0.7em",
            }}
          >
            <AwardBadge />
          </div>
        </div>

        {/* Baseline wordmark, full-width */}
        <div style={{ overflow: "hidden" }}>
          <p
            className="ff-mont"
            aria-hidden
            style={{
              fontWeight: 700,
              fontSize: "clamp(48px,9.5vw,160px)",
              lineHeight: 0.85,
              textTransform: "uppercase" as const,
              letterSpacing: "-0.01em",
              color: "var(--ink-soft)",
              paddingInline: "var(--gutter)",
              paddingBottom: "0.06em",
              margin: 0,
              whiteSpace: "nowrap" as const,
              userSelect: "none" as const,
            }}
          >
            BRAEDEN CONSTRUCTIONS
          </p>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────────
          6 — Asymmetric brand block
          White. Lower-left: "BRAEDEN" over "CONSTRUCTIONS" tall left-aligned,
          bottom-anchored, in low-opacity brand red (rgba(225,37,27,0.10)).
          Upper/mid-right: compact right-aligned ledger + award row.
          Full red #e1251b on phone.
         ───────────────────────────────────────────────────────────────────── */}
      <section
        className="brd-opt"
        style={{
          position: "relative",
          minHeight: "100svh",
          background: "var(--paper)",
          overflow: "hidden",
        }}
      >
        <Tag section="Footer" n={6} label="Asymmetric brand block" />

        {/* Dominant lower-left wordmark, bottom-anchored */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "var(--gutter)",
            bottom: "-0.08em",
            lineHeight: 0.88,
            userSelect: "none" as const,
            pointerEvents: "none" as const,
          }}
        >
          <p
            className="ff-poppins"
            style={{
              fontWeight: 800,
              fontSize: "clamp(80px,13vw,220px)",
              textTransform: "uppercase" as const,
              letterSpacing: "-0.02em",
              color: "rgba(225,37,27,0.10)",
              margin: 0,
              lineHeight: 0.88,
            }}
          >
            BRAEDEN
          </p>
          <p
            className="ff-poppins"
            style={{
              fontWeight: 800,
              fontSize: "clamp(28px,4.5vw,78px)",
              textTransform: "uppercase" as const,
              letterSpacing: "0.01em",
              color: "rgba(225,37,27,0.10)",
              margin: 0,
              lineHeight: 1,
            }}
          >
            CONSTRUCTIONS
          </p>
        </div>

        {/* Upper/mid-right: compact right-aligned ledger */}
        <div
          className="frame"
          style={{
            position: "absolute",
            top: "clamp(72px,9vw,140px)",
            right: 0,
            left: 0,
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              textAlign: "right",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(24px,3vw,40px)",
              maxWidth: 360,
            }}
          >
            {/* Direct */}
            <div>
              <span style={{ ...COL_LABEL, textAlign: "right" }}>Direct</span>
              <span style={COL_LINE}>Mick Devlin</span>
              <span style={COL_RED}>0418 505 117</span>
              <span style={COL_LINE}>Facebook</span>
            </div>

            {/* Visit */}
            <div>
              <span style={{ ...COL_LABEL, textAlign: "right" }}>Visit</span>
              {VISIT_LINES.map((l) => (
                <span key={l} style={COL_LINE}>{l}</span>
              ))}
            </div>

            {/* Index */}
            <div>
              <span style={{ ...COL_LABEL, textAlign: "right" }}>Index</span>
              {INDEX_LINKS.map((l) => (
                <span key={l} style={COL_LINE}>{l}</span>
              ))}
            </div>

            {/* Award badges right-aligned */}
            <AwardBadge style={{ textAlign: "right" }} />
          </div>
        </div>
      </section>
    </>
  );
}
