import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * lab.finbar.studio social share card (Open Graph + Twitter), 1200×630.
 * Black like the lab itself: the studio wordmark with LAB set under it in the
 * brand pink, and nothing else.
 */

export const alt = "Finbar Studio Lab. Things made and not published anywhere else yet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#F3F1EE";
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

export default async function LabOpengraphImage() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: BG, color: INK, display: "flex", flexDirection: "column", justifyContent: "center", fontFamily: "Host Grotesk, sans-serif", padding: 64 }}>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 136, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.9, textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            FINBARSTUDIO
            <div style={{ display: "flex", marginLeft: 14 }}>
              <Mark size={96} />
            </div>
          </div>
          <div style={{ display: "flex", color: PINK }}>Lab</div>
        </div>

      </div>
    ),
    { ...size, fonts },
  );
}
