import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./qpi-site.css";

// The QLD Pool Installs demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Its own
// styling is scoped under `.qpi-site` (see qpi-site.css). noindex: a private
// demo Finbar sends, reachable from the /qldpools pitch, kept out of search
// and the sitemap. Same shape as the old Lindon demo scaffold.
export const metadata: Metadata = {
  title: {
    absolute: "QLD Pool Installs | Fibreglass & Concrete Pools, South East Queensland",
  },
  description:
    "Fibreglass and concrete pools across Brisbane, the Gold Coast and the Sunshine Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

// Outfit is the strongest face already in their brand mix — keeps the demo
// feeling like *their* site, not a house template. (Their Playfair/Times
// headlines are the thing we're pitching against, so no serif here.)
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-qpi",
  display: "swap",
});

export default function QpiSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`qpi-site ${outfit.variable}`}>
      {/* Pink brand bubble back to the pitch — collapsed to an arrow, expands
          on hover. Same pattern as the other demo builds. */}
      <a href="/qldpools" className="qpi-back" aria-label="Back to finbar.studio">
        <span className="qpi-back-arrow" aria-hidden="true">&larr;</span>
        <span className="qpi-back-text">back to finbar.studio</span>
      </a>
      {children}
    </div>
  );
}
