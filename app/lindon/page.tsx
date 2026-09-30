import Nav from "@/components/lindon/Nav";
import HomeHeader from "@/components/lindon/sections/HomeHeader";
import FeaturedProjects from "@/components/lindon/sections/FeaturedProjects";
import SiteFooter from "@/components/lindon/sections/SiteFooter";
import ViewCursor from "@/components/lindon/ViewCursor";

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
