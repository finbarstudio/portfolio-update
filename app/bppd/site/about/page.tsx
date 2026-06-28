import Image from "next/image";
import Nav from "@/components/bppd/Nav";
import SiteFooter from "@/components/bppd/sections/SiteFooter";
import ScrollText from "@/components/bppd/ScrollText";
import CountUp from "@/components/bppd/CountUp";
import MaskReveal from "@/components/bppd/MaskReveal";

export const metadata = {
  title: "About · Brisbane Prestige Property Developments | BPPD",
  description:
    "BPPD has been part of Queensland's property market for over fifteen years, led by John G Samios, specialising in complex, de-risked developments and joint ventures.",
};

const TEAM = [
  { img: "/bppd/team/john.webp", name: "John G Samios", role: "CEO / Managing Director" },
  { img: "/bppd/team/chris.webp", name: "Christopher Chai", role: "COO / Development Manager" },
  { img: "/bppd/team/greg.webp", name: "Greg Mar", role: "Chief Financial Officer" },
];

export default function AboutPage() {
  return (
    <main className="bg-white text-[var(--ink)]">
      <Nav immediate showLogo />

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <MaskReveal as="p" className="violet text-[var(--accent)] text-[11px] tracking-[0.34em] uppercase mb-7">
          About BPPD
        </MaskReveal>
        <MaskReveal as="h1" start="top 90%" className="violet text-[var(--ink)] leading-[1.04]">
          <span style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)", letterSpacing: "0.05em", fontWeight: 600 }}>
            UNITY IS
            <br />
            STRENGTH
          </span>
        </MaskReveal>
      </section>

      {/* ── The company ───────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-20 md:py-28">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.06em" }}
        >
          THE COMPANY
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            For over fifteen years, BPPD has been part of Queensland&rsquo;s niche
            residential and commercial property market, working with investors who
            have an appetite for de-risked, blue-chip developments.
          </ScrollText>
          <ScrollText>
            We are specialists in complex projects, those involving extensive
            entitlements, structured joint ventures and sustainable visions for
            development.
          </ScrollText>
        </div>
      </section>

      {/* Skyline image */}
      <section className="px-6 md:px-16 pb-16 md:pb-32">
        <MaskReveal as="div" start="top 84%" className="relative aspect-[16/8] bg-[var(--ink)]/5">
          <Image
            src="/bppd/skyline.webp"
            alt="Brisbane at dusk"
            fill
            quality={86}
            className="object-cover"
            sizes="100vw"
          />
        </MaskReveal>
        <MaskReveal
          as="p"
          start="top 84%"
          delay={0.3}
          className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-3"
        >
          South East Queensland
        </MaskReveal>
      </section>

      {/* ── Leadership ────────────────────────────────────────── */}
      <section className="px-6 md:px-16 py-20 md:py-28">
        <h2
          className="violet text-[var(--ink)] text-2xl md:text-4xl leading-tight mb-14"
          style={{ letterSpacing: "0.06em" }}
        >
          LEADERSHIP
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-12">
          {TEAM.map((m, i) => (
            <MaskReveal key={m.name} as="div" start="top 90%" delay={i * 0.1} className="flex flex-col items-start">
              <div className="relative w-full aspect-square bg-[var(--grey-light)] overflow-hidden">
                <Image src={m.img} alt={m.name} fill quality={82} className="object-cover" sizes="(min-width:640px) 30vw, 90vw" />
              </div>
              <h3 className="violet text-[var(--ink)] text-base mt-5" style={{ letterSpacing: "0.08em" }}>
                {m.name.toUpperCase()}
              </h3>
              <p className="text-[var(--ink-soft)] text-sm font-light mt-1">{m.role}</p>
            </MaskReveal>
          ))}
        </div>
      </section>

      {/* ── The principle ─────────────────────────────────────── */}
      <section className="md:min-h-[60vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-20 md:py-28">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.06em" }}
        >
          THE PRINCIPLE
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 72%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug font-semibold tracking-[0.03em]"
          >
            &ldquo;You can be assured of our authenticity, and our values of hard
            work, honesty, fairness and transparency.&rdquo;
          </MaskReveal>
        </div>
      </section>

      {/* ── Track record ──────────────────────────────────────── */}
      <section className="md:min-h-[55vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-20 md:py-28">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.06em" }}
        >
          TRACK RECORD
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-10">
          <ScrollText className="text-base md:text-lg font-light leading-relaxed">
            Led by John G Samios, whose four decades span companies with offices
            across Australia, Hong Kong and China, BPPD brings deep experience to
            every project it touches.
          </ScrollText>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 40, suffix: "+", l: "Years' Experience" },
              { n: 15, suffix: "+", l: "Years as BPPD" },
            ].map((s, i) => (
              <div key={s.l}>
                <div
                  className="violet text-[var(--ink)] text-3xl md:text-5xl"
                  style={{ letterSpacing: "0.03em", fontWeight: 600 }}
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
