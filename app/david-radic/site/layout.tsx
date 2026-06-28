import type { Metadata } from "next";
import { Raleway, Montserrat } from "next/font/google";
import "./david-radic-site.css";
import SmoothScroll from "@/components/david-radic/SmoothScroll";

// David Radic Prestige Homes demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Its
// styling is scoped under `.david-radic-site` and it runs its own Lenis
// instance. noindex: a private demo Finbar sends, reachable from the
// /david-radic pitch.
const display = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dr-display",
  display: "swap",
});
const body = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dr-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "David Radic Prestige Homes | Gold Coast Custom Home Builder",
  },
  description:
    "David Radic Prestige Homes builds award-winning waterfront and prestige homes on the Gold Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function DavidRadicSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`david-radic-site ${display.variable} ${body.variable}`}>
      {/* Pink brand bubble back to the David Radic pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/david-radic" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
