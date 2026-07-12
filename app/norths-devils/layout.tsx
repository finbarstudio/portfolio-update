import type { Metadata } from "next";
import "./norths-devils-site.css";

// Norths Devils RLFC — a collage demo in the Toombul mould, on the Devils'
// own colours. Lives outside the (site) route group: no portfolio chrome,
// noindex, not in the sitemap. Fonts: LT Remark is @font-face'd from
// /toombul/fonts by the toombul css — redeclared here so this route stands
// alone; Archivo comes from the root layout.
export const metadata: Metadata = {
  title: { absolute: "Norths Devils RLFC" },
  description:
    "Norths Devils Rugby League Football Club, Bishop Park, Nundah. A demo by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function NorthsDevilsLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning: scrollbar-styling browser extensions rewrite
  // this div's className before hydration (same story as <body> in the root
  // layout), which otherwise fails hydration and regenerates the whole tree.
  return (
    <div className="nd-site" suppressHydrationWarning>
      {children}
    </div>
  );
}
