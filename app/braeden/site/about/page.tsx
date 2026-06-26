import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import Story from "@/components/braeden/sections/Story";
import Values from "@/components/braeden/sections/Values";
import Contact from "@/components/braeden/sections/Contact";
import SiteFooter from "@/components/braeden/sections/SiteFooter";

export const metadata = {
  title: { absolute: "About | A Rolley & Sons · Four Generations on the Sunshine Coast" },
};

export default function BraedenAbout() {
  return (
    <main>
      <Nav />
      <ViewCursor />

      {/* Intro — centred, fits ~one viewport */}
      <section className="frame flex flex-col items-center justify-center text-center" style={{ minHeight: "82svh", paddingTop: "clamp(104px,13vh,150px)", paddingBottom: "clamp(40px,6vw,72px)" }}>
        <h1 className="display" style={{ fontSize: "var(--step-display)", maxWidth: "16ch" }}>
          A family of builders, four generations <span className="display-italic accent">deep</span>.
        </h1>
        <p className="lead" style={{ marginTop: "clamp(20px,2.6vw,34px)", maxWidth: "50ch", marginInline: "auto" }}>
          For more than 75 years the Rolley family has built things to last, first furniture, then homes.
          Here is how the name made its way to the Sunshine Coast.
        </p>
      </section>

      <Story />
      <Values />
      <Contact />
      <SiteFooter />
    </main>
  );
}
