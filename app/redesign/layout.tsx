import type { Metadata } from "next";
import LayoutShell from "@/components/LayoutShell";
import "./redesign.css";

// Home redesign sandbox. Lives outside the (site) route group so it can wrap
// the same LayoutShell chrome in a `.redesign-skin` scope; redesign.css
// overrides tokens/radii inside it while the live home stays untouched.
// noindex: an internal working page, kept out of search + the sitemap.
export const metadata: Metadata = {
  title: { absolute: "Home redesign · sandbox" },
  description: "Internal redesign sandbox.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function RedesignLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="redesign-skin">
      <LayoutShell>{children}</LayoutShell>
    </div>
  );
}
