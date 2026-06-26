import Nav from "@/components/arolley/Nav";
import ViewCursor from "@/components/arolley/ViewCursor";
import EntryReveal from "@/components/arolley/EntryReveal";
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

      {/* Intro — consistent hero treatment + entry stagger */}
      <section className="frame arl-hero">
        <EntryReveal className="flex flex-col items-center">
          <h1 className="display" style={{ fontSize: "var(--step-display)", maxWidth: "16ch" }}>
            A family of builders, four generations <span className="display-italic accent">deep</span>.
          </h1>
          <p className="lead" style={{ marginTop: "clamp(20px,2.6vw,34px)", maxWidth: "50ch", marginInline: "auto" }}>
            For more than 75 years the Rolley family has built things to last, first furniture, then homes.
            Here is how the name made its way to the Sunshine Coast.
          </p>
        </EntryReveal>
      </section>

      <Story />
      <Values />
      <Contact tone="dark" />
      <SiteFooter tone="dark" />
    </main>
  );
}
