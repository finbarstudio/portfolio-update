import Nav from "@/components/david-radic/Nav";
import HomeHeader from "@/components/david-radic/sections/HomeHeader";
import FeaturedProjects from "@/components/david-radic/sections/FeaturedProjects";
import SiteFooter from "@/components/david-radic/sections/SiteFooter";
import ViewCursor from "@/components/david-radic/ViewCursor";

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
