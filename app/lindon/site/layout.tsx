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
      {/* Small fixed tab back to the portfolio — this demo lives under
          finbar.studio, so give a clear way out of it. */}
      <a href="/" className="ld-back" aria-label="Back to finbar.studio">
        <span aria-hidden="true">&larr;</span> back to finbar.studio
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
