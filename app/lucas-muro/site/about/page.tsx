import Image from "next/image";
import Nav from "@/components/lucas-muro/Nav";
import SiteFooter from "@/components/lucas-muro/sections/SiteFooter";
import ImageTrail from "@/components/lucas-muro/ImageTrail";
import ScrollText from "@/components/lucas-muro/ScrollText";
import CountUp from "@/components/lucas-muro/CountUp";
import MaskReveal from "@/components/lucas-muro/MaskReveal";

export const metadata = {
  title: "About · Lucas Muro",
  description:
    "Lucas Muro has photographed architecture and interiors since 2004, based in Marcoola on the Sunshine Coast and shooting Brisbane, Sydney and Melbourne.",
};

// The four process cards are grounded in Lucas's own FAQ, near word for word.
const PROCESS = [
  {
    title: "Half day or full day.",
    body: "Every shoot is a half day or a full day. There are no shortcuts to the level of quality clients have come to expect.",
  },
  {
    title: "Twilights & aerials.",
    body: "Twilight frames and low-level aerials on request, with an extra hour of access to the property.",
  },
  {
    title: "I shoot alone.",
    body: "Lucas typically works alone and oversees all his own post production. Architects, homeowners and stylists are welcome on site, but nobody has to be.",
  },
  {
    title: "48 to 72 hours.",
    body: "Most shoots are delivered within 48 to 72 hours, by whichever link suits: Dropbox, WeTransfer or FTP.",
  },
];

// Lucas's published client list, a representative subset.
const CLIENTS = [
  "Qantas",
  "Fendi",
  "Nike",
  "Hyatt",
  "Sheraton",
  "Accor",
  "RACV Resorts",
  "Hassell Studio",
  "Jackson Teece",
  "Aboda Design Group",
  "Sprout Architects",
  "Koda Design",
  "Jayson Pate Design",
  "Chris Clout Design",
  "WG Architects",
  "BA Architecture",
  "Graya Constructions",
  "Dayne Lawrie Constructions",
  "Immackulate Homes",
  "SunCity Homes",
  "McCarthy Homes",
];

export default function AboutPage() {
  return (
    <main className="bg-white text-[var(--ink)]">
      <Nav immediate showLogo />

      {/* ── Hero — Lucas's own line, image trail follows the cursor ──────── */}
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
              IT&rsquo;S ALL ABOUT
              <br />
              LIGHT, SHAPE
              <br />
              AND TEXTURE
            </h1>
          </div>
        </div>
      </ImageTrail>

      {/* ── Twenty years behind the camera ─────────────────────── */}
      <section className="md:min-h-[80vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          TWENTY YEARS
          <br />
          BEHIND THE
          <br />
          CAMERA
        </h2>
        <div className="col-span-5 md:col-span-2 md:col-start-4 self-end space-y-6 text-base md:text-lg font-light leading-relaxed">
          <ScrollText>
            Lucas Muro has photographed architecture and interiors since 2004.
            Based in Marcoola on the Sunshine Coast, he shoots for architects,
            designers and builders across Brisbane, Sydney and Melbourne: new
            houses, commercial fit-outs, hotels and resorts.
          </ScrollText>
          <ScrollText>
            One of the most powerful marketing assets a company can have is up
            to date, accurate and well styled photography. That conviction has
            carried the practice from single houses on the coast to work for
            Qantas, Fendi and Nike.
          </ScrollText>
        </div>
      </section>

      {/* Featured frame */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 pb-16 md:pb-40">
        <figure className="col-span-5 md:col-span-3">
          <MaskReveal as="div" start="top 82%" className="relative aspect-[16/10] bg-[var(--ink)]/5">
            <Image
              src="/lucas-muro/projects/whistle-lane-2.webp"
              alt="Whistle Lane, Immackulate Homes"
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
            Whistle Lane · Immackulate Homes
          </MaskReveal>
        </figure>
      </section>

      {/* ── How a shoot works — grounded in his own FAQ ─────────── */}
      <section className="md:min-h-[70vh] px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet text-2xl md:text-4xl leading-tight mb-14 md:mb-20"
          style={{ letterSpacing: "0.04em" }}
        >
          HOW A SHOOT WORKS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {PROCESS.map((c) => (
            <MaskReveal key={c.title} as="div" start="top 85%" className="border-t border-[var(--line)] pt-5">
              <h3 className="violet text-sm md:text-base mb-3" style={{ letterSpacing: "0.06em" }}>
                {c.title.toUpperCase()}
              </h3>
              <p className="text-sm md:text-base font-light leading-relaxed text-[var(--ink)]/80">
                {c.body}
              </p>
            </MaskReveal>
          ))}
        </div>
      </section>

      {/* ── The promise — his own words, from the FAQ ───────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE PROMISE
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end">
          <MaskReveal
            as="blockquote"
            start="top 70%"
            className="violet text-[var(--ink)] text-2xl md:text-4xl leading-snug tracking-[0.03em]"
          >
            &ldquo;Your satisfaction is guaranteed or I will do what it takes
            to make it right.&rdquo;
          </MaskReveal>
          <p className="violet text-[10px] tracking-[0.2em] uppercase text-[var(--ink)]/45 mt-6">
            Lucas Muro · The FAQ promise
          </p>
        </div>
      </section>

      {/* ── The client list ─────────────────────────────────────── */}
      <section className="md:min-h-[70vh] grid grid-cols-1 md:grid-cols-5 gap-6 px-6 md:px-16 py-24 md:py-32">
        <h2
          className="violet col-span-3 md:col-span-2 self-start text-2xl md:text-4xl leading-tight"
          style={{ letterSpacing: "0.04em" }}
        >
          THE CLIENT
          <br />
          LIST
        </h2>
        <div className="col-span-5 md:col-span-3 md:col-start-3 self-end space-y-12">
          <ul className="columns-2 sm:columns-3 gap-8 text-base md:text-lg font-light leading-loose">
            {CLIENTS.map((c) => (
              <li key={c} className="break-inside-avoid">
                {c}
              </li>
            ))}
          </ul>
          <div className="grid grid-cols-2 gap-6">
            {[
              { n: 20, l: "Years shooting architecture" },
              { n: 7, l: "Shoots for Aboda alone" },
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
