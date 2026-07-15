import Nav from "@/components/ross-hogno/Nav";
import PortfolioGrid from "@/components/ross-hogno/sections/PortfolioGrid";
import ViewCursor from "@/components/ross-hogno/ViewCursor";
import SiteFooter from "@/components/ross-hogno/sections/SiteFooter";

export const metadata = {
  title: "Projects · Ross Hogno Constructions",
  description:
    "A selection of award-winning custom homes built by Ross Hogno Constructions across Toowoomba and the Darling Downs.",
};

export default function PortfolioPage() {
  return (
    <main className="bg-white">
      <Nav immediate showLogo />
      <ViewCursor />

      {/* Title — same height as the home hero's white space (80vh) */}
      <section className="min-h-[80vh] flex items-center justify-center">
        <h1
          className="violet text-[var(--ink)] text-5xl md:text-8xl"
          style={{ letterSpacing: "0.04em" }}
        >
          PROJECTS
        </h1>
      </section>

      <PortfolioGrid />

      <SiteFooter />
    </main>
  );
}
