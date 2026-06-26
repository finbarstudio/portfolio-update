import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import Hero from "@/components/braeden/sections/Hero";
import FeaturedProjects from "@/components/braeden/sections/FeaturedProjects";
import Heritage from "@/components/braeden/sections/Heritage";
import Testimonials from "@/components/braeden/sections/Testimonials";
import Contact from "@/components/braeden/sections/Contact";
import SiteFooter from "@/components/braeden/sections/SiteFooter";

export default function BraedenHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <Hero />
      <FeaturedProjects />
      <Heritage />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </main>
  );
}
