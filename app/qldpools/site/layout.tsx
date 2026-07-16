import type { Metadata } from "next";
import localFont from "next/font/local";
import "./qpi-site.css";
import SmoothScroll from "@/components/qldpools/SmoothScroll";

// The QLD Pool Installs demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Its own
// styling is scoped under `.qpi-site` (see qpi-site.css) and it runs its own
// Lenis instance via SmoothScroll. noindex: a private demo Finbar sends,
// reachable from the /qldpools pitch, kept out of search and the sitemap.
// Structure ported from the Lindon Homes demo, reskinned to QPI's DNA.
export const metadata: Metadata = {
  title: {
    absolute: "QLD Pool Installs | Fibreglass & Concrete Pools, South East Queensland",
  },
  description:
    "Fibreglass and concrete pools across Brisbane, the Gold Coast and the Sunshine Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

// FONT EXPERIMENT (Finbar, trying faces on the demo): Junicode, self-hosted from
// the official release (psb1558/Junicode-font v2.226, SIL OFL, see fonts/OFL.txt).
// Subset to latin with the wdth/ENLA axes pinned off, ~104KB per style, weight
// axis 300-700 live. NOTE this is a serif, which cuts against the pitch's own
// premise (their Times/Playfair headlines are the thing we argue reads cheap) —
// kept here only to look at. To go back to the sans, restore the Outfit import +
// this block from git (commit before this one) and the whole demo follows, since
// everything reads --font-qpi.
const junicode = localFont({
  src: [
    { path: "./fonts/JunicodeVF-Roman.subset.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/JunicodeVF-Italic.subset.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-qpi",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export default function QpiSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`qpi-site ${junicode.variable}`}>
      {/* Pink brand tab back to the pitch — collapsed to a circle mid-left,
          expands on hover. Same pattern as the other demo builds. */}
      <a href="/qldpools" className="qpi-back" aria-label="Back to finbar.studio">
        <span className="qpi-back-arrow" aria-hidden="true">&larr;</span>
        <span className="qpi-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
