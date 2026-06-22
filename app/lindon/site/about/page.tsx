import Image from "next/image";
import Nav from "@/components/lindon/Nav";
import SiteFooter from "@/components/lindon/sections/SiteFooter";
import ImageTrail from "@/components/lindon/ImageTrail";
import ScrollText from "@/components/lindon/ScrollText";
import Ticker from "@/components/lindon/Ticker";
import CountUp from "@/components/lindon/CountUp";

export const metadata = {
  title: "About Us · Our Family History | Lindon Homes",
  description:
    "Over 32 years of building excellence. The history of the Lindon family business, from Ashley & Lynn's beginnings to Lindon Homes today.",
};

export default function AboutPage() {
  return (
    <main className="bg-white text-[var(--ink)]">
      <Nav immediate showLogo />

      {/* ── Hero — centred, image trail follows the cursor ────── */}
      <ImageTrail>
        <div className="relative z-10 min-h-[92vh] flex items-center justify-center text-center px-6 pointer-events-none">
          <div data-trail-zone className="relative">
            {/* Soft white glow — fades out around the text (no hard edge) */}
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
              className="violet text-[var(--ink)] text-4xl md:text-7xl lg:text-8xl leading-[1.0]"
              style={{ letterSpacing: "0.02em" }}
            >
              OVER <Ticker target={32} /> YEARS
              <br />
              OF BUILDING
              <br />
              EXCELLENCE
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── The Beginning ─────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE BEGINNING
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Ashley Lindon’s carpentry apprenticeship commenced in the Toowoomba
            region working for a combined commercial &amp; residential building
            company before moving to the Sunshine Coast to complete his
            apprenticeship on high-rise construction. He then set out as a
            subcontractor &amp; started working in the mining towns of central
            Queensland.
          </ScrollText>
          <ScrollText>
            Lynn Lindon started her working career in the Blue Mountains, having
            completed full-time training at secretarial college &amp; working as
            a travel consultant.
          </ScrollText>
        </div>
      </section>

      {/* Ashley portrait — poster placement, original ratio */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-4 md:col-span-2">
          <div className="relative aspect-[3/2] bg-[var(--ink)]/5">
            <Image
              src="/lindon/about/person.jpg"
              alt="Ashley Lindon"
              fill
              quality={90}
              className="object-cover"
              sizes="(min-width:768px) 40vw, 100vw"
            />
          </div>
          <figcaption className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-3">
            Ashley Lindon, Founder
          </figcaption>
        </figure>
      </section>

      {/* ── Joining Forces (reverted — heading left, body + family right) ── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          JOINING FORCES
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            After meeting, Ashley &amp; Lynn combined forces as a sub-contract
            company constructing homes for other large double-storey project
            builders in the 1980’s. You would often see Lynn onsite alongside
            Ashley with a wheelbarrow or shovel in hand, and it wasn’t long
            before Ashley obtained his Registered Builders Licence.
          </ScrollText>
          <ScrollText>
            We formed our company, then known as Ashley Lindon Homes, a quality
            double-storey specialist. Upon relocating to Brisbane, Ashley quickly
            established himself in custom home construction.
          </ScrollText>
          <figure className="pt-4">
            <div className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/lindon/about/family.jpg"
                alt="The Lindon family"
                fill
                quality={90}
                className="object-cover"
                sizes="(min-width:768px) 60vw, 100vw"
              />
            </div>
            <figcaption className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-3">
              The Lindon family
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── The Next Generation ───────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE NEXT
          <br />
          GENERATION
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed max-w-2xl ml-auto">
            Trent Lindon joined the family team after five years of university.
            He spent several years supervising alongside Ashley &amp; working in
            various parts of the business, carrying a dedication, an eye for
            detail &amp; a passion for building consulting &amp; design.
          </ScrollText>
          <blockquote
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug"
            style={{ letterSpacing: "0.03em" }}
          >
            “As the company grew it became evident a new name was needed. In
            April 2011, Lindon Homes Pty Ltd was registered.”
          </blockquote>
        </div>
      </section>

      {/* ── Lindon Today ──────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          LINDON TODAY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            Since the inception of Lindon Homes the company has continued in
            growth, quality &amp; expertise in luxury home design &amp;
            construction, recognised by building professionals as one of
            Brisbane’s award-winning builders.
          </ScrollText>
          <div className="grid grid-cols-3 gap-6">
            {[
              { n: 32, l: "Years" },
              { n: 500, l: "Homes" },
              { n: 20, l: "Awards" },
            ].map((s, i) => (
              <div key={s.l}>
                <div
                  className="violet text-[var(--ink)] text-3xl md:text-5xl"
                  style={{ letterSpacing: "0.03em" }}
                >
                  <CountUp to={s.n} suffix="+" delay={i * 0.2} />
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
