import type { Metadata } from "next";
import { Jost, Lato } from "next/font/google";
import "./resolve-construction-site.css";
import SmoothScroll from "@/components/resolve-construction/SmoothScroll";

// Resolve Construction demo. Lives outside the (site) route group, so it
// inherits only the root <html>/<body> — none of the portfolio chrome. Its
// styling is scoped under `.resolve-construction-site` and it runs its own Lenis
// instance. noindex: a private demo Finbar sends, reachable from the
// /resolve-construction pitch but kept out of search + the sitemap.
const display = Jost({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-rc-display",
  display: "swap",
});
const body = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-rc-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    absolute: "Resolve Construction | Award-Winning Gold Coast Home Builder",
  },
  description:
    "Resolve Construction builds award-winning prestige homes on the Gold Coast. A demo build by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ResolveSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`resolve-construction-site ${display.variable} ${body.variable}`}>
      {/* Pink brand bubble back to the Resolve pitch — collapsed to an arrow,
          expands on hover to reveal the label. Styled like the main site. */}
      <a href="/resolve-construction" className="ld-back" aria-label="Back to finbar.studio">
        <span className="ld-back-arrow" aria-hidden="true">&larr;</span>
        <span className="ld-back-text">back to finbar.studio</span>
      </a>
      <SmoothScroll>{children}</SmoothScroll>
    </div>
  );
}
