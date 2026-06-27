import Nav from "@/components/braeden/Nav";
import ViewCursor from "@/components/braeden/ViewCursor";
import HeroOptions from "@/components/braeden/chooser/HeroOptions";

/**
 * Braeden Constructions homepage — built as a 6-OPTIONS-PER-SECTION CHOOSER.
 *
 * Each section (hero, featured projects, story, proof, contact, footer) stacks
 * six labelled options, each a different display font + colour shift but all
 * within ~20% of Braeden's real DNA (Montserrat/Quicksand, white/#222, red
 * #E1251B, photographic + airy). Finbar names a pick per section; the chosen
 * combination then becomes the style reference for the about + projects pages.
 */

function GroupDivider({ title, note }: { title: string; note: string }) {
  return (
    <section style={{ background: "var(--ink)", color: "#fff", padding: "clamp(40px,7vw,84px) var(--gutter)" }}>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", justifyContent: "space-between", gap: "1rem", maxWidth: 1320, marginInline: "auto" }}>
        <h2 className="ff-mont" style={{ color: "#fff", fontWeight: 800, fontSize: "clamp(28px,4vw,56px)", textTransform: "uppercase", letterSpacing: "0.02em" }}>
          {title} <span style={{ color: "var(--red)" }}>·</span> six options
        </h2>
        <p style={{ color: "rgba(255,255,255,0.66)", fontFamily: "var(--font-quick)", fontSize: 15, maxWidth: "38ch" }}>{note}</p>
      </div>
    </section>
  );
}

export default function BraedenHome() {
  return (
    <main>
      <Nav />
      <ViewCursor />

      <section className="brd-chooser-note">
        <p className="eyebrow" style={{ marginBottom: "1.4em" }}>Braeden Constructions · concept by finbar✶studio</p>
        <h1 className="ff-mont" style={{ fontWeight: 800, fontSize: "clamp(30px,4.4vw,64px)", lineHeight: 1.05, textTransform: "uppercase", letterSpacing: "0.01em", color: "var(--ink)" }}>
          A homepage, six ways<br />per section
        </h1>
        <p className="lead" style={{ marginTop: "1.3em", maxWidth: "52ch" }}>
          Same brand, same red, your own fonts. Each section below shows six directions to choose from. Pick the one you like per section and we build the site around your picks.
        </p>
      </section>

      <GroupDivider title="Hero" note="The opening moment. Photo-led or type-led, but always within one calm viewport." />
      <HeroOptions />
    </main>
  );
}
