import Image from "next/image";
import Nav from "@/components/cal-turner/Nav";
import SiteFooter from "@/components/cal-turner/sections/SiteFooter";
import ImageTrail from "@/components/cal-turner/ImageTrail";
import ScrollText from "@/components/cal-turner/ScrollText";
import CountUp from "@/components/cal-turner/CountUp";
import MaskReveal from "@/components/cal-turner/MaskReveal";

export const metadata = {
  title: "About · Cal Turner Architects",
  description:
    "Cal Turner is a registered architect designing new homes and renovations across Brisbane and Southeast Queensland. Architecture that starts with you.",
};

// The four process cards are Cal's own, word for word, from his About page.
const PROCESS = [
  {
    title: "I visit your site.",
    body: "Every project starts with understanding the place, not just the brief.",
  },
  {
    title: "I listen first.",
    body: "Your lifestyle shapes the design, not the other way around.",
  },
  {
    title: "I stay through construction.",
    body: "Present at key milestones from slab to handover.",
  },
  {
    title: "You work with me.",
    body: "No graduates, no handoffs. Just me, start to finish.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-[var(--ink)]">
      <Nav immediate showLogo />

      {/* ── Hero — Cal's own headline, image trail follows the cursor ────── */}
      <ImageTrail>
        <div className="relative z-10 min-h-[88vh] flex items-center justify-center text-center px-6 pointer-events-none">
          <div data-trail-zone className="relative">
            <div
              aria-hidden
              className="absolute -inset-24 -z-10 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 38%, rgba(255,255,255,0) 72%)",
                filter: "blur(10px)",
              }}
            />
            <h1
              className="violet text-[var(--ink)] text-4xl md:text-7xl lg:text-8xl leading-[1.02]"
              style={{ letterSpacing: "0.02em" }}
            >
              ARCHITECTURE IS
              <br />
              JUST THE
              <br />
              EXCUSE
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── People first ──────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          WHAT I&rsquo;M REALLY
          <br />
          INTERESTED IN
          <br />
          IS PEOPLE
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Growing up on 10 acres outside Toowoomba, Cal was captivated by what
            people could create: the way a well-considered building shapes how
            you feel, how you move through a space, how you live. Architecture
            was always a vehicle for something deeper, a genuine curiosity about
            what a home needs to be for this family, at this point in their lives.
          </ScrollText>
          <ScrollText>
            A Masters in Architecture from the University of Queensland, then 15
            years across almost every corner of residential design: apartments,
            townhouses, prefab housing, and the deeply personal new homes and
            renovations that change how a family experiences daily life.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/cal-turner/projects/peregian-2.webp"
              alt="Peregian House, Peregian Beach"
              fill
              quality={88}
              className="object-cover"
              sizes="(min-width:768px) 60vw, 100vw"
            />
          </MaskReveal>
          <MaskReveal
            as="figcaption"
            start="top 82%"
            delay={0.3}
            className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-3"
          >
            Peregian House · Built by Foundation Homes
          </MaskReveal>
        </figure>
      </section>

      {/* ── A practical lens ──────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          A PRACTICAL
          <br />
          LENS
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            A formative chapter was helping to build and lead the in-house
            architecture team at Mosaic Property Group, one of Brisbane&rsquo;s
            most awarded multi-residential developers. Working inside a
            development and construction business taught Cal to treat design as
            something that has to perform: financially, structurally and on
            program, not just aesthetically.
          </ScrollText>
          <ScrollText>
            Before starting the practice he also ran the Brisbane branch of a
            building design studio, sharing an office with a local builder and
            working closely with homeowners on renovations and extensions.
            Outside the practice, he and his wife have spent a decade buying
            properties and improving them: 5 renovations, 2 subdivisions and 2
            new builds of their own.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/cal-turner/projects/bardon.webp"
                alt="Bardon House"
                fill
                quality={88}
                className="object-cover"
                sizes="(min-width:768px) 60vw, 100vw"
              />
            </MaskReveal>
            <MaskReveal
              as="figcaption"
              start="top 85%"
              delay={0.3}
              className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-3"
            >
              Bardon House
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── How it works — Cal's own four commitments ─────────── */}
      <section className="md:min-h-[70vh] px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet text-2xl md:text-4xl leading-tight mb-14 md:mb-20"
          style={{ letterSpacing: "0.04em" }}
        >
          HOW IT WORKS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {PROCESS.map((c) => (
            <MaskReveal key={c.title} as="div" start="top 85%" className="border-t border-[var(--line)] pt-5">
              <h3 className="violet text-sm md:text-base mb-3" style={{ letterSpacing: "0.06em" }}>
                {c.title.toUpperCase()}
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed text-[var(--ink)]/80">
                {c.body}
              </p>
            </MaskReveal>
          ))}
        </div>
      </section>

      {/* ── What clients say ──────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          WHAT CLIENTS SAY
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug tracking-[0.03em]"
          >
            &ldquo;Big picture thinking is blended with attention to detail.
            Thoughtful, great looking outcomes that consider budget,
            buildability and technical aspects.&rdquo;
          </MaskReveal>
          <p className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-6">
            Chang L. &amp; Peter N. · Clients
          </p>
        </div>
      </section>

      {/* ── The practice today ────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE PRACTICE
          <br />
          TODAY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            From Peregian Beach to Bardon, Red Hill, New Farm and Paddington,
            the practice designs new homes and renovations across Brisbane and
            Southeast Queensland, built with some of the region&rsquo;s best
            builders.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 15, l: "Years in residential design" },
              { n: 9, l: "Personal renos, subdivisions & builds" },
            ].map((s, i) => (
              <div key={s.l}>
                <div
                  className="violet text-[var(--ink)] text-3xl md:text-5xl"
                  style={{ letterSpacing: "0.03em" }}
                >
                  <CountUp to={s.n} delay={i * 0.2} />
                </div>
                <div className="violet text-[var(--ink)]/55 text-[10px] tracking-[0.2em] uppercase mt-2">
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
