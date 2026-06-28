import Image from "next/image";
import Nav from "@/components/ross-hogno/Nav";
import SiteFooter from "@/components/ross-hogno/sections/SiteFooter";
import ImageTrail from "@/components/ross-hogno/ImageTrail";
import ScrollText from "@/components/ross-hogno/ScrollText";
import CountUp from "@/components/ross-hogno/CountUp";
import MaskReveal from "@/components/ross-hogno/MaskReveal";

export const metadata = {
  title: "About · Award-Winning Toowoomba Builder | Ross Hogno Constructions",
  description:
    "Ross Hogno Constructions has built quality custom homes across Toowoomba and the Darling Downs for over 20 years, led by Ross Hogno with a focus on unique, sustainable design.",
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
              BUILT TO
              <br />
              THE HIGHEST
              <br />
              STANDARD
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── Our story ─────────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          OUR STORY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            For over twenty years, Ross Hogno Constructions has built quality
            custom homes, renovations, extensions and commercial projects across
            Toowoomba and the Darling Downs.
          </ScrollText>
          <ScrollText>
            The focus has always been on unique, sustainable design, homes shaped
            around the people who live in them and the land they sit on.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/ross-hogno/projects/highfields.webp"
              alt="Highfields, Toowoomba"
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
            Highfields, Best Use of Sloping Sites
          </MaskReveal>
        </figure>
      </section>

      {/* ── The builder ───────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE BUILDER
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            Ross started out as a mature-age carpentry apprentice and has built an
            enviable resume since, with a long list of industry awards and a string
            of board-level and advocacy roles across building and construction.
          </ScrollText>
          <ScrollText>
            He still works on his own projects. From the outset to the end of each
            build, his diligence and attention to detail are what set him apart, and
            you&rsquo;re working with someone genuine, honest and passionate about the
            outcome.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/ross-hogno/projects/escarpment-ave.webp"
                alt="Escarpment Avenue, East Toowoomba"
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
              Escarpment Avenue, East Toowoomba
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
            &ldquo;Having them oversee our project was reassuring and had more of a
            family feel than strictly a business transaction.&rdquo;
          </MaskReveal>
          <p className="violet text-[var(--ink)]/55 text-[10px] tracking-[0.2em] uppercase mt-6">
            D Hartshorn, Homeowner
          </p>
        </div>
      </section>

      {/* ── Today ─────────────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          ON THE DOWNS
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            A proud Master Builders member of 25 years, Ross Hogno Constructions has
            collected awards across custom homes, sloping sites, renovations and
            sustainable living, right up to Best Use of Sloping Sites in 2025.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 20, suffix: "+", l: "Years Building" },
              { n: 11, suffix: "", l: "Industry Awards" },
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
