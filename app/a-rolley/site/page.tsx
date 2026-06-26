import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import HeroA from "@/components/arolley/sections/HeroA";
import HeroB from "@/components/arolley/sections/HeroB";
import HeroC from "@/components/arolley/sections/HeroC";
import HeroD from "@/components/arolley/sections/HeroD";
import HeroE from "@/components/arolley/sections/HeroE";
import FeaturedProjects from "@/components/arolley/sections/FeaturedProjects";
import Heritage from "@/components/arolley/sections/Heritage";
import Testimonials from "@/components/arolley/sections/Testimonials";
import Contact from "@/components/arolley/sections/Contact";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

export default function ARolleyHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      {/* Hero chooser — five reference-led options stacked. Pick one and I'll keep it. */}
      <HeroA />
      <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      <HeroB />
      <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      <HeroC />
      <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      <HeroD />
      <hr className="rule" style={{ marginInline: "var(--gutter)" }} />
      <HeroE />
      <FeaturedProjects />
      <Heritage />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </main>
  );
}
