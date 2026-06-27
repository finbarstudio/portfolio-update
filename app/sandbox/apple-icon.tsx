import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Sandbox Apple touch icon (180×180) — the brand asterisk on the dark sandbox
 * ground, with rounded-square padding for the iOS home-screen tile.
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
        <svg width={108} height={108} viewBox="0 0 100 100">
          <polygon points={ASTERISK_POINTS} fill="#E8718B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
