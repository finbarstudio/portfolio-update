import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Generated favicon — the brand asterisk (the rectangular 8-spoke mark) in pink
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
        <svg width={30} height={30} viewBox="0 0 100 100">
          <polygon points={ASTERISK_POINTS} fill="#E8718B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
