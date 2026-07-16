import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Sandbox favicon — the pink brand asterisk on the sandbox's dark "screen"
 * ground (vs. the portfolio's transparent mark), so the sandbox tab reads as its
 * own thing. Applies to /sandbox and every tool under it.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1C1C1C",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={22} height={22} viewBox={MARK_VIEWBOX}>
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
      </div>
    ),
    { ...size }
  );
}
