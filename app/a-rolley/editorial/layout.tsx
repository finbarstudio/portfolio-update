import type { Metadata } from "next";
import { Spectral, Figtree } from "next/font/google";
import "../site/a-rolley-site.css";
import SmoothScroll from "@/components/arolley/SmoothScroll";
import NavTone from "@/components/arolley/NavTone";
import Preloader from "@/components/arolley/Preloader";

// A Rolley & Sons demo — the EDITORIAL direction (the kept alternate). Warm paper
// + Spectral serif, linked from the pitch beside the faithful grey signature
// version. Same components, scoped under `.arolley-site` with data-theme.
const display = Spectral({
  subsets: ["latin"],
  variable: "--font-arolley-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-arolley-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { absolute: "A Rolley & Sons — Editorial direction | finbar✶studio" },
  description: "An alternate editorial concept for A Rolley & Sons by finbar✶studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ARolleyEditorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`arolley-site ${display.variable} ${body.variable}`} data-theme="editorial">
      <Preloader />
      <a href="/a-rolley" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <NavTone />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
