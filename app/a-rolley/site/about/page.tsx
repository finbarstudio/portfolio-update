import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import Story from "@/components/arolley/sections/Story";
import Values from "@/components/arolley/sections/Values";
import Contact from "@/components/arolley/sections/Contact";
import SiteFooter from "@/components/arolley/sections/SiteFooter";

export const metadata = {
  title: { absolute: "About | A Rolley & Sons · Four Generations on the Sunshine Coast" },
};

export default function ARolleyAbout() {
  return (
    <main>
      <Nav />
      <ViewCursor />

      {/* Intro */}
      <section className="frame" style={{ paddingTop: "clamp(128px,18vh,200px)", paddingBottom: "clamp(40px,6vw,80px)" }}>
        <div className="wrap">
          <hr className="rule" />
          <h1 className="display" style={{ fontSize: "var(--step-display)", marginTop: "clamp(18px,2.4vw,34px)", maxWidth: "16ch" }}>
            A family of builders, four generations <span className="display-italic accent">deep</span>.
          </h1>
          <p className="lead" style={{ marginTop: "clamp(24px,3vw,40px)", maxWidth: "52ch" }}>
            For more than 75 years the Rolley family has built things to last, first furniture, then homes.
            Here is how the name made its way to the Sunshine Coast.
          </p>
        </div>
      </section>

      <Story />
      <Values />
      <Contact />
      <SiteFooter />
    </main>
  );
}
