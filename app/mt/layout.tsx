import type { Metadata } from "next";
import { Host_Grotesk, Jost } from "next/font/google";
import "./moto-technique-site.css";

/**
 * Moto Technique — private redesign demo for Kevin O'Rourke, served at /mt.
 *
 * This layout is the shell every /mt page shares: the fonts, the stylesheet and
 * the .mt-site wrapper. The home page's own furniture (bar, preloader, smooth
 * scroll, cursor) is in (home)/layout.tsx, so /mt/soon gets none of it.
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

export default function MotoTechniqueLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: the home page's intro script (see (home)/layout)
  // sets data-intro on this element before React has hydrated it.
  return (
    <div className={`mt-site ${hostGrotesk.variable} ${jost.variable}`} suppressHydrationWarning>
      {children}
    </div>
  );
}
