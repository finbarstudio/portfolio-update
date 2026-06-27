import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Sandbox favicon — the pink brand asterisk on the sandbox's dark "screen"
 * ground (vs. the portfolio's transparent mark), so the sandbox tab reads as its
 * own thing. Applies to /sandbox and every tool under it.
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
          background: "#1C1C1C",
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width={22} height={22} viewBox="0 0 100 100">
          <polygon points={ASTERISK_POINTS} fill="#E8718B" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
