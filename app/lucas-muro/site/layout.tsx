import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./lucas-muro-site.css";
import SmoothScroll from "@/components/lucas-muro/SmoothScroll";
import DemoPreloader from "@/components/DemoPreloader";

// Lucas Muro demo. Lives outside the (site) route group, so it inherits only
// the root <html>/<body> — none of the portfolio chrome. Styling is scoped
// under `.lucas-muro-site` and it runs its own Lenis instance.
// His current Wix site has no brand face (default Arial), so the demo sets
// its own: Archivo caps for display, Inter light for body — white ground,
// warm near-black ink, monochrome, imagery-first.
// noindex: a private demo Finbar sends, kept out of search + the sitemap.
const display = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-lm-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-lm-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Lucas Muro | Architectural & Interiors Photographer, Sunshine Coast",
  },
  description:
    "Lucas Muro photographs architecture and interiors for architects, designers and builders. Based in Marcoola on the Sunshine Coast, shooting Brisbane, Sydney and Melbourne since 2004. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function LucasMuroSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`lucas-muro-site ${display.variable} ${body.variable}`}>
      <DemoPreloader storageKey="lucas-muro:preloaded">
        {/* No logo file exists on the real site — the mark is typographic. */}
        <span
          className="violet text-[var(--ink,#312f2e)] text-2xl md:text-4xl whitespace-nowrap"
          style={{ letterSpacing: "0.14em", textIndent: "0.14em" }}
        >
          LUCAS&nbsp;MURO
        </span>
      </DemoPreloader>
      {/* Pink brand bubble back to the Lucas Muro pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/lucas-muro" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
