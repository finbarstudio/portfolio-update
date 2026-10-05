import TopNav from "@/components/TopNav";
import NavLogo from "@/components/NavLogo";
import ContactPanel from "@/components/ContactPanel";

/**
 * /portfolio sits outside (site), so it brings its own chrome: the site nav
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
        <NavLogo />
      </div>
      <ContactPanel />
      {children}
    </>
  );
}
