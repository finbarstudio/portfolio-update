import { ImageResponse } from "next/og";
import { STAR_POINTS } from "@/components/brand-star";

/**
 * Site-wide social share card (Open Graph + Twitter).
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for every route
 * that doesn't set its own (home, about, contact). Case studies override it
 * with their hero image in `generateMetadata`. Generated once at build time as
 * a static 1200×630 PNG — Swiss/type-driven to match the site itself.
 *
 * Note: the brand star is drawn as an inline SVG polygon (not the ✶ glyph)
 * because next/og's bundled font has no glyph for U+2726. It's drawn as a SOLID
 * six-pointed star to match the filled ✶ in the site wordmark.
 */

export const alt =
  "finbar✶studio — Brisbane graphic designer and Framer developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (kept in sync with app/globals.css).
const INK = "#141414";
const INK_SOFT = "#6B6B6B";
const PINK = "#FF1F8F";

// Solid six-pointed star (U+2726 ✶), shared with the favicon/loader so the
// mark is identical everywhere. See @/components/brand-star.
function Star({ size: s, color = PINK }: { size: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points={STAR_POINTS} fill={color} />
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
          background: "transparent",
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
