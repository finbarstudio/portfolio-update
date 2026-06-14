import { ImageResponse } from "next/og";
import { STAR_POINTS } from "@/components/brand-star";

/**
 * Apple touch icon (180×180) for iOS home-screen bookmarks. Solid pink star on
 * the brand ground with comfortable padding so iOS's rounded-corner mask
 * doesn't clip the mark. Inline SVG polygon matching the filled wordmark ✶.
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
        <svg width={124} height={124} viewBox="0 0 100 100">
          <polygon points={STAR_POINTS} fill="#E8718B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
