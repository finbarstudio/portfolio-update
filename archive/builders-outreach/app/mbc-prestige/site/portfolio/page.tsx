import Nav from "@/components/mbc-prestige/Nav";
import PortfolioGrid from "@/components/mbc-prestige/sections/PortfolioGrid";
import ViewCursor from "@/components/mbc-prestige/ViewCursor";
import SiteFooter from "@/components/mbc-prestige/sections/SiteFooter";

export const metadata = {
  title: "Projects · MBC Prestige",
  description:
    "A selection of boutique luxury apartments and prestige land releases by MBC Prestige across Noosa and the Sunshine Coast.",
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
