import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import HeroChoices from "@/components/braeden/home/HeroChoices";
import Featured from "@/components/braeden/home/Featured";
import Story from "@/components/braeden/home/Story";
import Awards from "@/components/braeden/home/Awards";
import Voices from "@/components/braeden/home/Voices";
import Contact from "@/components/braeden/home/Contact";
import Footer from "@/components/braeden/home/Footer";

/**
 * Braeden Constructions homepage.
 *
 * Cohesion comes from a shared design language (one header treatment, the brand
 * tokens, Montserrat/Quicksand/Space Mono, consistent spacing + a consistent
 * scroll reveal) across DISTINCT section layouts, not from carding everything.
 * The hero is offered as three image-led options to choose from; the card panel
 * is reserved for contact + footer; projects are a bento grid.
 */
export default function BraedenHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <HeroChoices />
      <Featured />
      <Story />
      <Awards />
      <Voices />
      <Contact />
      <Footer />
    </main>
  );
}
