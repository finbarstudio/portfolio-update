import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import Hero from "@/components/braeden/home/Hero";
import Featured from "@/components/braeden/home/Featured";
import Story from "@/components/braeden/home/Story";
import Awards from "@/components/braeden/home/Awards";
import Voices from "@/components/braeden/home/Voices";
import Contact from "@/components/braeden/home/Contact";
import Footer from "@/components/braeden/home/Footer";

/**
 * Braeden Constructions — the final, cohesive homepage, built from Finbar's picks
 * out of the 6-options chooser (hero image-led / featured offset stack / story
 * sticky-label / proof awards-ledger + word-of-mouth marquee / contact card /
 * footer panel), all harmonised to one system: Montserrat + Quicksand + Space
 * Mono, white/#222/red #E1251B, imagery-led, the card treatments kept to the
 * close so they stay sparing. The chooser components remain in
 * components/braeden/chooser/ for reference.
 */
export default function BraedenHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <Hero />
      <Featured />
      <Story />
      <Awards />
      <Voices />
      <Contact />
      <Footer />
    </main>
  );
}
