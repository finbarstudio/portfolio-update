import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Hero from "@/components/toombul/sections/Hero";
import CollageModern from "@/components/toombul/CollageModern";
import LogoShowcase from "@/components/toombul/LogoShowcase";
import layout from "@/content/toombul-collage.json";
import layoutMobile from "@/content/toombul-collage-mobile.json";
import type { CollagePos } from "@/content/toombulCollage";

// Hero collage (retro bitmap, old crest) -> modern collage (clean, new
// Bulls mark) -> identity showcase (six lockups, crest finale) -> footer.
export default function ToombulHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CollageModern layout={layout as CollagePos[]} layoutMobile={layoutMobile as CollagePos[]} />
        <LogoShowcase />
      </main>
      <Footer />
    </>
  );
}
