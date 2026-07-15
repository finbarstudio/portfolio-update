import Nav from "@/components/ojpippin/Nav";
import Services from "@/components/ojpippin/sections/Services";
import Inclusions from "@/components/ojpippin/sections/Inclusions";
import Process from "@/components/ojpippin/sections/Process";
import WhyUs from "@/components/ojpippin/sections/WhyUs";
import Testimonials from "@/components/ojpippin/sections/Testimonials";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";

export const metadata = {
  title: "What We Do | OJ Pippin Homes",
  description:
    "Custom homes, house and land packages and knockdown rebuilds across South East Queensland. All-inclusive fixed pricing, flexible designs, and a thirty-year family builder behind every key.",
};

export default function WhatWeDoPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />

      {/* Hero, centred */}
      <section className="min-h-[72vh] flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <h1
          className="text-ink font-light leading-[1.02] max-w-4xl"
          style={{ fontSize: "clamp(2.8rem, 7vw, 6rem)" }}
        >
          Everything, <span className="display-italic">under one roof.</span>
        </h1>
        <p className="text-ink-soft text-lg md:text-xl leading-relaxed max-w-2xl mt-8">
          One team and one contract, from the first sketch to the day you turn
          the key. Whatever the brief, the block or the budget, we build it.
        </p>
      </section>

      <Services />
      <Inclusions />
      <Process />
      <WhyUs />
      <Testimonials />
      <SiteFooter />
    </main>
  );
}
