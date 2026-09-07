import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";

/**
 * web.finbar social share card (Open Graph + Twitter), 1200×630. Greyscale to
 * match the section: the brand mark's gradient fills are desaturated with the
 * same luma weights CSS `filter: grayscale(1)` uses, so it reads identical to
 * the greyscale wordmark used everywhere else in /web.
 */

export const alt = "web.finbar — a catalogue of websites worth clicking.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#eeeeee";
const INK = "#111111";
const INK_SOFT = "#666666";

function toGrey(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const y = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const h = y.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

function GreyMark({ size: s }: { size: number }) {
  return (
    <svg width={s} height={s} viewBox={MARK_VIEWBOX}>
      {MARK_SHAPES.map((sh, i) =>
        sh.tag === "polygon" ? (
          <polygon key={i} points={sh.points} fill={toGrey(sh.fill)} />
        ) : sh.tag === "circle" ? (
          <circle key={i} cx={sh.cx} cy={sh.cy} r={sh.r} fill={toGrey(sh.fill)} />
        ) : (
          <path key={i} d={sh.d} fill={toGrey(sh.fill)} />
        ),
      )}
    </svg>
  );
}

export default async function WebOpengraphImage() {
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
          fontFamily: "Host Grotesk, sans-serif",
          padding: 64,
        }}
      >
        {/* The WEBFINBAR lockup is the hero: same construction as the site's
            wordmark (bold caps, tight tracking, the greyscale mark after). */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: 56,
            fontSize: 132,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            lineHeight: 1,
          }}
        >
          WEBFINBAR
          <div style={{ display: "flex", marginLeft: 18 }}>
            <GreyMark size={100} />
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 32, fontSize: 30, fontWeight: 400, color: INK_SOFT }}>
          Good websites, one at a time.
        </div>

        <div style={{ display: "flex", marginTop: "auto", fontSize: 22, fontWeight: 400, color: INK }}>
          web.finbar.studio
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
