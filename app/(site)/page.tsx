import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import HomeIntro from "@/components/HomeIntro";
import SiteWindow from "@/components/home/SiteWindow";
import WebsiteList, { type Website } from "@/components/home/WebsiteList";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  description:
    "finbar✶studio is a boutique web development studio in Brisbane. Custom-designed and custom-coded websites, backed by years of brand and graphic design, for businesses across Australia and the UK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Studio | Brisbane Web Design & Development",
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
    images: ["/images/web/lows-1.webp"],
    caseStudy: "/case-studies/lows-design-build",
  },
  {
    slug: "kinaya",
    name: "KinAya",
    url: "https://kinaya.com.au",
    year: "2024",
    bio: "Full rebrand and a six-page site for an Adelaide NDIS provider, with the CMS handed over to their team and a site-wide accessibility text resizer, because their audience genuinely needs one.",
    images: ["/images/web/kinaya-1.webp"],
    caseStudy: "/case-studies/kinaya",
  },
  {
    slug: "momentum-mentoring",
    name: "Momentum Mentoring",
    url: "https://momentummentoring.co",
    year: "2024",
    bio: "Brand and website for an NDIS mentoring provider, built to feel empowering and warm rather than clinical. Identity and site delivered as one piece of work, on a CMS the team runs themselves.",
    images: ["/images/web/momentum-1.webp"],
    caseStudy: "/case-studies/momentum-mentoring",
  },
];

const WINDOW_SHOTS = WEBSITES.map((w) => ({ src: w.images[0], label: w.name }));

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
    <section id="hero" className="px-5 md:px-10 pt-[12svh] md:pt-[16svh] pb-16 md:pb-24" aria-label="Introduction">
      {/* Full-width editorial block: indented title runs straight into the
          body copy (one paragraph, no break), window sits below on the right. */}
      <MaskReveal as="h1" className="home-hero-display" style={{ textIndent: "clamp(3rem, 14vw, 15rem)" }}>
        A boutique web development studio with a designer&rsquo;s eye.
      </MaskReveal>
      <Reveal as="p" delay={0.25} className="text-ink leading-relaxed mt-4" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)" }}>
        We design and build websites start to finish, in custom code rather than
        templates. Based in Brisbane and London, working with businesses anywhere.
        Before the web work came years of brand and graphic design, and it shows.
        Identity, print and motion come from the same hand as the code.
      </Reveal>
      <Reveal as="div" delay={0.4} className="mt-12 md:mt-16 flex justify-end">
        <div className="w-full md:w-[38%] md:min-w-[380px]">
          <SiteWindow shots={WINDOW_SHOTS} />
        </div>
      </Reveal>
    </section>
  );
}

/* ─── The sites ────────────────────────────────────────────── */
function Websites() {
  return (
    <Reveal section as="section" className="home-section no-rule px-5 md:px-10 pt-20 md:pt-28 pb-24" aria-label="Websites">
      <p className="mono-label text-ink-soft mb-6">Websites</p>
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
