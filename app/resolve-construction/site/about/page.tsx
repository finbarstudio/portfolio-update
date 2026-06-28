import Image from "next/image";
import Nav from "@/components/resolve-construction/Nav";
import SiteFooter from "@/components/resolve-construction/sections/SiteFooter";
import ImageTrail from "@/components/resolve-construction/ImageTrail";
import ScrollText from "@/components/resolve-construction/ScrollText";
import CountUp from "@/components/resolve-construction/CountUp";
import MaskReveal from "@/components/resolve-construction/MaskReveal";

export const metadata = {
  title: "About · Boutique Prestige Builder | Resolve Construction",
  description:
    "Resolve Construction is a boutique, award-winning Gold Coast builder led by Billy Thomas, building prestige one-of-a-kind homes with a handful of clients at a time.",
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
              PRESTIGE
              <br />
              ONE OF A
              <br />
              KIND HOMES
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── Boutique by design ────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          BOUTIQUE
          <br />
          BY DESIGN
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Resolve is a boutique builder. We only take on a handful of clients
            at a time, so every job stays manageable and every deadline and
            budget is met.
          </ScrollText>
          <ScrollText>
            Your home should be an expression of you. That&rsquo;s why our clients
            are involved in the selection of every feature of their new home, down
            to the last detail.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/resolve-construction/projects/neu-burleigh.webp"
              alt="Neu Burleigh, Burleigh Waters"
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
            Neu Burleigh, Burleigh Waters
          </MaskReveal>
        </figure>
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
            &ldquo;Striving for perfection in prestige construction means we
            aren&rsquo;t happy until your home is recognised as the best of its
            kind.&rdquo;
          </MaskReveal>
        </div>
      </section>

      {/* ── The founder ───────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE FOUNDER
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            Billy Thomas started on the tools at fifteen and finished his
            carpentry qualification a year early. He went on to project-manage
            large housing developments and custom builds before founding Resolve
            on the Gold Coast.
          </ScrollText>
          <ScrollText>
            His philosophy hasn&rsquo;t changed since: never compromise on quality.
            It&rsquo;s the reason Resolve keeps its numbers small and its standard
            high.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/resolve-construction/projects/sovereign-house.webp"
                alt="The Sovereign House, Coomera Waters"
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
              The Sovereign House, Coomera Waters
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── Resolve today ─────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          RESOLVE
          <br />
          TODAY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            From Burleigh Waters to Broadbeach and the hinterland, Resolve has
            become one of the most awarded boutique builders on the Gold Coast,
            with wins across the Master Builders Gold Coast and Queensland
            programs.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 11, l: "Master Builders Wins" },
              { n: 5, l: "Wins in 2025" },
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
