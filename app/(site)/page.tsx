import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
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
  },
  {
    slug: "kinaya",
    name: "KinAya",
    url: "https://kinaya.com.au",
    year: "2024",
    bio: "Full rebrand and a six-page site for an Adelaide NDIS provider, with the CMS handed over to their team and a site-wide accessibility text resizer, because their audience genuinely needs one.",
    images: ["/images/web/kinaya-1.webp"],
  },
  {
    slug: "momentum-mentoring",
    name: "Momentum Mentoring",
    url: "https://momentummentoring.co",
    year: "2024",
    bio: "Brand and website for an NDIS mentoring provider, built to feel empowering and warm rather than clinical. Identity and site delivered as one piece of work, on a CMS the team runs themselves.",
    images: ["/images/web/momentum-1.webp"],
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
        <MaskReveal as="h1" className="home-hero-display md:col-span-10">
          A boutique web development studio with a designer&rsquo;s eye.
        </MaskReveal>

        <Reveal as="div" delay={0.25} className="md:col-span-6 md:col-start-1 max-w-[54ch] self-end">
          <p className="text-ink leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)" }}>
            We design and build websites start to finish, in custom code rather than
            templates. Based in Brisbane and London, working with businesses anywhere.
          </p>
          <p className="text-ink-soft leading-relaxed mt-5" style={{ fontSize: "clamp(0.98rem, 1.3vw, 1.15rem)" }}>
            Before the web work came years of brand and graphic design, and it shows.
            If you want the identity, the print and the motion handled too, it all
            comes from the same hand.
          </p>
        </Reveal>

        <Reveal as="div" delay={0.4} className="md:col-span-4 md:col-start-9 self-end">
          <SiteWindow shots={WINDOW_SHOTS} />
        </Reveal>
      </div>
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

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeIntro />
      <Hero />
      {/* Past this point the auto-hidden nav slides in (see LayoutShell). */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <Websites />
    </>
  );
}
