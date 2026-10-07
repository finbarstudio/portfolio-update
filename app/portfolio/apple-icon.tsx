import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * portfolio.finbar.studio's home-screen icon: the brand mark on black. Square,
 * because iOS rounds the corners itself.
 */

export const size = { width: 180, height: 180 };
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

export default function PortfolioAppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#000000", borderRadius: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Mark size={116} />
      </div>
    ),
    { ...size },
  );
}
