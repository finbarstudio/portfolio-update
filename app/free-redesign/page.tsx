import type { Metadata } from "next";
import FreeRedesign from "@/components/FreeRedesign";
import "./free-redesign.css";

/**
 * /free-redesign — dedicated landing page for the paid Meta campaign (Instagram
 * Reels/Stories traffic). One job: convert the ad click into a Cal.com booking,
 * ON this page. No nav, no competing contact routes, a single quiet mailto in
 * the footer. noindex: an ad destination, not an organic page.
 */
export const metadata: Metadata = {
  title: "A free homepage redesign",   // the root template appends "| Finbar Studio"
  description:
    "A free redesign of your homepage: a 15-minute chat, a real concept within a week, no cost and no obligation.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function FreeRedesignPage() {
  return <FreeRedesign />;
}
