import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import ProjectsHero from "@/components/braeden/projects/ProjectsHero";
import ProjectsGrid from "@/components/braeden/projects/ProjectsGrid";
import SiteFooter from "@/components/braeden/sections/SiteFooter";

export const metadata = {
  title: { absolute: "Projects · Braeden Constructions | Custom Homes, Noosa & the Sunshine Coast" },
};

/**
 * Braeden projects — a listing page modelled on Lows: a tall centred hero (the
 * grid peeks at the bottom as a scroll cue), then the full-bleed crop-up grid of
 * the real photographed homes, closing on the giant-logo footer.
 */
export default function BraedenProjects() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <ProjectsHero />
      <ProjectsGrid />
      <SiteFooter />
    </main>
  );
}
