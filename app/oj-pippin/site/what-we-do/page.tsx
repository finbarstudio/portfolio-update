import type { Metadata } from "next";
import Nav from "@/components/ojpippin/Nav";
import ViewCursor from "@/components/ojpippin/ViewCursor";
import Services from "@/components/ojpippin/sections/Services";
import Inclusions from "@/components/ojpippin/sections/Inclusions";
import Process from "@/components/ojpippin/sections/Process";
import WhyUs from "@/components/ojpippin/sections/WhyUs";
import Testimonials from "@/components/ojpippin/sections/Testimonials";
import Contact from "@/components/ojpippin/sections/Contact";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";
import { manifesto } from "@/components/ojpippin/lib/content";

export const metadata: Metadata = {
  title: "What We Do | OJ Pippin Homes",
  description:
    "Custom homes, house & land packages and knockdown rebuilds across South East Queensland, all-inclusive fixed pricing, flexible designs, and a thirty-year family builder behind every key handed over.",
};

export default function WhatWeDoPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />
      <ViewCursor />

      {/* Intro hero, Swiss split: heading top-left (cols 1–5),
          paragraph bottom (cols 4–7), columns deliberately left empty. */}
      <section className="min-h-[88vh] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-16 md:gap-8">
          <h1
            className="md:col-span-5 self-start font-light leading-[1.02]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            Everything it takes
            <br />
            to build a home 
            <br />
            and <span className="display-italic">nothing</span> you
            <br />
            didn&rsquo;t ask for.
          </h1>

          <p className="md:col-span-4 md:col-start-4 self-end text-ink-soft text-lg leading-relaxed">
            {manifesto.body}
          </p>
        </div>
      </section>

      <Services />
      <Inclusions />
      <Process />
      <WhyUs />
      <Testimonials />
      <Contact />
      <SiteFooter />
    </main>
  );
}
