import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import AboutHero from "@/components/about/AboutHero";
import AboutRevealGate from "@/components/about/AboutRevealGate";
import { MdArrowForward } from "@/components/MaterialIcon";
import ClientLogoMarquee from "@/components/about/ClientLogoMarquee";
import { OG_IMAGE } from "@/lib/og";

const SITE_URL = "https://www.finbar.studio";

// About page. ProfilePage with a contactPoint, pointing at the one Person node
// defined in the root layout. (Contact has its own page at /contact now.)
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About | Finbar Skitini, Brisbane Graphic Designer",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  inLanguage: "en-AU",
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
    contactPoint: {
      "@type": "ContactPoint",
      email: "finbar@finbar.studio",
      telephone: "+61412796630",
      contactType: "Enquiries",
      areaServed: ["AU", "GB"],
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
  title: { absolute: "About | Finbar Skitini, Brisbane Graphic Designer" },
  description:
    "Finbar Skitini is a Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio, plus how to get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About | Finbar Studio",
    description:
      "Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio and how to get in touch.",
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

      {/* ── Services: one row, each category its own column ──── */}
      <section id="contact" className="pt-2 pb-16 md:pb-24" aria-label="Services">
        <Reveal as="div" className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10">
          {SERVICE_GROUPS.map((g) => (
            <div key={g.label}>
              <p className="font-mono uppercase text-ink-soft mb-2" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>{g.label}</p>
              <ul className="text-ink font-sans leading-snug" style={{ fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)" }}>
                {g.items.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </section>

      {/* ── Clients: a scrolling wall of logos (hover → name pill) ──── */}
      <section className="pb-16 md:pb-24" aria-labelledby="clients-title">
        <p id="clients-title" className="font-mono uppercase text-ink-soft text-center mb-8" style={{ fontSize: "11px", letterSpacing: "0.06em" }}>
          Clients I&rsquo;ve worked with
        </p>
        <ClientLogoMarquee />
        <p className="text-center mt-8">
          <Link href="/work" className="text-ink u-underline inline-flex items-center gap-1">View all work <MdArrowForward size={14} /></Link>
        </p>
      </section>

      {/* ── Bio: centred, revealed on scroll ──── */}
      <section className="pb-20 md:pb-28" aria-label="About the studio">
        <Reveal
          as="p"
          y={44}
          className="mx-auto max-w-3xl text-center text-ink font-sans text-balance"
          style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.5rem)", lineHeight: 1.3 }}
        >
          BA (Hons), Brighton &amp; Ravensbourne University (admittedly I don&rsquo;t think they mean
          much). I explore design with my clients. My mission is to bring high-end studio outcomes
          to a much wider audience, because we all want to look good right?!
        </Reveal>
      </section>

      {/* ── How I help businesses (moved here from the home page) ── */}
      <section className="home-disciplines is-inset px-0 pt-24 md:pt-32" aria-labelledby="services-title">
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
