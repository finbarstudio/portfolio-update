import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Hero from "@/components/toombul/sections/Hero";
import CollageModern from "@/components/toombul/CollageModern";
import LogoGrid from "@/components/toombul/LogoGrid";
import layout from "@/content/toombul-collage.json";
import layoutMobile from "@/content/toombul-collage-mobile.json";
import type { CollagePos } from "@/content/toombulCollage";

// Hero collage (retro bitmap, old crest) -> modern collage (clean, new
// Bulls mark) -> identity grid (six lockups) -> footer.
export default function ToombulHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CollageModern layout={layout as CollagePos[]} layoutMobile={layoutMobile as CollagePos[]} />
        <LogoGrid />
      </main>
      <Footer />
    </>
  );
}
