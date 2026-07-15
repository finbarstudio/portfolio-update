import Nav from "@/components/ross-hogno/Nav";
import HomeHeader from "@/components/ross-hogno/sections/HomeHeader";
import FeaturedProjects from "@/components/ross-hogno/sections/FeaturedProjects";
import SiteFooter from "@/components/ross-hogno/sections/SiteFooter";
import ViewCursor from "@/components/ross-hogno/ViewCursor";

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
