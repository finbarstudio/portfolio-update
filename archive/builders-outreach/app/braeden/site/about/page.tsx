import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import AboutContent from "@/components/braeden/about/AboutContent";
import SiteFooter from "@/components/braeden/sections/SiteFooter";

export const metadata = {
  title: { absolute: "About · Braeden Constructions | Mick Devlin, Custom Homes Noosa" },
};

/**
 * Braeden about — magazine treatment, real story (Mick Devlin, est. 1996). The
 * old page was a stale A Rolley four-generations clone; replaced wholesale.
 */
export default function BraedenAbout() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <AboutContent />
      <SiteFooter />
    </main>
  );
}
