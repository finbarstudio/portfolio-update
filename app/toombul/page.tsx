import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Hero from "@/components/toombul/sections/Hero";
import Statement from "@/components/toombul/sections/Statement";
import Lineage from "@/components/toombul/sections/Lineage";
import FutureBand from "@/components/toombul/sections/FutureBand";

// The home page is deliberately spare: hero monument, one statement, the
// lineage, one look forward. Grades / community / sponsors / merch live on
// their own pages (/toombul/club, /toombul/merch).
export default function ToombulHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Statement />
        <Lineage />
        <FutureBand />
      </main>
      <Footer />
    </>
  );
}
