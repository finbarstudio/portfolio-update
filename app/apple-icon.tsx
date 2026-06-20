import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

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
        <svg width={130} height={130} viewBox="0 0 100 100">
          <polygon points={ASTERISK_POINTS} fill="#E8718B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
