import type { Metadata } from "next";
import "./lindon-site.css";
import SmoothScroll from "@/components/lindon/SmoothScroll";

// The Lindon Homes demo. Lives outside the (site) route group, so it inherits
// only the root <html>/<body> + fonts — none of the portfolio chrome. Its own
// styling is scoped under `.lindon-site` (see lindon-site.css) and it runs its
// own Lenis instance via SmoothScroll. noindex: this is a private demo Finbar
// sends, reachable from the /lindon pitch but kept out of search + the sitemap.
export const metadata: Metadata = {
  title: {
    absolute: "Lindon Homes | Brisbane's Trusted Custom & Luxury Home Builder",
  },
  description:
    "Lindon Homes has been building in South East Queensland for over 32 years. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function LindonSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="lindon-site">
      {/* Precache the demo's own faces (React hoists these to <head>). The logo
          is set in Violet Sans; without preloading it, a cold load painted the
          fallback first and swapped/repositioned once the woff2 arrived. */}
      <link
        rel="preload"
        href="/lindon/fonts/VioletSans-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/lindon/fonts/Remark-Regular.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {/* Pink brand bubble back to the Lindon pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/lindon" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
