import Nav from "@/components/hm-developments/Nav";
import PortfolioGrid from "@/components/hm-developments/sections/PortfolioGrid";
import ViewCursor from "@/components/hm-developments/ViewCursor";
import SiteFooter from "@/components/hm-developments/sections/SiteFooter";

export const metadata = {
  title: "Projects · HM Developments",
  description:
    "A selection of luxury residential and commercial developments by HM Developments across the Sunshine Coast.",
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
