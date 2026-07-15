import Image from "next/image";
import WordReveal from "@/components/qldpools/WordReveal";
import IntroFade from "@/components/qldpools/IntroFade";

/**
 * Hero — a full-viewport frame of their after-dark shot (Upscayl 4x of their
 * own image), revealed through the preloader's logo cutout. Text overlays
 * stagger up once the zoom lands (Lows hero pattern).
 */
export default function Hero() {
  return (
    <section className="relative h-svh min-h-[560px] w-full overflow-hidden" aria-label="Introduction">
      <Image
        src="/qldpools/hero.jpg"
        alt="An infinity pool at dusk, lit from below, looking out over the water"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Bottom scrim for text legibility over the water */}
      <div
        className="absolute inset-x-0 bottom-0 h-[62%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(4,16,29,0.72) 0%, rgba(4,16,29,0.35) 45%, rgba(4,16,29,0) 100%)",
        }}
      />

      {/* Copy — bottom-left, staggered in after the preloader zoom lands */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-10 md:px-10 md:pb-14">
        <IntroFade delay={80}>
          <p className="qpi-caps text-white/80 text-[11px] md:text-xs mb-4">
            Brisbane · Gold Coast · Sunshine Coast
          </p>
        </IntroFade>
        <h1
          className="text-white font-bold max-w-[16ch]"
          style={{ fontSize: "clamp(2.2rem, 5.4vw, 4.8rem)", lineHeight: 1.04, letterSpacing: "-0.02em" }}
        >
          <WordReveal text="Fibreglass and concrete pools, built for Queensland backyards." delay={200} />
        </h1>
        <IntroFade delay={1250} className="mt-5 max-w-[46ch]">
          <p className="text-white/85" style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", lineHeight: 1.5 }}>
            Design, installation and renovations across South East Queensland
            and Northern NSW.
          </p>
        </IntroFade>
        <IntroFade delay={1500} className="mt-7 flex flex-wrap items-center gap-3">
          <a href="tel:+61423123248" className="qpi-cta">
            Get a quote
          </a>
          <a href="tel:+61423123248" className="qpi-caps text-white/80 hover:text-white transition-colors text-xs tabular-nums">
            0423 123 248
          </a>
        </IntroFade>
      </div>
    </section>
  );
}
