import Image from "next/image";
import Nav from "@/components/gto-building/Nav";
import SiteFooter from "@/components/gto-building/sections/SiteFooter";
import ImageTrail from "@/components/gto-building/ImageTrail";
import ScrollText from "@/components/gto-building/ScrollText";
import CountUp from "@/components/gto-building/CountUp";
import MaskReveal from "@/components/gto-building/MaskReveal";

export const metadata = {
  title: "About · Award-Winning Sunshine Coast Builder | GTO Building",
  description:
    "GTO Building is an award-winning Sunshine Coast builder led by Gaston Ottl, building architect-designed homes with precision craftsmanship and a hands-on, client-first approach.",
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
              PRECISION
              <br />
              CRAFTSMANSHIP
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── The vision ────────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE VISION
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            GTO Building is an award-winning Sunshine Coast builder, founded by
            Gaston Ottl with a strong emphasis on client relationships, quality and
            precision craftsmanship.
          </ScrollText>
          <ScrollText>
            Gaston&rsquo;s vision is simple: a stress-free, rewarding build, with
            open communication the whole way through, delivering real value and
            outstanding results.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/gto-building/projects/tristania.webp"
              alt="Tristania Beach House, Marcus Beach"
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
            Tristania Beach House, Marcus Beach
          </MaskReveal>
        </figure>
      </section>

      {/* ── Built with architects ─────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          BUILT WITH
          <br />
          ARCHITECTS
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            The best homes come from the best collaborations. GTO builds alongside
            some of the coast&rsquo;s most respected architects and designers,
            including Bark Design Architects, Reitsma &amp; Associates, Walk Studio
            and Georgina Price Design.
          </ScrollText>
          <ScrollText>
            Their design, our build, executed with the project-management strength
            and attention to detail that sees ambitious homes finished beautifully,
            on time.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/gto-building/projects/tallgum.webp"
                alt="Tallgum House, Doonan"
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
              Tallgum House, Doonan
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
            &ldquo;The timeframe we proposed was very ambitious, but for GTO to have
            achieved it was phenomenal, exceptional project management.&rdquo;
          </MaskReveal>
          <p className="violet text-[var(--ink)]/55 text-[10px] tracking-[0.2em] uppercase mt-6">
            Debbie &amp; Wes, Homeowners
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
            From Peregian Beach and Doonan to Marcus Beach and Noosa, GTO has built
            some of the Sunshine Coast&rsquo;s most considered architectural homes,
            with multiple Master Builders wins along the way.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 3, l: "Master Builders Wins" },
              { n: 4, l: "Design Partners" },
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
