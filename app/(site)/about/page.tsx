import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import AboutHero from "@/components/about/AboutHero";
import AboutRevealGate from "@/components/about/AboutRevealGate";
import { MdArrowForward } from "@/components/MaterialIcon";
import ClientLogoMarquee from "@/components/about/ClientLogoMarquee";
import ScrollRevealText from "@/components/about/ScrollRevealText";
import { OG_IMAGE } from "@/lib/og";

const SITE_URL = "https://www.finbar.studio";

// About page. ProfilePage with a contactPoint, pointing at the one Person node
// defined in the root layout. (Contact has its own page at /contact now.)
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About | Finbar Skitini, London Graphic Designer",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "en-GB",
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "finbar@finbar.studio",
      telephone: "+447876492551",
      contactType: "Enquiries",
      areaServed: ["GB", "AU"],
      availableLanguage: "English",
    },
  },
};

const SERVICE_GROUPS = [
  {
    label: "Web & digital",
    items: ["Website design & development", "CMS systems", "UI design", "Email (EDM) design"],
  },
  {
    label: "Brand",
    items: ["Logo design", "Brand identity & guidelines", "Creative direction"],
  },
  {
    label: "Print & artwork",
    items: [
      "Artworking",
      "Booklets, reports & flyers",
      "Editorial & print media",
      "Large-format print",
      "Business cards",
    ],
  },
  {
    label: "Motion & social",
    items: [
      "Motion graphics",
      "Social media campaigns",
      "Social reels & thumbnails",
    ],
  },
];

// Web leads; the design capabilities stay (graphic design roles are still on
// the table), they just follow. Moved here from the home page.
const CAP_PILLS: { name: string; href: string }[] = [
  { name: "Web design & development", href: "/web-design" },
  { name: "Brand identity", href: "/work?filter=brand" },
  { name: "Graphic design", href: "/graphic-design" },
  { name: "Motion graphics", href: "/work?filter=motion" },
  { name: "Editorial & print", href: "/work?filter=editorial" },
  { name: "Creative direction", href: "/work?filter=art" },
];

export const metadata: Metadata = {
  title: { absolute: "About | Finbar Skitini, London Graphic Designer" },
  description:
    "Finbar Skitini designs and hand-codes websites in London, and does the brand, print and motion work around them. Who I am, what I charge for and how to get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Finbar Studio",
    description:
      "I design and hand-code websites in London, plus the brand, print and motion work around them. Who I am and how to get in touch.",
    url: "/about",
    type: "profile",
    images: [OG_IMAGE],
  },
};

export default function AboutPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      <Script
        id="ld-about"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: jsonLdHtml(aboutJsonLd) }}
      />

      <AboutHero />

      {/* Everything below stays hidden until the hero statement has finished
          revealing (AboutRevealGate listens for "about:intro-done"). */}
      <AboutRevealGate>

      {/* ── Where I sit: the price of a freelancer, the standard of a studio.
          Above the services so the list below reads in that light. ──── */}
      <section className="about-usp-sect" aria-label="How I work and what it costs">
        <Reveal as="div" className="about-usp">
          <p className="about-usp-lead">
            I love building websites. I&rsquo;d be doing it at the weekend anyway.
          </p>
          <p>
            You can get a site cheaply from a Fiverr gig, a Canva template or an
            afternoon with an AI builder, and it will look like it. A big studio
            will do it beautifully, then bill you for the account managers, the
            meetings and the office. I do the studio version on my own. One
            person designs it, codes it by hand and launches it, so nothing sits
            waiting on a handover and the job moves quickly. That speed is why I
            can charge a good deal less than a studio for the same standard of
            work.
          </p>
        </Reveal>
      </section>

      {/* ── Services: one row, each category its own column ──── */}
      <section id="contact" className="pt-2 pb-16 md:pb-24" aria-label="Services">
        <Reveal as="div" className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="font-sans font-semibold text-ink-soft mb-2" style={{ fontSize: "0.82rem" }}>{g.label}</p>
              <ul className="text-ink font-sans leading-snug" style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)" }}>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Clients: a scrolling wall of logos (hover → name pill; click → case
          study in a new tab) ──── */}
      <section className="pt-8 md:pt-16 pb-8" aria-labelledby="clients-title">
        <p id="clients-title" className="font-sans font-semibold text-ink-soft text-center mb-10 md:mb-12" style={{ fontSize: "0.82rem" }}>
          Clients I&rsquo;ve worked with
        </p>
        <ClientLogoMarquee />
        <p className="text-center mt-8">
          <Link href="/work" className="text-ink u-underline inline-flex items-center gap-1">View all work <MdArrowForward size={14} /></Link>
        </p>
      </section>

      {/* ── Bio: faded text that inks in word by word on scroll, centred in a
          padded full-height block (even space to the logos above and the
          disciplines below). ──── */}
      <section className="about-bio-sect" aria-label="About the studio">
        <ScrollRevealText
          className="about-bio"
          text={"BA (Hons), Brighton & Ravensbourne University (admittedly I don’t think the letters mean much). I explore design with my clients. I want studio-quality work to reach a lot more people than it does now, because we all want to look good, right?"}
        />
      </section>

      {/* ── How I help businesses (moved here from the home page) ── */}
      <section className="home-disciplines is-inset px-0 pt-8 pb-8" aria-labelledby="services-title">
        <div className="home-cap">
          <h2 id="services-title" className="home-cap-title">How I help businesses</h2>
          <div className="home-disc home-cap-wrap">
            {CAP_PILLS.map((c) => (
              <Link key={c.name} href={c.href} className="home-cap-pill">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      </AboutRevealGate>
    </div>
  );
}
