import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./a-rolley-site.css";
import SmoothScroll from "@/components/arolley/SmoothScroll";
import NavTone from "@/components/arolley/NavTone";
import Preloader from "@/components/arolley/Preloader";

// A Rolley & Sons demo — the SIGNATURE direction. Faithful to their real site:
// sans-serif on their grey #3E4148 ground (a refresh, not a rebrand). Their site
// uses Proxima Nova (commercial); Figtree is a close free stand-in here, the same
// way the logo is a placeholder Finbar can swap for the licensed asset later.
// Styling is scoped under `.arolley-site`; noindex (a private concept build).
const body = Figtree({
  subsets: ["latin"],
  variable: "--font-arolley-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { absolute: "A Rolley & Sons | Fourth-Generation Sunshine Coast Home Builders" },
  description: "A concept site for A Rolley & Sons by finbar.studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ARolleySiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`arolley-site ${body.variable}`}
      data-theme="signature"
      // signature is single-typeface (their site uses one sans): map the display
      // var onto the body font so all the `.display` type renders in the sans.
      style={{ ["--font-arolley-display" as string]: "var(--font-arolley-body)" }}
    >
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
