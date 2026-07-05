import type { Metadata } from "next";
import Image from "next/image";
import { Mulish } from "next/font/google";
import "./cal-turner-site.css";
import SmoothScroll from "@/components/cal-turner/SmoothScroll";
import DemoPreloader from "@/components/DemoPreloader";

// Cal Turner Architects demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Styling
// is scoped under `.cal-turner-site` and it runs its own Lenis instance.
// Their brand face is Kiro (Adobe Fonts); Mulish is the closest free
// geometric-humanist stand-in, with the real face an easy swap later.
// noindex: a private demo Finbar sends, kept out of search + the sitemap.
const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-ct",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Cal Turner Architects | Residential Architect, Brisbane & Southeast Queensland",
  },
  description:
    "Cal Turner Architects designs new homes and renovations across Brisbane and Southeast Queensland. Architecture that starts with you. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function CalTurnerSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`cal-turner-site ${mulish.variable}`}>
      <DemoPreloader storageKey="cal-turner:preloaded">
        <Image src="/cal-turner/logo.png" alt="Cal Turner Architects" width={1366} height={353} priority className="w-[240px] md:w-[320px] h-auto" />
      </DemoPreloader>
      {/* Pink brand bubble back to the Cal Turner pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/cal-turner" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
