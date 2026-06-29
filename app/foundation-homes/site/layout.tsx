import type { Metadata } from "next";
import Image from "next/image";
import { Montserrat, Inter } from "next/font/google";
import "./foundation-homes-site.css";
import SmoothScroll from "@/components/foundation-homes/SmoothScroll";
import DemoPreloader from "@/components/DemoPreloader";

// Foundation Homes demo. Lives outside the (site) route group, so it inherits
// only the root <html>/<body> — none of the portfolio chrome. Its styling is
// scoped under `.foundation-homes-site` and it runs its own Lenis instance.
// noindex: a private demo Finbar sends, reachable from the /foundation-homes
// pitch but kept out of search + the sitemap.
const display = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fh-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-fh-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Foundation Homes | Custom & Luxury Home Builder, Sunshine Coast",
  },
  description:
    "Foundation Homes builds award-winning custom homes across the Sunshine Coast and Noosa. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function FoundationSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`foundation-homes-site ${display.variable} ${body.variable}`}>
      <DemoPreloader storageKey="foundation-homes:preloaded">
        <Image src="/foundation-homes/logo.png" alt="Foundation Homes" width={400} height={328} priority className="w-[170px] md:w-[210px] h-auto" />
      </DemoPreloader>
      {/* Pink brand bubble back to the Foundation pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/foundation-homes" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
