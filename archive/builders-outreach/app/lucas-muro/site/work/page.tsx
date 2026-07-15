import Nav from "@/components/lucas-muro/Nav";
import PortfolioGrid from "@/components/lucas-muro/sections/PortfolioGrid";
import ViewCursor from "@/components/lucas-muro/ViewCursor";
import SiteFooter from "@/components/lucas-muro/sections/SiteFooter";

export const metadata = {
  title: "Work · Lucas Muro",
  description:
    "Architecture and interiors photographed by Lucas Muro for architects, designers and builders across Queensland, New South Wales and Victoria.",
};

export default function WorkPage() {
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
          WORK
        </h1>
      </section>

      <PortfolioGrid />

      <SiteFooter />
    </main>
  );
}
