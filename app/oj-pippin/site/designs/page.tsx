import Nav from "@/components/ojpippin/Nav";
import ViewCursor from "@/components/ojpippin/ViewCursor";
import DesignShowcase from "@/components/ojpippin/sections/DesignShowcase";
import Contact from "@/components/ojpippin/sections/Contact";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";
import { designIndex } from "@/components/ojpippin/lib/content";

export const metadata = {
  title: "Home Designs, The Range | OJ Pippin Homes",
  description:
    "Browse the OJ Pippin range, single and double-storey designs from four to five bedrooms, every one adaptable to your block and the way you live.",
};

/* Asymmetric Swiss placement per index item, varied column, span and
   vertical alignment so the grid reads like a considered poster, never a list.
   Deliberate empty cells fall out of the gaps between these. */
const cells = [
  "md:col-span-2 md:col-start-1 self-start",
  "md:col-span-2 md:col-start-4 self-end",
  "md:col-span-2 md:col-start-6 self-start",
  "md:col-span-2 md:col-start-2 self-end",
  "md:col-span-2 md:col-start-5 self-start",
  "md:col-span-2 md:col-start-1 self-end",
  "md:col-span-2 md:col-start-3 self-start",
  "md:col-span-2 md:col-start-6 self-end",
];

export default function DesignsPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />
      <ViewCursor />

      {/* Hero, Swiss grid, heading bottom-left big, intro offset right. No eyebrow. */}
      <section className="min-h-[70vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-12 md:gap-8 items-end">
          <h1
            className="md:col-span-4 self-end text-ink font-light leading-[0.95]"
            style={{ fontSize: "clamp(3rem, 9vw, 8rem)" }}
          >
            The <span className="display-italic">range.</span>
          </h1>

          <p className="md:col-span-2 md:col-start-6 self-end text-ink-soft text-lg leading-relaxed">
            Single and double-storey homes from four to five bedrooms, each one a
            starting point. Move a wall, change a facade, plan for two generations.
            Every design bends to your block and the way you live.
          </p>
        </div>
      </section>

      {/* Lookbook, full-bleed component, left as-is */}
      <DesignShowcase />

      {/* Full index, bg-bone-2, Swiss grid-cols-7. Heading sticky beside scattered names.
          No eyebrow, no border-t dividers, whitespace separates. */}
      <section className="min-h-screen flex flex-col justify-center bg-bone-2 px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-16 md:gap-x-8">
          {/* Heading column, sticky, holds while names scroll past */}
          <h2
            className="md:col-span-3 md:sticky md:top-28 md:self-start text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            Eight designs,
            <br />
            endlessly{" "}
            <span className="display-italic">adaptable.</span>
          </h2>

          {/* Names, sub-grid, scattered with varied alignment and empty cells */}
          <ul className="md:col-span-4 md:col-start-4 grid grid-cols-1 md:grid-cols-6 gap-x-8 gap-y-20 md:gap-y-28">
            {designIndex.map((d, i) => (
              <li key={d.name} className={`group flex flex-col gap-2 ${cells[i]}`}>
                <span
                  className="display text-ink font-light leading-none group-hover:text-clay transition-colors"
                  style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}
                >
                  {d.name}
                </span>
                <span className="text-[13px] text-olive tabular-nums tracking-wide">
                  {d.beds} bed · {d.baths} bath
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Contact />
      <SiteFooter />
    </main>
  );
}
