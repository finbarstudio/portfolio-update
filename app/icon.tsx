import { ImageResponse } from "next/og";
import { STAR_POINTS } from "@/components/brand-star";

/**
 * Generated favicon — the solid brand star (✶) in pink on a TRANSPARENT
 * ground. Next.js emits this alongside the legacy favicon.ico for browsers
 * that prefer PNG. 32×32 keeps it crisp in tabs and bookmarks.
 *
 * Drawn as an inline SVG polygon matching the filled ✶ in the wordmark
 * (next/og's bundled font has no ✶ glyph).
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
        <svg width={28} height={28} viewBox="0 0 100 100">
          <polygon points={STAR_POINTS} fill="#FF1F8F" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
