import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import SmoothScroll from "@/components/moto-technique/SmoothScroll";
import ViewCursor from "@/components/moto-technique/ViewCursor";
import "./moto-technique-site.css";

/**
 * Moto Technique — private redesign demo for Kevin O'Rourke.
 *
 * Lives outside app/(site) so LayoutShell never mounts: no portfolio nav,
 * footer, preloader, grain or CursorMania. noindex because this is a pitch,
 * not a page anyone should find.
 *
 * Type is chosen against their real site, not a house style. Their headings are
 * Aktiv Grotesk Thin and their body is Proxima Nova, both licensed, so Inter
 * stands in at the same weights. Their logo is set in Futura, so the wordmark
 * uses Jost. Kevin can swap in the licensed faces later without a redesign.
 */

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
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
  return (
    <div className={`mt-site ${inter.variable} ${jost.variable}`}>
      <SmoothScroll />
      <ViewCursor />
      {children}
    </div>
  );
}
