import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og-fonts";
import { MARK_SHAPES, MARK_VIEWBOX } from "@/components/brand-mark";
import { LAB_ITEMS } from "@/content/lab-items";

/**
 * lab.finbar.studio social share card (Open Graph + Twitter), 1200×630.
 * Black like the lab itself: the studio wordmark with LAB set under it in the
 * brand pink, the one-line description, and a catalogue count that keeps
 * itself up to date from content/lab-items.ts.
 */

export const alt = "Finbar Studio Lab. Things made and not published anywhere else yet.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#000000";
const INK = "#F3F1EE";
const SOFT = "#9A938B";
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

const label = { display: "flex", fontFamily: "Space Mono, monospace", fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase" } as const;

export default async function LabOpengraphImage() {
  const fonts = await loadOgFonts();
  const count = String(LAB_ITEMS.length).padStart(2, "0");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: BG, color: INK, display: "flex", flexDirection: "column", justifyContent: "space-between", fontFamily: "Host Grotesk, sans-serif", padding: 64 }}>
        <div style={{ display: "flex", justifyContent: "space-between", color: SOFT }}>
          <div style={label}>lab.finbar.studio</div>
          <div style={label}>{count} pieces</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", fontSize: 136, fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 0.9, textTransform: "uppercase" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            FINBARSTUDIO
            <div style={{ display: "flex", marginLeft: 14 }}>
              <Mark size={96} />
            </div>
          </div>
          <div style={{ display: "flex", color: PINK }}>Lab</div>
        </div>

        <div style={{ ...label, color: INK }}>Things made and not published anywhere else yet</div>
      </div>
    ),
    { ...size, fonts },
  );
}
