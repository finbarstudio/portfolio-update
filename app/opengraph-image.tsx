import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Site-wide social share card (Open Graph + Twitter).
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for every route
 * that doesn't set its own (home, about). Case studies override it with their
 * hero image in `generateMetadata`. Generated at build time as a 1200×630 PNG —
 * Swiss/type-driven to match the site, on the cream brand ground.
 *
 * The brand asterisk is drawn as an inline SVG polygon (next/og's bundled font
 * has no glyph for it), matching the mark in the site wordmark.
 */

export const alt =
  "finbar✶studio. Brisbane graphic and web design. Brand identity, editorial, web and motion.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (kept in sync with app/globals.css @theme).
const BG = "#F6EFE1";
const INK = "#211E1A";
const INK_SOFT = "#6F6A60";
const PINK = "#E8718B";

// The brand asterisk, shared with the favicon/app icons so the mark is identical
// everywhere. See @/components/brand-asterisk.
function Mark({ size: s, color = PINK }: { size: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points={ASTERISK_POINTS} fill={color} />
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
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* The mark, big and centred — the asterisk + wordmark are the image. */}
        <div style={{ display: "flex", marginBottom: 36 }}>
          <Mark size={132} />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          finbar
          <div style={{ display: "flex", margin: "0 8px" }}>
            <Mark size={56} />
          </div>
          studio
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            fontSize: 30,
            color: INK_SOFT,
            letterSpacing: "0.01em",
          }}
        >
          Brisbane graphic &amp; web design
        </div>

        {/* URL, pinned to the bottom edge */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: PINK,
          }}
        >
          www.finbar.studio
        </div>
      </div>
    ),
    { ...size }
  );
}
