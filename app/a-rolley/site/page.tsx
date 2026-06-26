import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import Hero from "@/components/arolley/sections/Hero";
import FeaturedProjects from "@/components/arolley/sections/FeaturedProjects";
import Expertise from "@/components/arolley/sections/Expertise";
import Heritage from "@/components/arolley/sections/Heritage";
import Testimonials from "@/components/arolley/sections/Testimonials";
import Contact from "@/components/arolley/sections/Contact";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

export default function ARolleyHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <Hero />
      <FeaturedProjects />
      <Expertise />
      <Heritage />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </main>
  );
}
