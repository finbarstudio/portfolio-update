import type { Metadata } from "next";
import "./toombul-site.css";

// Toombul District Cricket Club — a redesign demo, ripped from toombulcricket.com.
// Lives outside the (site) route group, so it inherits only the root
// html/body (fonts) and never mounts the portfolio's LayoutShell chrome.
// Not linked from anywhere on the main site and excluded from the sitemap —
// reachable only by direct URL.
//
// Type system (global): LT Remark (LyonsType, Finbar's licensed display face,
// self-hosted via @font-face in toombul-site.css) + Archivo for body, labels
// and numerals (already loaded by the root layout as --font-archivo).
export const metadata: Metadata = {
  title: { absolute: "Toombul District Cricket Club" },
  description:
    "Toombul District Cricket Club. Brisbane Premier Grade cricket since 1882. A redesign demo by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ToombulLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="tc-site">
      {/* Precache the display face — the monument is the first thing seen. */}
      <link
        rel="preload"
        href="/toombul/fonts/LTRemark-Black.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: ".tc-site .tc-reveal{opacity:1;transform:none}" }} />
      </noscript>
      {children}
    </div>
  );
}
