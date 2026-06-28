import Image from "next/image";
import Nav from "@/components/david-radic/Nav";
import SiteFooter from "@/components/david-radic/sections/SiteFooter";
import ImageTrail from "@/components/david-radic/ImageTrail";
import ScrollText from "@/components/david-radic/ScrollText";
import CountUp from "@/components/david-radic/CountUp";
import MaskReveal from "@/components/david-radic/MaskReveal";

export const metadata = {
  title: "About · A Gold Coast Family Builder | David Radic Prestige Homes",
  description:
    "David Radic Prestige Homes is a long-standing Gold Coast family business run by David and Natasha Radic, building a limited number of prestige homes each year, hands-on from concept to completion.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-[var(--ink)]">
      <Nav immediate showLogo />

      {/* ── Hero — centred, image trail follows the cursor ────── */}
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
              className="violet text-[var(--ink)] text-4xl md:text-7xl lg:text-8xl leading-[1.04]"
              style={{ letterSpacing: "0.02em" }}
            >
              MAKING YOUR
              <br />
              DREAMS A
              <br />
              REALITY
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── A family business ─────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          A FAMILY
          <br />
          BUSINESS
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            David Radic Prestige Homes is a long-standing Gold Coast family
            business, run by husband-and-wife team David and Natasha Radic.
          </ScrollText>
          <ScrollText>
            From concept to completion, we pride ourselves on excellence, an
            innovative, passionate team with a reputation for delivering at the
            highest level of design.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/david-radic/projects/buccaneer.webp"
              alt="Buccaneer Residence, Gold Coast"
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
            Buccaneer Residence, HIA Finalist
          </MaskReveal>
        </figure>
      </section>

      {/* ── Hands on, every home ──────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          HANDS ON,
          <br />
          EVERY HOME
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            David personally oversees every aspect of your build, conceptualising
            and integrating the unique features that make a home truly custom.
            Natasha keeps it all moving, a driven, organised powerhouse from the
            first meeting to handover.
          </ScrollText>
          <ScrollText>
            The number of homes we build each year is limited, on purpose. It means
            we always have the time to answer your questions, and the personalised,
            hands-on touch is there right from the start.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/david-radic/projects/river.webp"
                alt="River Residence, Mermaid Waters"
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
              River Residence, Mermaid Waters
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── In their words ────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          IN THEIR WORDS
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug tracking-[0.03em]"
          >
            &ldquo;We&rsquo;ve engaged David Radic Prestige to build two of our
            stunning homes, and are about to undergo our third.&rdquo;
          </MaskReveal>
          <p className="violet text-[var(--ink)]/55 text-[10px] tracking-[0.2em] uppercase mt-6">
            Adrienne P, Homeowner
          </p>
        </div>
      </section>

      {/* ── On the Coast ──────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          ON THE COAST
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            For over twenty years, David Radic Prestige Homes has built waterfront
            and island residences across the Gold Coast, from Hope Island and the
            Sovereign Islands to Broadbeach and Mermaid Waters.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 20, suffix: "+", l: "Years on the Coast" },
              { n: 3, suffix: "×", l: "HIA Recognitions" },
            ].map((s, i) => (
              <div key={s.l}>
                <div
                  className="violet text-[var(--ink)] text-3xl md:text-5xl"
                  style={{ letterSpacing: "0.03em" }}
                >
                  <CountUp to={s.n} suffix={s.suffix} delay={i * 0.2} />
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
