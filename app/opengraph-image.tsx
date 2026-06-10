import { ImageResponse } from "next/og";

/**
 * Site-wide social share card (Open Graph + Twitter).
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for every route
 * that doesn't set its own (home, about, contact). Case studies override it
 * with their hero image in `generateMetadata`. Generated once at build time as
 * a static 1200×630 PNG — Swiss/type-driven to match the site itself.
 *
 * Note: the brand star is drawn as inline SVG (not the ✶ glyph) because
 * next/og's bundled font has no glyph for U+2726 and would fail at build.
 */

export const alt =
  "finbar✶studio — Brisbane graphic designer and Framer developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (kept in sync with app/globals.css).
const BG = "#FAFAF8";
const INK = "#141414";
const INK_SOFT = "#6B6B6B";
const PINK = "#FF1F8F";

// Six-point asterisk star, matching the wordmark's ✶.
function Star({ size: s, color = PINK }: { size: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <g stroke={color} strokeWidth={11} strokeLinecap="round">
        <line x1="50" y1="9" x2="50" y2="91" />
        <line x1="14.5" y1="29.5" x2="85.5" y2="70.5" />
        <line x1="14.5" y1="70.5" x2="85.5" y2="29.5" />
      </g>
    </svg>
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: INK,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          finbar
          <div style={{ display: "flex", margin: "0 4px" }}>
            <Star size={26} />
          </div>
          studio
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
            }}
          >
            <span>Graphic Designer</span>
            <span style={{ color: PINK, padding: "0 20px" }}>&amp;</span>
            <span>Framer Developer</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 28,
              fontSize: 30,
              color: INK_SOFT,
              letterSpacing: "0.01em",
            }}
          >
            Brand identity, web, publication and motion — Brisbane, AU
          </div>
        </div>

        {/* Footer rule + URL */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ height: 4, width: 120, background: PINK, marginBottom: 24 }} />
          <div
            style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            www.finbar.studio
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
