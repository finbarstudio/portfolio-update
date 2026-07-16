import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Generated favicon — the brand asterisk, in its gradient build,
 * on a TRANSPARENT ground. Next.js emits this as the PNG favicon. 32×32 keeps it
 * crisp in tabs and bookmarks.
 *
 * Drawn as an inline SVG polygon matching the filled mark in the wordmark
 * (next/og's bundled font has no glyph for it).
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
          background: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={30} height={30} viewBox={MARK_VIEWBOX}>
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
