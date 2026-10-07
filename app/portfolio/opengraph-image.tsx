import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * portfolio.finbar.studio social share card (Open Graph + Twitter), 1200×630.
 * The portfolio's own cover, without the portrait: the row of small caps
 * labels over a hairline, and the name set as a poster on black.
 */

export const alt = "Finbar Skitini, Portfolio. Selected works, 2022 to 2026.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#F3F1EE";
const SOFT = "#9A938B";
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

function Label({ top, bottom }: { top: string; bottom: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex" }}>{top}</div>
      <div style={{ display: "flex", color: SOFT }}>{bottom}</div>
    </div>
  );
}

export default async function PortfolioOpengraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: BG, color: INK, display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "Host Grotesk, sans-serif", padding: "52px 60px 44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", fontSize: 19, fontWeight: 500, letterSpacing: "0.1em", lineHeight: 1.5, textTransform: "uppercase", paddingBottom: 22, borderBottom: `2px solid ${INK}` }}>
          <div style={{ display: "flex", alignItems: "center", color: PINK }}>
            <Mark size={24} />
            <div style={{ display: "flex", marginLeft: 12 }}>Portfolio</div>
          </div>
          <Label top="Selected works" bottom="2022–2026" />
          <Label top="Graphic and digital designer" bottom="London" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 232, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.84, textTransform: "uppercase", marginLeft: -10 }}>
          <div style={{ display: "flex" }}>Finbar</div>
          <div style={{ display: "flex" }}>Skitini</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
