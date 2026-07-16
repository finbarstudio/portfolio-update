import type { Metadata } from "next";
import localFont from "next/font/local";
import LayoutShell from "@/components/LayoutShell";
import "./junicode.css";

/**
 * Junicode type sandbox — the live home page, set in Junicode instead of Host
 * Grotesk, so the face can be judged on the real thing rather than a specimen.
 *
 * Lives outside the (site) route group so it can wrap the same LayoutShell in a
 * `.junicode-skin` scope: junicode.css repoints the font token inside that
 * scope only, and the live site never notices. noindex, like /redesign.
 *
 * Junicode is Peter S. Baker's, under the SIL Open Font License (fonts/OFL.txt),
 * self-hosted from the official release (psb1558/Junicode-font v2.226).
 *
 * The files are subset, and they had to be. Junicode ships a medievalist glyph
 * set at ~1.1MB per style, roughly eleven times this site's whole font budget.
 * These are cut to the latin range with the wdth and ENLA (enlarged minuscule)
 * axes pinned off, which lands each at ~104KB with the weight axis still live.
 * Regenerate with fontTools rather than hand-editing: subset first, then
 * instance — instancing the full font first overflows its layout tables.
 */
const junicode = localFont({
  src: [
    { path: "./fonts/JunicodeVF-Roman.subset.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/JunicodeVF-Italic.subset.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-junicode",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export const metadata: Metadata = {
  title: { absolute: "Junicode · type sandbox" },
  description: "Internal type sandbox.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function JunicodeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${junicode.variable} junicode-skin`}>
      <LayoutShell>{children}</LayoutShell>
    </div>
  );
}
