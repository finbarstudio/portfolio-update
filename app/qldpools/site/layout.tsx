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

// FONT DIRECTION (Finbar, 70s Miami pool vibe): General Sans for the body,
// Britney for the headers. Two tokens so the two faces move independently:
//   --font-qpi          body  → General Sans
//   --font-qpi-display  header → Britney (see below)
//
// General Sans — Frode Helland / Indian Type Foundry, via Fontshare, free for
// commercial use (fonts/GeneralSans-FFL.txt). The variable woff2 is the whole
// latin set at ~37KB, so it ships whole, no subsetting; weight axis 200-700 live.
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-Variable.woff2", weight: "200 700", style: "normal" },
    { path: "./fonts/GeneralSans-VariableItalic.woff2", weight: "200 700", style: "italic" },
  ],
  variable: "--font-qpi",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

// Britney (the header face) is NOT wired yet. Every free "Britney" is a
// personal-use-only demo, and this demo becomes a real commercial site if the
// pitch lands, so it needs a purchased licence + the actual file. Until Finbar
// drops that in, --font-qpi-display falls back to General Sans (see qpi-site.css)
// so the headers are heavier General Sans rather than broken. When the licensed
// Britney arrives: add a second localFont here with variable --font-qpi-display
// and the header token in qpi-site.css picks it up with no other change.

export default function QpiSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`qpi-site ${generalSans.variable}`}>
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
