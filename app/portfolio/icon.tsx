import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * portfolio.finbar.studio's tab icon: the brand mark on a black rounded tile, the
 * same build as the lab's (a glyph on black), so the three sites tell apart in
 * a row of tabs. The main site's is the bare mark.
 */

export const size = { width: 192, height: 192 };
export const contentType = "image/png";

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

export default function PortfolioIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000000", borderRadius: 42, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Mark size={128} />
      </div>
    ),
    { ...size },
  );
}
