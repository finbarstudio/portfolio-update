import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./hm-developments-site.css";
import SmoothScroll from "@/components/hm-developments/SmoothScroll";

// HM Developments demo. Lives outside the (site) route group, so it inherits
// only the root <html>/<body> — none of the portfolio chrome. Its styling is
// scoped under `.hm-developments-site` and it runs its own Lenis instance.
// noindex: a private demo Finbar sends, reachable from the /hm-developments pitch.
const display = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-hm-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-hm-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "HM Developments | Luxury Sunshine Coast Property Developer",
  },
  description:
    "HM Developments creates enduring luxury developments across the Sunshine Coast, from The Cove at Pelican Waters to beachside townhomes. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function HmSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`hm-developments-site ${display.variable} ${body.variable}`}>
      {/* Pink brand bubble back to the HM pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/hm-developments" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
