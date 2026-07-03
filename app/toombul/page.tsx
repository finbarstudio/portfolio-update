import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";
import Hero from "@/components/toombul/sections/Hero";

// Rebuild: hero collage + two blank 100vh sections + footer.
export default function ToombulHome() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <section id="two" className="tc-blank" />
        <section id="three" className="tc-blank" />
      </main>
      <Footer />
    </>
  );
}
