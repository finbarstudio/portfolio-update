import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import { type Website } from "@/components/home/WebsiteList";
import { OG_IMAGE } from "@/lib/og";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "Finbar Studio is a boutique web development studio in Brisbane. Custom-designed and custom-coded websites, backed by years of brand and graphic design, for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brisbane Web Design & Development Studio | Finbar Studio",
    description:
      "A boutique web development studio in Brisbane. Custom-designed, custom-coded websites, backed by years of brand and graphic design.",
    url: SITE_URL,
    type: "website",
    images: [OG_IMAGE],
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
    images: ["/images/web/lows-1.webp", "/images/web/lows-2.webp", "/images/web/lows-3.webp", "/images/web/lows-4.webp"],
    caseStudy: "/case-studies/lows-design-build",
    quote: {
      text: "He has completely transformed our online presence and taken it to the next level.",
      author: "Samuel Low, Lows Design + Build",
    },
  },
  {
    slug: "plated-with-issy",
    name: "Plated with Issy",
    url: "https://www.platedwithissy.com",
    year: "2026",
    bio: "Brand and site for a candlelit supper club, built together: one continuous scroll through an evening, a polaroid gallery of past dinners, and a Payload CMS Issy runs from her phone.",
    images: ["/images/web/plated-1.webp", "/images/web/plated-2.webp", "/images/web/plated-3.webp", "/images/web/plated-4.webp"],
    caseStudy: "/case-studies/plated-with-issy",
    quote: {
      text: "Finbar just got it… the site went from an idea to launched faster than I thought was possible. It feels completely like me.",
      author: "Issy Park, Plated with Issy",
    },
  },
  {
    slug: "lola-audio",
    name: "Lola Audio",
    url: "https://www.lola-audio.com",
    year: "2026",
    bio: "A portfolio for a composer and sound designer that opens on a working mixing desk: push a fader and her stems play in time, while a line of type draws the live mix. Sanity CMS down to the sound itself.",
    images: ["/images/web/lola-1.webp", "/images/web/lola-2.webp", "/images/web/lola-3.webp"],
    caseStudy: "/case-studies/lola-audio",
    quote: {
      text: "Finbar is reliable, fast and really easy to work with… something aesthetically beautiful and totally original.",
      author: "Lola Stoodley, Lola Audio",
    },
  },
  {
    slug: "kinaya",
    name: "KinAya",
    url: "https://kinaya.com.au",
    year: "2025",
    bio: "Full rebrand and a six-page site for an Adelaide NDIS provider, with the CMS handed over to their team and a site-wide accessibility text resizer, because their audience genuinely needs one.",
    images: ["/images/web/kinaya-1.webp", "/images/web/kinaya-2.webp", "/images/web/kinaya-3.webp", "/images/web/kinaya-4.webp"],
    caseStudy: "/case-studies/kinaya",
    quote: {
      text: "The branding and website genuinely felt like one vision… he was thinking beyond just aesthetics… we felt confident managing the site ourselves after his walkthrough.",
      author: "Aryan Sareen, KinAya",
    },
  },
];


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

/* ─── Work-first: one line of intro, then straight into the sites ────────── */
function WorkIntro() {
  return (
    <section className="px-5 md:px-10 pt-8 md:pt-12 pb-10 md:pb-14" aria-label="Introduction">
      <h1 className="text-ink font-bold leading-[1.05] max-w-3xl" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2.4rem)", letterSpacing: "-0.01em" }}>
        Custom-coded websites from a Brisbane studio with a designer&rsquo;s eye.
      </h1>
      <div className="flex flex-wrap gap-2.5 mt-5">
        <Link href="/web-design" className="hero-pill">Web design</Link>
        <Link href="/graphic-design" className="hero-pill">Graphic design</Link>
        <Link href="/work" className="hero-pill">All work</Link>
        <Link href="/about" className="hero-pill">About</Link>
      </div>
    </section>
  );
}

/* ─── The work, in your face: big static shots linking straight out ──────── */
function WorkList() {
  return (
    <div aria-label="Websites">
      {WEBSITES.map((w, i) => (
        <section key={w.slug} className="px-5 md:px-10 pb-16 md:pb-24" aria-label={w.name}>
          <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
            <h2 className="font-bold display-brand" style={{ fontSize: "clamp(1.3rem, 2.2vw, 2rem)", letterSpacing: "-0.01em" }}>
              {w.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-ink-soft" style={{ fontSize: "var(--text-small)" }}>{w.year}</span>
              <a href={w.url} target="_blank" rel="noopener noreferrer" className="sticker-pill is-pink">Visit site</a>
              {w.caseStudy && <Link href={w.caseStudy} className="sticker-pill">Case study</Link>}
            </div>
          </header>
          {/* Lead shot full width, the rest in a row under it. Static images,
              every click goes straight to the live site. */}
          <a href={w.url} target="_blank" rel="noopener noreferrer" className="block">
            <Image src={w.images[0]} alt={`${w.name} website`} width={2400} height={1350} sizes="100vw" className="w-full h-auto rounded-md border border-line" priority={i === 0} />
          </a>
          {w.images.length > 1 && (
            <div className="grid grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
              {w.images.slice(1).map((src) => (
                <a key={src} href={w.url} target="_blank" rel="noopener noreferrer" className="block">
                  <Image src={src} alt={`${w.name} section`} width={800} height={450} sizes="33vw" className="w-full h-auto rounded-md border border-line" />
                </a>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
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
      {/* Sentinel at the very top: the nav is visible from the first frame. */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <WorkIntro />
      <WorkList />
      <Capabilities />
    </>
  );
}
