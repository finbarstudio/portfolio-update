import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Sandbox favicon — the brand asterisk in WHITE on the sandbox's dark "screen"
 * ground, matching the white mark in the sandbox preloader (vs. the portfolio's
 * gradient mark on transparent). Same shape as the main favicon, recoloured
 * white. Applies to /sandbox and every tool under it.
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
              <polygon key={i} points={sh.points} fill="#fff" />
            ) : sh.tag === "circle" ? (
              <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} fill="#fff" />
            ) : (
              <path key={i} d={sh.d} fill="#fff" />
            ),
          )}
        </svg>
      </div>
    ),
    { ...size }
  );
}
