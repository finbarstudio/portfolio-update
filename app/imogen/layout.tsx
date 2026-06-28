import type { Metadata } from "next";
import "./imogen.css";
import SmoothScrollScope from "@/components/imogen/SmoothScrollScope";
import PasswordGate from "@/components/imogen/PasswordGate";

// Imogen's Asia — a private travel guide. Lives OUTSIDE the (site) route group,
// so it inherits only the root html/body (fonts) and never gets the portfolio
// sidebar / nav / grain. noindex: it's personal, not for search.
export const metadata: Metadata = {
  title: { absolute: "Imogen's Asia — a little guide" },
  description: "A private travel guide for a first trip through Southeast Asia.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ImogenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="imogen-page">
      {/* keep content visible if JS is off (reveals start hidden otherwise) */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: ".imogen-page .im-reveal{opacity:1;transform:none}" }} />
      </noscript>
      <SmoothScrollScope />
      <PasswordGate>{children}</PasswordGate>
    </div>
  );
}
