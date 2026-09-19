import type { Metadata } from "next";
import { Host_Grotesk, Jost } from "next/font/google";
import content from "@/content/moto-technique";
import Preloader from "@/components/moto-technique/Preloader";
import SmoothScroll from "@/components/moto-technique/SmoothScroll";
import TopBar from "@/components/moto-technique/TopBar";
import ViewCursor from "@/components/moto-technique/ViewCursor";
import "./moto-technique-site.css";

/**
 * Moto Technique — private redesign demo for Kevin O'Rourke.
 *
 * Lives outside app/(site) so LayoutShell never mounts: no portfolio nav,
 * footer, preloader, grain or CursorMania. noindex because this is a pitch,
 * not a page anyone should find.
 *
 * Type: Futura for titles, Host Grotesk for reading. Their logo is already set
 * in Futura, so the titles now speak in the same voice as the wordmark. Futura
 * is a licensed face and no file of it is served here. The stylesheet names it
 * first, which gives the real thing on every Apple device because it ships with
 * them, and Jost, the open Futura revival loaded below, stands in everywhere
 * else. Buying a web licence for Futura would make the two identical.
 */

// Variable font: one file covers every weight the demo uses (300 to 500).
const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  variable: "--font-mt",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mt-brand",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Moto Technique | Classic and Sports Car Restoration Specialists" },
  description:
    "A redesign demonstration for Moto Technique Limited, West Molesey. Classic and sports car restoration, restomods and automotive engineering since 1980.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

/**
 * Decides, before anything is painted, whether the intro plays this load, and
 * marks the wrapper `data-intro` if so. The stylesheet shows the preloader only
 * under that mark, so a refresh never flashes white and then hides it again.
 *
 * It has to be an inline script and it has to come first inside the wrapper:
 * by the time React hydrates, the first frame is already on screen. It marks
 * its own parent rather than <html> because React owns <html> too, and the
 * wrapper can carry suppressHydrationWarning for the attribute React never
 * rendered. Must match SEEN_KEY in Preloader.tsx.
 *
 * In development it plays on every refresh, because that is how it gets worked
 * on. The once-a-session rule only exists in a production build. ALWAYS is
 * decided here on the server and baked into the script as a literal. In
 * development only, `?nointro` skips it, for screenshot tools.
 */
const ALWAYS = process.env.NODE_ENV !== "production";
const INTRO_GATE = `(function(){var r=document.currentScript.parentElement;try{if(${ALWAYS}&&/[?&]nointro\\b/.test(location.search))return;if(${ALWAYS}||/[?&]intro\\b/.test(location.search)||!sessionStorage.getItem("mt-intro-seen"))r.setAttribute("data-intro","1")}catch(e){r.setAttribute("data-intro","1")}})()`;

export default function MotoTechniqueLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`mt-site ${hostGrotesk.variable} ${jost.variable}`} suppressHydrationWarning>
      <script dangerouslySetInnerHTML={{ __html: INTRO_GATE }} />
      {/* SmoothScroll first: the preloader pauses the scroll it sets up. */}
      <SmoothScroll />
      <Preloader />
      <ViewCursor />
      <TopBar name={content.site.name} nav={content.site.nav} contact={content.contact} />
      {children}
    </div>
  );
}
