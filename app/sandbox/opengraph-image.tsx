import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Sandbox social share card (Open Graph + Twitter), 1200×630.
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for `/sandbox` and
 * every tool under it (unless a page overrides it). Dark, to match the sandbox's
 * "device screen" look — distinct from the portfolio's cream card — built around
 * the canonical FINBARSTUDIO wordmark + the pink brand asterisk.
 */

export const alt = "finbar✶studio Sandbox — free creative tools: Bezier Studio, 3D SVG Studio, mockup generators.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sandbox tokens (kept in sync with .sb-root in app/globals.css).
const BG = "#1C1C1C";
const GROUND = "#211E1A";
const INK = "#F6EFE1";
const INK_SOFT = "#9C9486";
const PINK = "#E8718B";

function Mark({ size: s, color = PINK }: { size: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points={ASTERISK_POINTS} fill={color} />
    </svg>
  );
}

// Space Mono (the wordmark face) isn't bundled with next/og, so fetch it at
// generation time. Falls back to the default face if offline.
async function loadSpaceMono(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(`https://fonts.googleapis.com/css2?family=Space+Mono:wght@${weight}`).then((r) => r.text());
    const url = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\(['"]?(?:woff2?|truetype|opentype)['"]?\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function SandboxOpengraphImage() {
  const [mono700, mono400] = await Promise.all([loadSpaceMono(700), loadSpaceMono(400)]);
  const fonts = [
    mono700 && { name: "Space Mono", data: mono700, weight: 700 as const, style: "normal" as const },
    mono400 && { name: "Space Mono", data: mono400, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 700; style: "normal" }[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: BG,
          color: INK,
          display: "flex",
          flexDirection: "column",
          fontFamily: "Space Mono, monospace",
          padding: 64,
          position: "relative",
        }}
      >
        {/* Rounded "device screen" panel, echoing the sandbox UI */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            background: GROUND,
            border: "1px solid rgba(246,239,225,0.12)",
            borderRadius: 28,
            padding: 64,
          }}
        >
          {/* Brand wordmark */}
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", lineHeight: 1 }}>
            FINBARSTUDIO
            <div style={{ display: "flex", marginLeft: 6 }}>
              <Mark size={26} />
            </div>
          </div>

          <div style={{ display: "flex", marginTop: 40, fontSize: 124, fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 0.95 }}>
            SANDBOX
          </div>

          <div style={{ display: "flex", marginTop: 28, fontSize: 26, fontWeight: 400, color: INK_SOFT, letterSpacing: "0.04em" }}>
            Free creative tools, in the browser.
          </div>

          {/* Tool labels */}
          <div style={{ display: "flex", gap: 14, marginTop: 44, flexWrap: "wrap" }}>
            {["Bezier Studio", "3D SVG Studio", "Phone & Mac mockups", "Effects library"].map((t) => (
              <div
                key={t}
                style={{
                  display: "flex",
                  fontSize: 18,
                  fontWeight: 400,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: INK,
                  border: "1px solid rgba(246,239,225,0.18)",
                  borderRadius: 999,
                  padding: "8px 18px",
                }}
              >
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* URL */}
        <div style={{ display: "flex", marginTop: 28, fontSize: 22, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: PINK }}>
          sandbox.finbar.studio
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
