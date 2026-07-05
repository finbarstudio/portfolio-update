import Nav from "@/components/cal-turner/Nav";
import PortfolioGrid from "@/components/cal-turner/sections/PortfolioGrid";
import ViewCursor from "@/components/cal-turner/ViewCursor";
import SiteFooter from "@/components/cal-turner/sections/SiteFooter";

export const metadata = {
  title: "Projects · Cal Turner Architects",
  description:
    "New homes and renovations designed by Cal Turner Architects across Brisbane, the Sunshine Coast and Southeast Queensland.",
};

export default function ProjectsPage() {
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
