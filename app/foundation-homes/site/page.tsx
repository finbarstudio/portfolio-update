import Nav from "@/components/foundation-homes/Nav";
import HomeHeader from "@/components/foundation-homes/sections/HomeHeader";
import FeaturedProjects from "@/components/foundation-homes/sections/FeaturedProjects";
import SiteFooter from "@/components/foundation-homes/sections/SiteFooter";
import ViewCursor from "@/components/foundation-homes/ViewCursor";

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
