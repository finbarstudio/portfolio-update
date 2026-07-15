import Image from "next/image";
import Nav from "@/components/mbc-prestige/Nav";
import SiteFooter from "@/components/mbc-prestige/sections/SiteFooter";
import ImageTrail from "@/components/mbc-prestige/ImageTrail";
import ScrollText from "@/components/mbc-prestige/ScrollText";
import CountUp from "@/components/mbc-prestige/CountUp";
import MaskReveal from "@/components/mbc-prestige/MaskReveal";

export const metadata = {
  title: "About · Four Decades in Noosa | MBC Prestige",
  description:
    "MBC Prestige has been synonymous with Sunshine Beach for forty years, developing boutique luxury apartments and prestige land releases across Noosa and the Sunshine Coast.",
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
              className="violet text-[var(--ink)] text-4xl md:text-7xl lg:text-8xl leading-[1.06]"
              style={{ letterSpacing: "0.04em", fontWeight: 300 }}
            >
              PURE
              <br />
              NOOSA
              <br />
              LUXURY
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── Four decades ──────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.08em", fontWeight: 300 }}
        >
          FOUR DECADES
          <br />
          ON THE COAST
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            MBC is a name that has been synonymous with Sunshine Beach for forty
            years, instrumental in shaping the village&rsquo;s built environment and
            its character.
          </ScrollText>
          <ScrollText>
            For decades our developments have been at the forefront of the
            region&rsquo;s distinctive coastal style. Put simply, MBC know Noosa
            better than anyone.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/mbc-prestige/projects/home-hero.webp"
              alt="A coastal residence by MBC Prestige"
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
            Sunshine Beach, Noosa
          </MaskReveal>
        </figure>
      </section>

      {/* ── Designed with the best ────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.08em", fontWeight: 300 }}
        >
          DESIGNED
          <br />
          WITH THE BEST
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            Every MBC development is a joint vision with revered designer Stephen
            Kidd, whose four-plus decades across architecture, interior and
            furniture design shape each residence.
          </ScrollText>
          <ScrollText>
            We build in Noosa&rsquo;s last riverfront and beachside pockets, a
            handful of home-sized residences at a time, so scarcity and quality go
            hand in hand.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/mbc-prestige/projects/kalani.webp"
                alt="Kalani, Noosaville"
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
              Kalani, Noosaville
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── The focus ─────────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.08em", fontWeight: 300 }}
        >
          THE FOCUS
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug font-light tracking-[0.04em]"
          >
            &ldquo;Our success continues to be based on our unwavering focus to
            create the ultimate in coastal luxury.&rdquo;
          </MaskReveal>
        </div>
      </section>

      {/* ── On the Coast ──────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.08em", fontWeight: 300 }}
        >
          ON THE COAST
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            From Sunshine Beach and Noosaville to the hinterland corridor, MBC has
            shaped some of the region&rsquo;s most coveted addresses, apartments and
            land releases alike.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 40, suffix: "", l: "Years on the Coast" },
              { n: 7, suffix: "", l: "Signature Developments" },
            ].map((s, i) => (
              <div key={s.l}>
                <div
                  className="violet text-[var(--ink)] text-3xl md:text-5xl"
                  style={{ letterSpacing: "0.03em", fontWeight: 300 }}
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
