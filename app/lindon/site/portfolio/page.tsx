import Nav from "@/components/lindon/Nav";
import PortfolioGrid from "@/components/lindon/sections/PortfolioGrid";
import ViewCursor from "@/components/lindon/ViewCursor";
import SiteFooter from "@/components/lindon/sections/SiteFooter";

export const metadata = {
  title: "Portfolio — Lindon Homes",
  description:
    "A selection of custom homes, knock-down rebuilds and major renovations built by Lindon Homes across South East Queensland.",
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
          PORTFOLIO
        </h1>
      </section>

      <PortfolioGrid />

      <SiteFooter />
    </main>
  );
}
