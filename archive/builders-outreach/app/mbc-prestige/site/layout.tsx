import type { Metadata } from "next";
import Image from "next/image";
import { Oswald, Lato } from "next/font/google";
import "./mbc-prestige-site.css";
import SmoothScroll from "@/components/mbc-prestige/SmoothScroll";
import DemoPreloader from "@/components/DemoPreloader";

// MBC Prestige demo. Lives outside the (site) route group, so it inherits only
// the root <html>/<body> — none of the portfolio chrome. Its styling is scoped
// under `.mbc-prestige-site` and it runs its own Lenis instance. noindex: a
// private demo Finbar sends, reachable from the /mbc-prestige pitch.
const display = Oswald({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mbc-display",
  display: "swap",
});
const body = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-mbc-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "MBC Prestige | Luxury Noosa & Sunshine Coast Developer",
  },
  description:
    "MBC Prestige develops boutique luxury apartments and prestige land releases across Noosa and the Sunshine Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function MbcSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`mbc-prestige-site ${display.variable} ${body.variable}`}>
      <DemoPreloader storageKey="mbc-prestige:preloaded">
        <Image src="/mbc-prestige/logo.png" alt="MBC Prestige" width={200} height={200} priority className="w-[130px] md:w-[160px] h-auto" />
      </DemoPreloader>
      {/* Pink brand bubble back to the MBC pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/mbc-prestige" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
