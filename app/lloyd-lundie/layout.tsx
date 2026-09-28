import type { Metadata } from "next";
import { Cal_Sans, Questrial } from "next/font/google";
import "./lloyd-lundie-site.css";

/**
 * Lloyd Lundie Building Contractors Ltd — private redesign demo for a warm
 * lead (Medway, Kent), served at /lloyd-lundie.
 *
 * Lives outside app/(site), like /mt: LayoutShell never mounts, so there is no
 * portfolio nav, footer, preloader, grain or CursorMania. noindex, because
 * this is a pitch, not a page anyone should find.
 *
 * Type: Cal Sans (weight 400, the only cut it ships) for the "Lloyd Lundie"
 * wordmark, Questrial (weight 400) for everything else. Both are real Google
 * Fonts entries (confirmed in next/dist/compiled/@next/font/dist/google
 * font-data.json before use), so both are self-hosted at build time same as
 * every other font on this site — no external request, no FOUC risk beyond
 * the usual font-display: swap.
 */
const calSans = Cal_Sans({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ll-brand",
  display: "swap",
});

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ll",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Lloyd Lundie Building Contractors | Extensions, Lofts and Renovations in Kent",
  },
  description:
    "Lloyd Lundie Building Contractors Ltd, a family-run building company in Medway with over 30 years of experience in extensions, loft conversions, kitchens, bathrooms and renovations across Kent and the south east. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function LloydLundieLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`ll-site ${calSans.variable} ${questrial.variable}`}>{children}</div>
  );
}
