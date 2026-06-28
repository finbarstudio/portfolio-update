import Nav from "@/components/david-radic/Nav";
import PortfolioGrid from "@/components/david-radic/sections/PortfolioGrid";
import ViewCursor from "@/components/david-radic/ViewCursor";
import SiteFooter from "@/components/david-radic/sections/SiteFooter";

export const metadata = {
  title: "Our Homes · David Radic Prestige Homes",
  description:
    "A selection of award-winning waterfront and prestige homes built by David Radic Prestige Homes across the Gold Coast.",
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
          OUR HOMES
        </h1>
      </section>

      <PortfolioGrid />

      <SiteFooter />
    </main>
  );
}
