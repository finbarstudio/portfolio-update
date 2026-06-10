import { ImageResponse } from "next/og";

/**
 * Generated favicon — the brand star (✶) in pink on the site's off-white
 * ground. Next.js emits this alongside the legacy favicon.ico for browsers
 * that prefer PNG. 32×32 keeps it crisp in tabs and bookmarks.
 *
 * Drawn as inline SVG: next/og's bundled font has no ✶ glyph.
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
          background: "#FAFAF8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={26} height={26} viewBox="0 0 100 100" fill="none">
          <g stroke="#FF1F8F" strokeWidth={13} strokeLinecap="round">
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
