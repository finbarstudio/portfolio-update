import Nav from "@/components/hm-developments/Nav";
import HomeHeader from "@/components/hm-developments/sections/HomeHeader";
import FeaturedProjects from "@/components/hm-developments/sections/FeaturedProjects";
import SiteFooter from "@/components/hm-developments/sections/SiteFooter";
import ViewCursor from "@/components/hm-developments/ViewCursor";

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
