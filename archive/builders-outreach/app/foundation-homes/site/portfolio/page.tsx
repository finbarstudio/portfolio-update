import Nav from "@/components/foundation-homes/Nav";
import PortfolioGrid from "@/components/foundation-homes/sections/PortfolioGrid";
import ViewCursor from "@/components/foundation-homes/ViewCursor";
import SiteFooter from "@/components/foundation-homes/sections/SiteFooter";

export const metadata = {
  title: "Projects · Foundation Homes",
  description:
    "A selection of award-winning custom homes, renovations and alterations built by Foundation Homes across the Sunshine Coast and Noosa.",
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
