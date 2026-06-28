import type { Metadata } from "next";
import { Archivo, Work_Sans } from "next/font/google";
import "./gto-building-site.css";
import SmoothScroll from "@/components/gto-building/SmoothScroll";

// GTO Building demo. Lives outside the (site) route group, so it inherits only
// the root <html>/<body> — none of the portfolio chrome. Its styling is scoped
// under `.gto-building-site` and it runs its own Lenis instance. noindex: a
// private demo Finbar sends, reachable from the /gto-building pitch.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-gto-display",
  display: "swap",
});
const body = Work_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-gto-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "GTO Building | Award-Winning Sunshine Coast Home Builder",
  },
  description:
    "GTO Building constructs award-winning, architect-designed homes across the Sunshine Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function GtoSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`gto-building-site ${display.variable} ${body.variable}`}>
      {/* Pink brand bubble back to the GTO pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/gto-building" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
