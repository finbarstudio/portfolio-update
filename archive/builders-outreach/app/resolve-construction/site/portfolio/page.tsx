import Nav from "@/components/resolve-construction/Nav";
import PortfolioGrid from "@/components/resolve-construction/sections/PortfolioGrid";
import ViewCursor from "@/components/resolve-construction/ViewCursor";
import SiteFooter from "@/components/resolve-construction/sections/SiteFooter";

export const metadata = {
  title: "Projects · Resolve Construction",
  description:
    "A selection of award-winning prestige and custom homes built by Resolve Construction across the Gold Coast.",
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
