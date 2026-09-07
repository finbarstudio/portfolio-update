import { ImageResponse } from "next/og";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * web.finbar favicon — the brand asterisk, greyscale, on the section's
 * #eeeeee ground (vs. the portfolio's gradient mark or the sandbox's white
 * mark on dark). Same shape as the main favicon, recoloured to match /web.
 */

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function toGrey(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const h = y.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#eeeeee",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={22} height={22} viewBox={MARK_VIEWBOX}>
          {MARK_SHAPES.map((sh, i) =>
            sh.tag === "polygon" ? (
              <polygon key={i} points={sh.points} fill={toGrey(sh.fill)} />
            ) : sh.tag === "circle" ? (
              <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} fill={toGrey(sh.fill)} />
            ) : (
              <path key={i} d={sh.d} fill={toGrey(sh.fill)} />
            ),
          )}
        </svg>
      </div>
    ),
    { ...size },
  );
}
