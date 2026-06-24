import { ImageResponse } from "next/og";
import { ASTERISK_POINTS } from "@/components/brand-asterisk";

/**
 * Site-wide social share card (Open Graph + Twitter).
 *
 * Next.js auto-emits this as the `og:image` / `twitter:image` for every route
 * that doesn't set its own (home, about). Case studies override it with their
 * hero image in `generateMetadata`. Generated at 1200×630 on the cream brand
 * ground, built around the canonical logo: FINBARSTUDIO in Space Mono caps,
 * no space, the brand asterisk on the end.
 */

export const alt =
  "finbar✶studio. Brisbane graphic and web design. Brand identity, editorial, web and motion.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens (kept in sync with app/globals.css @theme).
const BG = "#F6EFE1";
const INK = "#211E1A";
const INK_SOFT = "#6F6A60";
const PINK = "#E8718B";

// The brand asterisk, shared with the favicon/app icons so the mark is identical
// everywhere. See @/components/brand-asterisk.
function Mark({ size: s, color = PINK }: { size: number; color?: string }) {
  return (
    <svg width={s} height={s} viewBox="0 0 100 100">
      <polygon points={ASTERISK_POINTS} fill={color} />
    </svg>
  );
}

// Space Mono (the wordmark face) isn't bundled with next/og, so fetch it from
// Google Fonts at generation time. Falls back to the default face if offline.
async function loadSpaceMono(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Space+Mono:wght@${weight}`
    ).then((r) => r.text());
    const url = css.match(
      /src:\s*url\((https:\/\/[^)]+)\)\s*format\(['"]?(?:woff2?|truetype|opentype)['"]?\)/
    )?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
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
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Space Mono, monospace",
          position: "relative",
        }}
      >
        {/* Canonical wordmark: FINBARSTUDIO caps, no space, asterisk on the end */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 88,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          FINBARSTUDIO
          <div style={{ display: "flex", marginLeft: 8 }}>
            <Mark size={62} />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 22,
            fontWeight: 400,
            color: INK_SOFT,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
          }}
        >
          Brisbane graphic &amp; web design
        </div>

        {/* URL, pinned to the bottom edge */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            bottom: 56,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: PINK,
          }}
        >
          www.finbar.studio
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}
