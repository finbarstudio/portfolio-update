import type { Metadata, Viewport } from "next";
import TopNav from "@/components/TopNav";
import NavLogo from "@/components/NavLogo";
import ContactPanel from "@/components/ContactPanel";

// Served at portfolio.finbar.studio (proxy.ts rewrites that host to this route).
const PORTFOLIO_URL = "https://portfolio.finbar.studio";
const PORTFOLIO_TITLE = "Finbar Skitini, Portfolio";
const PORTFOLIO_DESC = "Selected works by Finbar Skitini, graphic and digital designer in London. Brand, editorial, motion and websites, 2022 to 2026.";

// The tab icon and the share card are the files beside this one (icon.tsx,
// apple-icon.tsx, opengraph-image.tsx, twitter-image.tsx); Next adds them.
export const metadata: Metadata = {
  metadataBase: new URL(PORTFOLIO_URL),
  // `absolute` so the root layout's "| Finbar Studio" is not appended
  title: { absolute: PORTFOLIO_TITLE, template: "%s · Finbar Skitini" },
  description: PORTFOLIO_DESC,
  applicationName: "Finbar Skitini Portfolio",
  appleWebApp: { title: "Finbar Skitini", statusBarStyle: "black" },
  alternates: { canonical: PORTFOLIO_URL },
  openGraph: {
    title: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESC,
    url: PORTFOLIO_URL,
    siteName: "Finbar Skitini",
    locale: "en_GB",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: PORTFOLIO_TITLE, description: PORTFOLIO_DESC },
  // Shared by direct link only: kept out of search, and not linked from the site.
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export const viewport: Viewport = { themeColor: "#1a1a1a" };

/**
 * The portfolio (portfolio.finbar.studio, see proxy.ts) sits outside (site), so it brings its own chrome: the site nav
 * (with the CV download, which only shows here) and the logo, inverted to sit
 * on the page's black ground. The whole bar, logo included, hides on scroll
 * down and comes back on scroll up (TopNav's own behaviour, data-nav="up").
 * The inversion is a local swap of the palette variables on .pf-chrome, so
 * nothing about the main site's nav changes.
 */
export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* apply a saved light theme before first paint (see ThemeSwitch) */}
      <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem("pf-theme")==="light")document.documentElement.dataset.pfTheme="light"}catch(e){}` }} />
      <div className="pf-chrome">
        <TopNav variant="portfolio" />
        {/* not "sticky": on the main site the logo stays put when the bar hides;
            here the whole thing goes, logo included */}
        <NavLogo href="https://www.finbar.studio/" />
      </div>
      <ContactPanel />
      {children}
    </>
  );
}
