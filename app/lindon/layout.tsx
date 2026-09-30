import type { Metadata } from "next";
import "./lindon-site.css";
import SmoothScroll from "@/components/lindon/SmoothScroll";

// The Lindon Homes demo, served at /lindon as a showcase of Finbar's builder
// sites. Lives outside the (site) route group, so it inherits only the root
// <html>/<body> + fonts, none of the portfolio chrome. Its own styling is scoped
// under `.lindon-site` (lindon-site.css, which loads the demo's faces from
// ./fonts) and it runs its own Lenis instance via SmoothScroll. Links to pages
// the demo doesn't have go to the studio's /demo page. noindex: a demo, not a
// page anyone should find in search.
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
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
