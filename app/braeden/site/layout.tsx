import type { Metadata } from "next";
import {
  Montserrat, Quicksand, Fraunces, Cormorant_Garamond,
  Space_Grotesk, Archivo, Poppins, Space_Mono,
} from "next/font/google";
import "./braeden-site.css";
import SmoothScroll from "@/components/braeden/SmoothScroll";
import NavTone from "@/components/braeden/NavTone";
import Preloader from "@/components/braeden/Preloader";

// Braeden Constructions demo. Lives outside the (site) route group, inheriting
// only the root html/body; styling is scoped under `.braeden-site`. noindex: a
// private concept build by finbar.studio.
//
// Braeden's real DNA = Montserrat (display/nav/caps) + Quicksand (body). The
// other faces are the per-option display fonts the homepage CHOOSER uses to let
// Finbar feel out each section (all kept within ~20% of the geometric-sans DNA,
// except a couple of editorial serifs used sparingly for single statements).
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", weight: ["400", "500", "600", "700", "800"] });
const quicksand = Quicksand({ subsets: ["latin"], variable: "--font-quick", display: "swap", weight: ["400", "500", "600", "700"] });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap", style: ["normal", "italic"], weight: ["300", "400", "500"] });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-cormorant", display: "swap", style: ["normal", "italic"], weight: ["300", "400", "500"] });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap", weight: ["400", "500", "700"] });
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap", weight: ["500", "600", "700", "800"] });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", display: "swap", weight: ["500", "600", "700", "800"] });
const spaceMono = Space_Mono({ subsets: ["latin"], variable: "--font-space-mono", display: "swap", weight: ["400", "700"] });

const FONTS = [montserrat, quicksand, fraunces, cormorant, grotesk, archivo, poppins, spaceMono]
  .map((f) => f.variable).join(" ");

export const metadata: Metadata = {
  title: { absolute: "Braeden Constructions | Award-Winning Custom Home Builder, Noosa" },
  description: "A concept site for Braeden Constructions by finbar.studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function BraedenSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`braeden-site ${FONTS}`}>
      <Preloader />
      <a href="/braeden" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <NavTone />
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
