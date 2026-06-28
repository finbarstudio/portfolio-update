import Nav from "@/components/gto-building/Nav";
import PortfolioGrid from "@/components/gto-building/sections/PortfolioGrid";
import ViewCursor from "@/components/gto-building/ViewCursor";
import SiteFooter from "@/components/gto-building/sections/SiteFooter";

export const metadata = {
  title: "Projects · GTO Building",
  description:
    "A selection of award-winning, architect-designed homes built by GTO Building across the Sunshine Coast.",
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
