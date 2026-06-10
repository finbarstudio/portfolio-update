import { ImageResponse } from "next/og";

/**
 * Apple touch icon (180×180) for iOS home-screen bookmarks. Pink star on the
 * brand ground with comfortable padding so iOS's rounded-corner mask doesn't
 * clip the mark. Drawn as inline SVG (no ✶ glyph in next/og's font).
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
          background: "#FAFAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={120} height={120} viewBox="0 0 100 100" fill="none">
          <g stroke="#FF1F8F" strokeWidth={11} strokeLinecap="round">
            <line x1="50" y1="9" x2="50" y2="91" />
            <line x1="14.5" y1="29.5" x2="85.5" y2="70.5" />
            <line x1="14.5" y1="70.5" x2="85.5" y2="29.5" />
          </g>
        </svg>
      </div>
    ),
    { ...size }
  );
}
