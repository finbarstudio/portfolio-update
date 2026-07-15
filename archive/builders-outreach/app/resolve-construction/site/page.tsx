import Nav from "@/components/resolve-construction/Nav";
import HomeHeader from "@/components/resolve-construction/sections/HomeHeader";
import FeaturedProjects from "@/components/resolve-construction/sections/FeaturedProjects";
import SiteFooter from "@/components/resolve-construction/sections/SiteFooter";
import ViewCursor from "@/components/resolve-construction/ViewCursor";

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
