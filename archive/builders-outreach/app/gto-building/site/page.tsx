import Nav from "@/components/gto-building/Nav";
import HomeHeader from "@/components/gto-building/sections/HomeHeader";
import FeaturedProjects from "@/components/gto-building/sections/FeaturedProjects";
import SiteFooter from "@/components/gto-building/sections/SiteFooter";
import ViewCursor from "@/components/gto-building/ViewCursor";

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
