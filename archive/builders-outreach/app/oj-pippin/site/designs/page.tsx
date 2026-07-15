import Nav from "@/components/ojpippin/Nav";
import DesignShowcase from "@/components/ojpippin/sections/DesignShowcase";
import Contact from "@/components/ojpippin/sections/Contact";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";

export const metadata = {
  title: "Home Designs, The Range | OJ Pippin Homes",
  description:
    "Browse the OJ Pippin range, single and double-storey designs from four to five bedrooms, every one adaptable to your block and the way you live.",
};

export default function DesignsPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />

      {/* Hero, Swiss grid, heading bottom-left big, intro offset right */}
      <section className="min-h-[68vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-12 md:gap-8 items-end">
          <h1
            className="md:col-span-4 self-end text-ink font-light leading-[0.95] text-center md:text-left"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
          >
            The <span className="display-italic">range.</span>
          </h1>

          <p className="md:col-span-2 md:col-start-6 self-end text-ink-soft text-lg leading-relaxed text-center md:text-left">
            Single and double-storey homes from four to five bedrooms. Click a
            name to bring its home to the front. Every design bends to your block
            and the way you live.
          </p>
        </div>
      </section>

      {/* Lookbook, names overlaid as the selector */}
      <DesignShowcase />

      <Contact />
      <SiteFooter />
    </main>
  );
}
