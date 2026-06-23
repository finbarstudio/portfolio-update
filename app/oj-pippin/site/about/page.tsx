import Image from "next/image";
import Nav from "@/components/ojpippin/Nav";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";
import ScrollText from "@/components/ojpippin/ScrollText";
import CountUp from "@/components/ojpippin/CountUp";
import MaskReveal from "@/components/ojpippin/MaskReveal";
import { company, manifesto } from "@/components/ojpippin/lib/content";

export const metadata = {
  title: "Our Story, Family-Run Since 1994 | OJ Pippin Homes",
  description:
    "Thirty years building across Brisbane and South East Queensland. The story of OJ Pippin Homes, still family-run, still building to one standard.",
};

export default function AboutPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />

      {/* Hero, centred heritage statement */}
      <section className="min-h-screen flex flex-col justify-center items-center text-center px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <h1
          className="text-ink font-light leading-[0.98] max-w-5xl"
          style={{ fontSize: "clamp(2.6rem, 7vw, 6.5rem)" }}
        >
          Over <CountUp to={company.years} /> years of{" "}
          <span className="display-italic">Brisbane</span> homes.
        </h1>
        <p className="mt-10 text-ink-soft text-lg max-w-xl leading-relaxed">
          One family, one standard, since {company.established}. This is how it
          started, and why it hasn&rsquo;t changed.
        </p>
      </section>

      {/* Where it started, sticky heading + scrolling body */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-12 md:gap-8">
          <h2
            className="md:col-span-2 md:sticky md:top-28 md:self-start text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            Where it <span className="display-italic">started</span>
          </h2>

          <div className="md:col-span-4 md:col-start-4 space-y-10 text-lg md:text-xl text-ink-soft leading-relaxed">
            <ScrollText>
              OJ Pippin Homes began in 1994 in Brisbane&rsquo;s north, with one
              builder, one ute and a simple promise: quote a fair price, then
              hold it. No surprises at the end, no fine print to read twice.
            </ScrollText>
            <ScrollText>
              Word travelled the way it does in a good suburb, one family told
              another. The work grew because the homes stood up and the
              handshakes held. Thirty years later, we still run the business by
              the same rule.
            </ScrollText>
          </div>
        </div>
      </section>

      {/* Full-width image */}
      <section className="px-8 md:px-16 lg:px-24 py-12 md:py-20">
        <MaskReveal className="relative aspect-[16/9] w-full bg-ink/5">
          <Image
            src="/oj-pippin/homes/facade-monaco.jpg"
            alt="The Monaco facade, an OJ Pippin home in Brisbane"
            fill
            quality={88}
            className="object-cover"
            sizes="100vw"
          />
        </MaskReveal>
      </section>

      {/* The way we build, body + side image */}
      <section className="min-h-screen flex flex-col justify-center bg-bone-2 px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-12 md:gap-8 items-stretch">
          <div className="md:col-span-4 flex flex-col justify-between gap-12">
            <h2
              className="text-ink font-light leading-[1.0]"
              style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
            >
              The way we <span className="display-italic">build</span>
            </h2>

            <div className="space-y-10 text-lg md:text-xl text-ink-soft leading-relaxed md:max-w-xl">
              <ScrollText>
                Everything you&rsquo;d expect to pay extra for is already in the
                price, stone benchtops, ducted air, real flooring, a proper
                kitchen. We call it turn-key because the day we hand over the
                keys, the home is genuinely finished.
              </ScrollText>
              <ScrollText>
                We use the same trusted trades from one job to the next, which
                is why the finish looks the same in the thousandth home as it
                did in the first. And our designs flex: move a wall, add a
                bedroom, plan for two generations under one roof.
              </ScrollText>
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-6 md:self-end">
            <MaskReveal
              direction="right"
              className="relative aspect-[3/4] w-full bg-ink/5"
            >
              <Image
                src="/oj-pippin/homes/interior-living.jpg"
                alt="Interior of an OJ Pippin home"
                fill
                quality={88}
                className="object-cover"
                sizes="(min-width:768px) 28vw, 100vw"
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* Pull quote */}
      <section className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-8">
          <blockquote
            className="md:col-span-6 display-italic text-ink leading-[1.06]"
            style={{ fontSize: "clamp(2rem, 5.4vw, 4.6rem)" }}
          >
            The name on the contract still answers the phone. After thirty
            years, that&rsquo;s the part we&rsquo;re{" "}
            <span className="text-clay">proudest</span> of.
          </blockquote>
        </div>
      </section>

      {/* A thousand homes on, scattered Swiss stats */}
      <section className="min-h-screen flex flex-col justify-center bg-bone-2 px-8 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-7 gap-y-16 md:gap-x-8 md:gap-y-24">
          <h2
            className="md:col-span-3 md:self-start text-ink font-light leading-[1.0]"
            style={{ fontSize: "clamp(2.6rem, 6vw, 5.5rem)" }}
          >
            A thousand <span className="display-italic">homes</span> on
          </h2>

          {/* Stat 1, top right */}
          <div className="md:col-span-2 md:col-start-6 md:self-start flex flex-col gap-3">
            <div
              className="text-ink font-light leading-none tabular-nums"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              <CountUp
                to={manifesto.stats[0].value}
                suffix={manifesto.stats[0].suffix}
              />
            </div>
            <div className="text-ink-soft text-sm md:text-base">
              {manifesto.stats[0].label}
            </div>
          </div>

          {/* Stat 2, lower, larger, starts column 2 */}
          <div className="md:col-span-3 md:col-start-2 md:self-end flex flex-col gap-3">
            <div
              className="text-ink font-light leading-none tabular-nums"
              style={{ fontSize: "clamp(3.4rem, 9vw, 8rem)" }}
            >
              <CountUp
                to={manifesto.stats[1].value}
                suffix={manifesto.stats[1].suffix}
              />
            </div>
            <div className="text-ink-soft text-sm md:text-base">
              {manifesto.stats[1].label}
            </div>
          </div>

          {/* Stat 3, bottom right, lifted */}
          <div className="md:col-span-2 md:col-start-6 md:self-end flex flex-col gap-3">
            <div
              className="text-ink font-light leading-none tabular-nums"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              <CountUp
                to={manifesto.stats[2].value}
                suffix={manifesto.stats[2].suffix}
              />
            </div>
            <div className="text-ink-soft text-sm md:text-base">
              {manifesto.stats[2].label}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
