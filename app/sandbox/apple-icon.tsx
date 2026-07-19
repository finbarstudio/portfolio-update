import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Sandbox Apple touch icon (180×180) — the brand asterisk in WHITE on the dark
 * sandbox ground (matching the sandbox preloader's white mark), with
 * rounded-square padding for the iOS home-screen tile.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#1C1C1C",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={108} height={108} viewBox={MARK_VIEWBOX}>
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
