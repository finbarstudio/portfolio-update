import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Hero from "@/components/toombul/sections/Hero";
import CollageModern from "@/components/toombul/CollageModern";
import layout from "@/content/toombul-collage.json";
import type { CollagePos } from "@/content/toombulCollage";

// Hero collage (retro bitmap, old crest) -> modern collage (clean, new
// Bulls mark) -> one blank section -> footer.
export default function ToombulHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CollageModern layout={layout as CollagePos[]} />
        <section id="three" className="tc-blank" />
      </main>
      <Footer />
    </>
  );
}
