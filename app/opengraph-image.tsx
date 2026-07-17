import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Site-wide social share card (Open Graph + Twitter).
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for every route
 * that doesn't set its own (home, about). Case studies override it with their
 * hero image in `generateMetadata`. Generated at 1200×630 on the cream brand
 * ground, built around the canonical logo: FINBARSTUDIO in Host Grotesk caps,
 * no space, the brand asterisk on the end.
 */

export const alt =
  "Finbar Studio. Brisbane graphic and web design. Brand identity, editorial, web and motion.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (kept in sync with app/globals.css @theme).
const BG = "#F6EFE1";
const INK = "#211E1A";
const INK_SOFT = "#6F6A60";
const PINK = "#E96D89";

// The brand asterisk, shared with the favicon/app icons so the mark is identical
// everywhere. See @/components/brand-asterisk.
function Mark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox={MARK_VIEWBOX}>
      {MARK_SHAPES.map((sh, i) =>
        sh.tag === "polygon" ? (
          <polygon key={i} points={sh.points} fill={sh.fill} />
        ) : sh.tag === "circle" ? (
          <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} fill={sh.fill} />
        ) : (
          <path key={i} d={sh.d} fill={sh.fill} />
        ),
      )}
    </svg>
  );
}

export default async function OpengraphImage() {
  // Host Grotesk = the wordmark face; Space Mono stays for the mono caps labels.
  const fonts = await loadOgFonts();

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
          fontFamily: "Space Mono, monospace",
          position: "relative",
        }}
      >
        {/* Canonical wordmark: FINBARSTUDIO caps, no space, asterisk on the end */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontFamily: "Host Grotesk, sans-serif",
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          FINBARSTUDIO
          <div style={{ display: "flex", marginLeft: 8 }}>
            <Mark size={62} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 22,
            fontWeight: 400,
            color: INK_SOFT,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
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
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: PINK,
          }}
        >
          www.finbar.studio
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
