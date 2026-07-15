import Nav from "@/components/cal-turner/Nav";
import HomeHeader from "@/components/cal-turner/sections/HomeHeader";
import FeaturedProjects from "@/components/cal-turner/sections/FeaturedProjects";
import SiteFooter from "@/components/cal-turner/sections/SiteFooter";
import ViewCursor from "@/components/cal-turner/ViewCursor";

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
