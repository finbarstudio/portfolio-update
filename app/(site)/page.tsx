import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Image from "next/image";
import HomeIntro from "@/components/HomeIntro";
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
    url: "/go/lows",
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
    url: "/go/plated",
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
    url: "/go/lola",
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
    url: "/go/kinaya",
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

/* ─── Work-first: 60vh of air with minimal centred type, then the grid ───── */
function WorkIntro() {
  return (
    <section id="hero" className="min-h-[60vh] flex flex-col items-center justify-center text-center px-5" aria-label="Introduction">
      <h1 className="text-ink font-medium leading-snug max-w-xl text-balance" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.35rem)" }}>
        Web development with a designer&rsquo;s eye.
      </h1>
    </section>
  );
}

/* ─── The sites: minimal 3-col cards, hero shot only, clicking out ───────── */
function WorkList() {
  return (
    <div className="px-5 md:px-10 pb-20 md:pb-28 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10" aria-label="Websites">
      {WEBSITES.map((w, i) => (
        <article key={w.slug}>
          <a href={w.url} target="_blank" rel="noopener noreferrer" className="block">
            <Image src={w.images[0]} alt={`${w.name} website`} width={1200} height={675} sizes="(max-width: 640px) 100vw, 33vw" className="w-full h-auto rounded-md border border-line" priority={i < 3} />
          </a>
          <div className="flex items-baseline justify-between gap-4 mt-2.5">
            <a href={w.url} target="_blank" rel="noopener noreferrer" className="text-ink font-medium" style={{ fontSize: "0.95rem" }}>{w.name}</a>
            {w.caseStudy && (
              <Link href={w.caseStudy} className="text-ink-soft u-underline" style={{ fontSize: "var(--text-small)" }}>Case study</Link>
            )}
          </div>
        </article>
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
      <HomeIntro />
      {/* Sentinel at the very top: the nav is visible from the first frame. */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <WorkIntro />
      <WorkList />
      <Capabilities />
    </>
  );
}
