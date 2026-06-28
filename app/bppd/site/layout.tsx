import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./bppd-site.css";
import SmoothScroll from "@/components/bppd/SmoothScroll";

// BPPD (Brisbane Prestige Property Developments) demo. Lives outside the (site)
// route group, so it inherits only the root <html>/<body> — none of the
// portfolio chrome. Styling scoped under `.bppd-site`, own Lenis instance.
// noindex: a private demo Finbar sends, reachable from the /bppd pitch.
const display = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bppd-display",
  display: "swap",
});
const body = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-bppd-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Brisbane Prestige Property Developments | BPPD",
  },
  description:
    "BPPD is a property development, investment and management company in South East Queensland, specialising in complex, de-risked developments. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BppdSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`bppd-site ${display.variable} ${body.variable}`}>
      {/* Pink brand bubble back to the BPPD pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/bppd" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
