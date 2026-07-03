import Nav from "@/components/toombul/Nav";
import Footer from "@/components/toombul/Footer";

// Blank rebuild scaffold: nav + three empty 100vh sections + footer.
// Build each section into #one / #two / #three.
export default function ToombulHome() {
  return (
    <>
      <Nav forceSolid />
      <main>
        <section id="one" className="tc-blank" />
        <section id="two" className="tc-blank" />
        <section id="three" className="tc-blank" />
      </main>
      <Footer />
    </>
  );
}
