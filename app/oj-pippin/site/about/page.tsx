import Image from "next/image";
import Nav from "@/components/ojpippin/Nav";
import SiteFooter from "@/components/ojpippin/sections/SiteFooter";
import ScrollText from "@/components/ojpippin/ScrollText";
import CountUp from "@/components/ojpippin/CountUp";
import MaskReveal from "@/components/ojpippin/MaskReveal";
import ImageTrail from "@/components/ojpippin/ImageTrail";
import { manifesto } from "@/components/ojpippin/lib/content";

export const metadata = {
  title: "Our Story, Family-Run Since 1994 | OJ Pippin Homes",
  description:
    "Thirty years building across Brisbane and South East Queensland. The story of OJ Pippin Homes, still family-run, still building to one standard.",
};

export default function AboutPage() {
  return (
    <main className="bg-bone text-ink">
      <Nav immediate showLogo />

      {/* Hero — statement bottom-left, animated arrow bottom-right */}
      <section className="relative min-h-screen flex items-end px-6 md:px-16 lg:px-24 pb-24 md:pb-32 pt-32">
        <h1
          className="w-full max-w-5xl text-ink font-light leading-[0.98] text-center md:text-left"
          style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)" }}
        >
          Thirty years on, the same family still{" "}
          <span className="display-italic">answers the phone.</span>
        </h1>
        <a
          href="#story"
          aria-label="Scroll down"
          className="hidden md:block absolute bottom-24 right-16 lg:right-24 text-ink"
          style={{ animation: "arrowBob 1.9s ease-in-out infinite" }}
        >
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4 V20 M6 14 L12 20 L18 14" />
          </svg>
        </a>
      </section>

      {/* 1994 — sticky label + continuous colour-fill */}
      <section id="story" className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-y-8 md:gap-8">
          <h2 className="md:col-span-1 md:sticky md:top-28 md:self-start text-olive font-light text-2xl md:text-3xl text-center md:text-left">
            1994
          </h2>
          <ScrollText
            as="div"
            className="md:col-span-3 md:col-start-2 space-y-8 text-2xl md:text-4xl font-light leading-[1.32] tracking-[-0.01em] text-center md:text-left"
          >
            <p>
              It began with one builder, one ute and a single promise: quote a
              fair price, then hold it. No surprises at the end, no fine print to
              read twice.
            </p>
            <p>
              Word travelled the way it does in a good suburb. One family told
              another, and the work grew because the homes stood up and the
              handshakes held.
            </p>
          </ScrollText>
        </div>
      </section>

      {/* First image — clip mask reveal */}
      <section className="px-6 md:px-16 lg:px-24 py-10 md:py-16">
        <MaskReveal direction="left" duration={1.9} start="top 68%" className="relative aspect-[16/9] w-full bg-ink/5">
          <Image
            src="/oj-pippin/homes/facade-monaco.jpg"
            alt="An OJ Pippin home in Brisbane"
            fill
            quality={88}
            className="object-cover"
            sizes="100vw"
          />
        </MaskReveal>
      </section>

      {/* The way we build — body + image cropped to the text's height */}
      <section className="min-h-[80vh] flex flex-col justify-center px-6 md:px-16 lg:px-24 py-24 md:py-32">
        <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-y-12 md:gap-8 items-stretch">
          <div className="md:col-span-3 text-center md:text-left">
            <h2 className="text-olive font-light text-2xl md:text-3xl mb-8">
              The way we build
            </h2>
            <ScrollText
              as="div"
              className="space-y-8 text-2xl md:text-4xl font-light leading-[1.32] tracking-[-0.01em] max-w-2xl mx-auto md:mx-0"
            >
              <p>
                Everything you would expect to pay extra for is already in the
                price. Stone benchtops, ducted air, real flooring, a proper
                kitchen.
              </p>
              <p>
                The same trusted trades come back job after job, which is why the
                thousandth home is finished to the standard of the first.
              </p>
            </ScrollText>
          </div>
          <div className="md:col-span-2 md:col-start-4 flex">
            <MaskReveal direction="right" duration={1.9} start="top 68%" className="relative w-full min-h-[24rem] bg-ink/5">
              <Image
                src="/oj-pippin/homes/interior-living.jpg"
                alt="Inside an OJ Pippin home"
                fill
                quality={88}
                className="object-cover"
                sizes="(min-width:768px) 38vw, 100vw"
              />
            </MaskReveal>
          </div>
        </div>
      </section>

      {/* Pull quote — centred, images trail the cursor on hover */}
      <section className="px-6 md:px-16 lg:px-24 py-12 md:py-20">
        <ImageTrail>
          <div className="relative z-10 min-h-[58vh] flex items-center justify-center text-center pointer-events-none">
            <blockquote
              data-trail-zone
              className="display-italic text-ink leading-[1.08] max-w-4xl"
              style={{ fontSize: "clamp(2rem, 5.4vw, 4.6rem)" }}
            >
              &ldquo;We have never wanted to be the biggest builder in Brisbane.
              Just the one a family would recommend to another.&rdquo;
            </blockquote>
          </div>
        </ImageTrail>
      </section>

      {/* Heritage figures — centred, generous space before the footer */}
      <section className="flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-24 pt-24 md:pt-32 pb-40 md:pb-56">
        <h2
          className="text-ink font-light leading-[1.04]"
          style={{ fontSize: "clamp(2.6rem, 6vw, 5rem)" }}
        >
          A thousand homes <span className="display-italic">on.</span>
        </h2>
        <div className="mt-16 md:mt-24 flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-16 lg:gap-24">
          {manifesto.stats.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <div
                className="text-ink font-light leading-none tabular-nums"
                style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
              >
                <CountUp to={s.value} suffix={s.suffix} />
              </div>
              <div className="text-ink-soft text-sm md:text-base">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
