import Nav from "@/components/bppd/Nav";
import HomeHeader from "@/components/bppd/sections/HomeHeader";
import Story from "@/components/bppd/sections/Story";
import SiteFooter from "@/components/bppd/sections/SiteFooter";

export default function Home() {
  return (
    <main className="bg-white">
      <Nav showLogo />
      <HomeHeader />
      <Story />
      <SiteFooter />
    </main>
  );
}
