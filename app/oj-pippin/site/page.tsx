import Nav from "@/components/ojpippin/Nav";
import ViewCursor from "@/components/ojpippin/ViewCursor";
import HeroIntro from "@/components/ojpippin/sections/HeroIntro";
import FeaturedProjects from "@/components/ojpippin/sections/FeaturedProjects";
import Contact from "@/components/ojpippin/sections/Contact";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";

export default function Home() {
  return (
    <main className="bg-bone">
      <Nav />
      <ViewCursor />
      <HeroIntro />
      <FeaturedProjects />
      <Contact />
      <SiteFooter />
    </main>
  );
}
