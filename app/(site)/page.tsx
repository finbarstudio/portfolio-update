import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import HomeIntro from "@/components/HomeIntro";
import HeroTitle from "@/components/home/HeroTitle";
import ContactCta from "@/components/ContactCta";
import SiteWindow from "@/components/home/SiteWindow";
import WebsiteList, { type Website } from "@/components/home/WebsiteList";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "finbar✶studio is a boutique web development studio in Brisbane. Custom-designed and custom-coded websites, backed by years of brand and graphic design, for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brisbane Web Design & Development Studio | Finbar Studio",
    description:
      "A boutique web development studio in Brisbane. Custom-designed, custom-coded websites, backed by years of brand and graphic design.",
    url: SITE_URL,
    type: "website",
  },
};

/* The shipped sites, newest first. Screens live in /images/web (settled homepage stills
   from the live-site scroll recordings). */
const WEBSITES: Website[] = [
  {
    slug: "lows-design-build",
    name: "Lows Design + Build",
    url: "https://www.lowsdesignandbuild.com",
    year: "2026",
    bio: "A family-run design and build company in London. The brand came first, logo through to the vehicle wrap, and now the site matches it: a custom build with instant quoting and the full project story.",
    images: ["/images/web/lows-1.webp?v=2", "/images/web/lows-2.webp?v=2", "/images/web/lows-3.webp?v=2", "/images/web/lows-4.webp?v=2"],
    caseStudy: "/case-studies/lows-design-build",
  },
  {
    slug: "plated-with-issy",
    name: "Plated with Issy",
    url: "https://www.platedwithissy.com",
    year: "2026",
    bio: "Brand and site for a candlelit supper club, built together: one continuous scroll through an evening, a polaroid gallery of past dinners, and a Payload CMS Issy runs from her phone.",
    images: ["/images/web/plated-1.webp", "/images/web/plated-2.webp", "/images/web/plated-3.webp", "/images/web/plated-4.webp"],
    caseStudy: "/case-studies/plated-with-issy",
  },
  {
    slug: "lola-audio",
    name: "Lola Audio",
    url: "https://www.lola-audio.com",
    year: "2026",
    bio: "A portfolio for a composer and sound designer that opens on a working mixing desk: push a fader and her stems play in time, while a line of type draws the live mix. Sanity CMS down to the sound itself.",
    images: ["/images/web/lola-1.webp", "/images/web/lola-2.webp", "/images/web/lola-3.webp"],
    caseStudy: "/case-studies/lola-audio",
  },
  {
    slug: "kinaya",
    name: "KinAya",
    url: "https://kinaya.com.au",
    year: "2025",
    bio: "Full rebrand and a six-page site for an Adelaide NDIS provider, with the CMS handed over to their team and a site-wide accessibility text resizer, because their audience genuinely needs one.",
    images: ["/images/web/kinaya-1.webp", "/images/web/kinaya-2.webp", "/images/web/kinaya-3.webp", "/images/web/kinaya-4.webp"],
    caseStudy: "/case-studies/kinaya",
  },
];

// Only the strongest three cycle in the hero window; KinAya stays in the list
// (always at the bottom of the stack) but out of the featured shots.
const WINDOW_SLUGS = new Set(["lows-design-build", "plated-with-issy", "lola-audio"]);
const WINDOW_SHOTS = WEBSITES.filter((w) => WINDOW_SLUGS.has(w.slug)).map((w) => ({ src: w.images[0], label: w.name }));

function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Studio, Brisbane Web Design & Development",
    description:
      "A boutique web development studio in Brisbane, backed by years of brand and graphic design.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
    inLanguage: "en-AU",
  };
  return (
    <Script
      id="ld-home"
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: jsonLdHtml(jsonLd) }}
    />
  );
}

/* ─── Hero: editorial, type-led, with a small window of recent builds ─────── */
function Hero() {
  return (
    <section
      id="hero"
      className="px-5 md:px-10 flex flex-col justify-center gap-8 md:gap-10"
      style={{ height: "calc(100svh - var(--menubar-h, 56px))" }}
      aria-label="Introduction"
    >
      {/* Full-width editorial block, sized to sit inside one viewport: the
          indented title runs straight into the body copy, and the cycling
          window is slotted inline (floated right) so the text wraps it. */}
      {/* Every line fitted to the full measure (footer-wordmark trick):
          edge-to-edge type with normal word spaces, no justify gaps. */}
      <HeroTitle />
      {/* 50/50 under the title: body copy + the cycling window on the left;
          a two-column nav (pages + socials) on the right, vertically centred
          in its half and right-aligned. */}
      <Reveal as="div" delay={0.3} className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
        <div className="flex items-center">
          <div className="w-full">
            <SiteWindow shots={WINDOW_SHOTS} />
          </div>
        </div>

        <div className="flex items-center justify-center">
          {/* A centred cluster of pill links: pages in ink, socials in pink. */}
          <nav
            className="hero-links flex flex-wrap items-center justify-center content-center gap-2.5 max-w-[34ch]"
            aria-label="Site and social links"
          >
            <Link href="/work" className="hero-pill">Work</Link>
            <Link href="/about" className="hero-pill">About</Link>
            <Link href="/web-design" className="hero-pill">Web design</Link>
            <Link href="/graphic-design" className="hero-pill">Graphic design</Link>
            <ContactCta className="hero-pill">Contact</ContactCta>
            <a href="https://instagram.com/finbar.studio" target="_blank" rel="noopener noreferrer" className="hero-pill hero-pill-social">Instagram</a>
            <a href="https://linkedin.com/in/finbarskitini" target="_blank" rel="noopener noreferrer" className="hero-pill hero-pill-social">LinkedIn</a>
            <a href="https://x.com/finbarstudio" target="_blank" rel="noopener noreferrer" className="hero-pill hero-pill-social">X</a>
            <a href="https://are.na/finbar-studio" target="_blank" rel="noopener noreferrer" className="hero-pill hero-pill-social">Are.na</a>
          </nav>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── The sites ────────────────────────────────────────────── */
function Websites() {
  return (
    <Reveal section as="section" className="home-section no-rule px-5 md:px-10 pt-20 md:pt-28 pb-24" aria-label="Websites">
      <WebsiteList sites={WEBSITES} />
    </Reveal>
  );
}


/* ─── How I help businesses: category pills (also lives on /about) ── */
const CAP_PILLS: { name: string; href: string }[] = [
  { name: "Web design & development", href: "/web-design" },
  { name: "Brand identity", href: "/work?filter=brand" },
  { name: "Graphic design", href: "/graphic-design" },
  { name: "Motion graphics", href: "/work?filter=motion" },
  { name: "Editorial & print", href: "/work?filter=editorial" },
  { name: "Creative direction", href: "/work?filter=art" },
];

function Capabilities() {
  return (
    <section className="home-disciplines px-5 md:px-10" aria-labelledby="services-title">
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
  );
}

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeIntro />
      <Hero />
      {/* Past this point the auto-hidden nav slides in (see LayoutShell). */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <Websites />
      <Capabilities />
    </>
  );
}
