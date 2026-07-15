import Image from "next/image";
import WordReveal from "@/components/qldpools/WordReveal";
import IntroFade from "@/components/qldpools/IntroFade";

/**
 * Hero — a full-viewport frame of their after-dark shot, revealed through the
 * preloader's logo cutout. Centred composition, nothing else: the headline and
 * a row of accolades (their real credentials), staggered in after the zoom.
 *
 * The tiny base64 blur paints the sunset colours from the very first byte, so
 * the preloader cutout always shows *something* even before the real image
 * decodes (the preloader also waits on this <img> via [data-qpi-hero]).
 */

const HERO_BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsICAoIBwsKCQoNDAsNERwSEQ8PESIZGhQcKSQrKigkJyctMkA3LTA9MCcnOEw5PUNFSElIKzZPVU5GVEBHSEX/2wBDAQwNDREPESESEiFFLicuRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUX/wAARCAAQABwDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABQb/xAAmEAACAQMDAwQDAAAAAAAAAAABAgMABBEFEiEGIjETFFFSYaHB/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAED/8QAHhEAAQQBBQAAAAAAAAAAAAAAAQADBBECEhMUMUH/2gAMAwEAAhEDEQA/ACumdAd41aRohG657htdT8GqOXpUbSyvHjH2FQ9jOmnkL6zT4GNp8D+0sNX9yuxraEoeMMuaaX/CKTmRRhZtH6vJaWU7QIwmlBAwhyPzz4oR7e7LFtjgNyAWAquGmRvbPLFbcovakQwP1QR1EISrRgEcdw5qubw6WMeTGesmwv/Z";

// Their real credentials — line one primary, line two secondary.
const ACCOLADES = [
  { primary: "QBCC & NSW Licensed", secondary: "Fully Insured" },
  { primary: "2500+ Pools", secondary: "Installed & Loved" },
  { primary: "20+ Years", secondary: "Industry Experience" },
];

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
        placeholder="blur"
        blurDataURL={HERO_BLUR}
        data-qpi-hero
        className="object-cover object-center"
      />

      {/* Soft vignette behind the centred copy */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 62% 55% at 50% 56%, rgba(4,16,29,0.5) 0%, rgba(4,16,29,0.22) 55%, rgba(4,16,29,0) 100%)",
        }}
      />

      {/* Centred: headline + accolades, nothing else */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-5">
        <h1
          className="text-white font-bold"
          style={{ fontSize: "clamp(2.3rem, 5.2vw, 4.9rem)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
        >
          <WordReveal text="New Pool Builds" delay={150} />
          <span
            className="block font-medium text-white/90 mt-2"
            style={{ fontSize: "clamp(1.2rem, 2.4vw, 2.1rem)", letterSpacing: "-0.01em" }}
          >
            <WordReveal text="Ready in as little as 4 Weeks" delay={550} stagger={90} />
          </span>
        </h1>

        {/* Accolade strip — hairline-separated, small caps (the Lindon laurel
            slot, typographic instead of ornamental) */}
        <IntroFade delay={1250} className="mt-12 md:mt-14">
          <ul className="m-0 p-0 list-none flex flex-col sm:flex-row items-center justify-center gap-5 sm:gap-0">
            {ACCOLADES.map((a, i) => (
              <li
                key={a.primary}
                className={`flex flex-col items-center gap-1.5 px-8 md:px-12 ${
                  i > 0 ? "sm:border-l sm:border-white/25" : ""
                }`}
              >
                <span className="qpi-caps text-white text-[11px] md:text-xs whitespace-nowrap">
                  {a.primary}
                </span>
                <span className="qpi-caps text-white/55 text-[8.5px] md:text-[9px] whitespace-nowrap">
                  {a.secondary}
                </span>
              </li>
            ))}
          </ul>
        </IntroFade>
      </div>
    </section>
  );
}
