import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * Sandbox social share card (Open Graph + Twitter), 1200×630.
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for `/sandbox` and
 * every tool under it (unless a page overrides it). Dark, to match the sandbox's
 * "device screen" look — distinct from the portfolio's cream card — built around
 * the canonical FINBARSTUDIO wordmark + the pink brand asterisk.
 */

export const alt = "finbar✶studio Sandbox, free creative tools: Bezier Studio, 3D SVG Studio, mockup generators.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Sandbox tokens (kept in sync with .sb-root in app/globals.css).
const BG = "#1C1C1C";
const GROUND = "#211E1A";
const INK = "#F6EFE1";
const INK_SOFT = "#9C9486";
const PINK = "#E96D89";

function Mark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox={MARK_VIEWBOX}>
      {MARK_SHAPES.map((sh, i) =>
        sh.tag === "polygon" ? (
          <polygon key={i} points={sh.points} fill={sh.fill} />
        ) : sh.tag === "circle" ? (
          <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} fill={sh.fill} />
        ) : (
          <path key={i} d={sh.d} fill={sh.fill} />
        ),
      )}
    </svg>
  );
}

export default async function SandboxOpengraphImage() {
  // Host Grotesk = the canonical wordmark; Space Mono stays for the SANDBOX title.
  const fonts = await loadOgFonts();

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
          <div style={{ display: "flex", alignItems: "center", fontFamily: "Host Grotesk, sans-serif", fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", textTransform: "uppercase", lineHeight: 1 }}>
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
