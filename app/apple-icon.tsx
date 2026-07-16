import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Apple touch icon (180×180) for iOS home-screen bookmarks. Pink brand asterisk
 * on the cream brand ground with comfortable padding so iOS's rounded-corner
 * mask doesn't clip the mark. Inline SVG polygon matching the wordmark mark.
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
          background: "#F6EFE1",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={130} height={130} viewBox={MARK_VIEWBOX}>
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
