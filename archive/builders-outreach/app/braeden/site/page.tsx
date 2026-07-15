import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import Hero from "@/components/braeden/home/Hero";
import Featured from "@/components/braeden/home/Featured";
import Story from "@/components/braeden/home/Story";
import Voices from "@/components/braeden/home/Voices";
import Footer from "@/components/braeden/home/Footer";

/**
 * Braeden Constructions homepage — Lindon-style: minimal, type-led, imagery-led.
 * A wordmark + awards hero on white, the work in a full-bleed parallax showcase,
 * two quiet type-led bands (story + a client voice), and the signature giant
 * BRAEDEN wordmark footer. No grids, no cards. Contact lives in the footer.
 */
export default function BraedenHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />
      <Hero />
      <Story />
      <Featured />
      <Voices />
      <Footer />
    </main>
  );
}
