import Nav from "@/components/lucas-muro/Nav";
import HomeHeader from "@/components/lucas-muro/sections/HomeHeader";
import FeaturedProjects from "@/components/lucas-muro/sections/FeaturedProjects";
import SiteFooter from "@/components/lucas-muro/sections/SiteFooter";
import ViewCursor from "@/components/lucas-muro/ViewCursor";

export default function Home() {
  return (
    <main className="bg-white">
      <Nav showLogo />
      <ViewCursor />
      <HomeHeader />
      <FeaturedProjects />
      <SiteFooter />
    </main>
  );
}
