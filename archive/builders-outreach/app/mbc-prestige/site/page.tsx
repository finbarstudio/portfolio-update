import Nav from "@/components/mbc-prestige/Nav";
import HomeHeader from "@/components/mbc-prestige/sections/HomeHeader";
import FeaturedProjects from "@/components/mbc-prestige/sections/FeaturedProjects";
import SiteFooter from "@/components/mbc-prestige/sections/SiteFooter";
import ViewCursor from "@/components/mbc-prestige/ViewCursor";

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
