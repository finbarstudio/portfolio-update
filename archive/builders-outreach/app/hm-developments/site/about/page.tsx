import Image from "next/image";
import Nav from "@/components/hm-developments/Nav";
import SiteFooter from "@/components/hm-developments/sections/SiteFooter";
import ImageTrail from "@/components/hm-developments/ImageTrail";
import ScrollText from "@/components/hm-developments/ScrollText";
import CountUp from "@/components/hm-developments/CountUp";
import MaskReveal from "@/components/hm-developments/MaskReveal";

export const metadata = {
  title: "About · A Sunshine Coast Family Developer | HM Developments",
  description:
    "HM Developments is a Sunshine Coast property developer led by McLean Henzell, part of a family that has shaped Pelican Waters for generations, creating enduring residential and commercial places.",
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
              BUILT
              <br />
              AROUND
              <br />
              YOU
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── The group ─────────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE GROUP
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Born from a love of the landscape and a passion for property
            development, McLean Henzell brings together the best minds in
            architecture and engineering to deliver HM Developments.
          </ScrollText>
          <ScrollText>
            With two decades of experience and a family that has helped shape
            Pelican Waters for generations, HM is at the forefront of one of the
            country&rsquo;s most liveable regions.
          </ScrollText>
        </div>
      </section>

      {/* Featured project image */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/hm-developments/projects/cove-corsica.webp"
              alt="Corsica Residences, The Cove"
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
            Corsica Residences, The Cove
          </MaskReveal>
        </figure>
      </section>

      {/* ── Around you ────────────────────────────────────────── */}
      <section className="md:min-h-[80vh] grid md:grid-cols-12 gap-8 md:gap-12 px-6 md:px-16 py-20 md:py-32">
        <h2
          className="violet md:col-span-4 text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          AROUND YOU
        </h2>
        <div className="md:col-span-7 md:col-start-6 space-y-6 text-base md:text-lg font-light leading-relaxed max-w-2xl">
          <ScrollText>
            Every HM development is different for one reason. You. We start with
            how people want to live, and then we build around it, intricate,
            well-planned design paired with process-driven project management.
          </ScrollText>
          <ScrollText>
            It&rsquo;s how a masterplanned community like The Cove comes together,
            and why our buyers are so often locals who already know the address.
          </ScrollText>
          <figure className="pt-4">
            <MaskReveal as="div" start="top 85%" className="relative aspect-[16/9] bg-[var(--ink)]/5">
              <Image
                src="/hm-developments/projects/cove-terraces.webp"
                alt="The Terrace Collection, The Cove"
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
              The Terrace Collection, The Cove
            </MaskReveal>
          </figure>
        </div>
      </section>

      {/* ── The vision ────────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE VISION
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug tracking-[0.03em]"
          >
            &ldquo;Our vision is to provide a more diverse offering at Pelican
            Waters that caters to the way people really want to live.&rdquo;
          </MaskReveal>
          <p className="violet text-[var(--ink)]/55 text-[10px] tracking-[0.2em] uppercase mt-6">
            McLean Henzell, Director
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
            From The Cove at Pelican Waters to beachside townhomes at Golden Beach
            and Caloundra, HM Developments is shaping how the Sunshine Coast lives,
            works and unwinds.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 20, suffix: "+", l: "Years of Experience" },
              { n: 80, suffix: "%", l: "Corsica Stage One Sold" },
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
