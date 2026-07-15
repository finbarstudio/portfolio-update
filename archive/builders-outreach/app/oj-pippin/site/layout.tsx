import type { Metadata } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import "./ojpippin-site.css";
import SmoothScroll from "@/components/ojpippin/SmoothScroll";
import NavTone from "@/components/ojpippin/NavTone";

// The OJ Pippin Homes demo. Lives outside the (site) route group, so it inherits
// only the root html/body. Its styling is scoped under `.ojpippin-site`
// (ojpippin-site.css) and it runs its own Lenis + NavTone. noindex: a private
// demo Finbar sends, reachable from the /oj-pippin pitch, kept out of search.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    absolute: "OJ Pippin Homes | Brisbane Custom & Turn-Key Home Builder Since 1994",
  },
  description:
    "A demo build for OJ Pippin Homes by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function OjPippinSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`ojpippin-site ${fraunces.variable} ${hanken.variable}`}>
      {/* Pink brand bubble back to the OJ Pippin pitch, collapsed to an arrow. */}
      <a href="/oj-pippin" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <NavTone />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
