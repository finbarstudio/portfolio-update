import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * /free-redesign social share card (Open Graph + Twitter), 1200×630.
 *
 * Built to read like the page's own hero: the brand mark up top, the headline
 * big, the no-cost lede under it, the FINBARSTUDIO wordmark at the foot. This
 * overrides the site-wide cream card so an ad link previews as the offer, not
 * the generic studio card. Static PNG, so the mark is rendered still (no pulse).
 */

export const alt =
  "A free redesign of your homepage. A 15-minute chat, a real concept within a week, no cost and no obligation. Finbar Studio.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (the hero's own ground/ink/pink — app/globals.css @theme).
const BG = "#FDF9F9";
const INK = "#211E1A";
const INK_SOFT = "#6E675C";
const PINK = "#E96D89";

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

export default async function FreeRedesignOpengraphImage() {
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
          fontFamily: "Host Grotesk, sans-serif",
          padding: "72px 90px",
          position: "relative",
        }}
      >
        {/* The mark, as the hero opens on it */}
        <div style={{ display: "flex", marginBottom: 34 }}>
          <Mark size={92} />
        </div>

        {/* Hero headline */}
        <div
          style={{
            display: "flex",
            textAlign: "center",
            fontSize: 76,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1.02,
            maxWidth: 900,
          }}
        >
          A free redesign of your homepage. Seriously.
        </div>

        {/* Lede */}
        <div
          style={{
            display: "flex",
            textAlign: "center",
            marginTop: 30,
            fontSize: 28,
            fontWeight: 400,
            lineHeight: 1.4,
            color: INK_SOFT,
            maxWidth: 720,
          }}
        >
          A 15-minute chat, a real concept within a week. No cost, no
          obligation.
        </div>

        {/* Wordmark, pinned to the foot */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            bottom: 52,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: INK,
          }}
        >
          FINBARSTUDIO
          <div style={{ display: "flex", marginLeft: 6 }}>
            <Mark size={18} />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
