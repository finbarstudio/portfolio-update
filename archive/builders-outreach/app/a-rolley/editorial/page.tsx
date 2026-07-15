import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import Hero from "@/components/arolley/sections/Hero";
import FeaturedProjects from "@/components/arolley/sections/FeaturedProjects";
import Heritage from "@/components/arolley/sections/Heritage";
import Testimonials from "@/components/arolley/sections/Testimonials";
import Contact from "@/components/arolley/sections/Contact";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

const BASE = "/a-rolley/editorial";

export default function ARolleyEditorialHome() {
  return (
    <main>
      <Nav base={BASE} />
      <ViewCursor />
      <Hero />
      <FeaturedProjects base={BASE} />
      <Heritage />
      <Testimonials />
      <Contact />
      <SiteFooter base={BASE} />
    </main>
  );
}
