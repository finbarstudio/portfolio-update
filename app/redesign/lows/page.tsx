import type { Metadata } from "next";
import CaseStudyPage from "@/app/(site)/case-studies/[slug]/page";

// Redesign-sandbox render of the Lows case study: the REAL case-study page
// component, pinned to the lows slug, inside the .redesign-skin wrapper from
// app/redesign/layout.tsx. Zero duplication — approve the skin here and the
// real /case-studies pages get it by folding redesign.css into globals.
export const metadata: Metadata = {
  title: { absolute: "Lows case study · redesign sandbox" },
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function RedesignLowsPage() {
  return CaseStudyPage({ params: Promise.resolve({ slug: "lows-design-build" }) });
}
