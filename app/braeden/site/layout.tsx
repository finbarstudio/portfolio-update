import type { Metadata } from "next";
import { Spectral, Figtree } from "next/font/google";
import "./braeden-site.css";
import SmoothScroll from "@/components/braeden/SmoothScroll";
import NavTone from "@/components/braeden/NavTone";

// A Rolley & Sons demo. Lives outside the (site) route group, inheriting only
// the root html/body; styling is scoped under `.braeden-site`. noindex: a
// private concept build by finbar✶studio.
const display = Spectral({
  subsets: ["latin"],
  variable: "--font-braeden-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["300", "400"],
});

const body = Figtree({
  subsets: ["latin"],
  variable: "--font-braeden-body",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: { absolute: "A Rolley & Sons | Fourth-Generation Sunshine Coast Home Builders" },
  description: "A concept site for A Rolley & Sons by finbar✶studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BraedenSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`braeden-site ${display.variable} ${body.variable}`}>
      <a href="/braeden" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <NavTone />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
