import Nav from "@/components/qldpools/Nav";
import HomeHeader from "@/components/qldpools/sections/HomeHeader";
import FeaturedProjects from "@/components/qldpools/sections/FeaturedProjects";
import SiteFooter from "@/components/qldpools/sections/SiteFooter";
import ViewCursor from "@/components/qldpools/ViewCursor";

export default function Home() {
  return (
    <main className="bg-white">
      <Nav />
      <ViewCursor />
      <HomeHeader />
      <FeaturedProjects />
      <SiteFooter />
    </main>
  );
}
