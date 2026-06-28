import Image from "next/image";
import Nav from "@/components/foundation-homes/Nav";
import SiteFooter from "@/components/foundation-homes/sections/SiteFooter";
import ImageTrail from "@/components/foundation-homes/ImageTrail";
import ScrollText from "@/components/foundation-homes/ScrollText";
import CountUp from "@/components/foundation-homes/CountUp";
import MaskReveal from "@/components/foundation-homes/MaskReveal";

export const metadata = {
  title: "About · Design-led Custom Homes | Foundation Homes",
  description:
    "Foundation Homes builds award-winning, custom-designed homes across the Sunshine Coast and Noosa, led by Edward Murphy and built alongside the coast's best architects.",
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
              className="violet text-[var(--ink)] text-4xl md:text-7xl lg:text-8xl leading-[1.02]"
              style={{ letterSpacing: "0.02em" }}
            >
              BUILT ON A
              <br />
              SOLID
              <br />
              FOUNDATION
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── Our approach ──────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          OUR APPROACH
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Foundation Homes began out of a simple desire: to give people
            building a home more flexibility and more choice. Every home is
            custom, designed from scratch around how you actually want to live.
          </ScrollText>
          <ScrollText>
            Edward Murphy leads each build from the first sketch through to
            handover. That close attention to the details most builders skip is
            what sets the work apart.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/foundation-homes/projects/amani-palace.webp"
              alt="Amani Palace, Sunshine Coast"
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
            Amani Palace, Sunshine Coast
          </MaskReveal>
        </figure>
      </section>

      {/* ── The right people in the room ──────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE RIGHT PEOPLE
          <br />
          IN THE ROOM
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            Great homes start with great design. Foundation builds alongside some
            of the coast&rsquo;s most respected architects and designers,
            including Aboda Design Group, Aspect Architecture, Cal Turner
            Architects, Reitsma and Associates and Adrian Ramsay Design House.
          </ScrollText>
          <ScrollText>
            You know what you like. We know how to make it work, and how to build
            it to a standard that lasts.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/foundation-homes/projects/barnes-residence.webp"
                alt="Barnes Residence, Buderim"
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
              Barnes Residence, Buderim
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── The standard ──────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE STANDARD
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug tracking-[0.03em]"
          >
            &ldquo;We build unique, custom-designed, luxury homes on a solid
            foundation of the highest-quality workmanship and stringent attention
            to detail.&rdquo;
          </MaskReveal>
        </div>
      </section>

      {/* ── Foundation today ──────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          FOUNDATION
          <br />
          TODAY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            From Doonan and Noosa to Buderim and Maleny, Foundation has built some
            of the Sunshine Coast&rsquo;s most awarded custom homes, including the
            2017 Queensland Custom Home of the Year.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 6, l: "Master Builders Awards" },
              { n: 5, l: "Design Partners" },
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
