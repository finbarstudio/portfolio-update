import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Script from "next/script";
import HomeIntro from "@/components/HomeIntro";
import SelectedWork from "@/components/home/SelectedWork";
import { OG_IMAGE } from "@/lib/og";

const SITE_URL = "https://www.finbar.studio";

// The studio site is web-first again (Oct 2026): the wider design work for
// employers lives at portfolio.finbar.studio, so the home page sells websites.
export const metadata: Metadata = {
  description:
    "Finbar Studio is a boutique web development studio in London. Custom-designed and custom-coded websites, backed by years of brand and graphic design, for businesses across the UK and Australia.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "London Web Design & Development Studio | Finbar Studio",
    description:
      "A boutique web development studio in London. Custom-designed, custom-coded websites, backed by years of brand and graphic design.",
    url: SITE_URL,
    type: "website",
    images: [OG_IMAGE],
  },
};

function HomeJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: "Finbar Studio, London Web Design & Development",
    description:
      "A boutique web development studio in London, backed by years of brand and graphic design.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#person` },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
    inLanguage: "en-GB",
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

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeIntro />
      {/* Sentinel at the very top: the nav is visible from the first frame. */}
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <WorkIntro />
      <SelectedWork />
    </>
  );
}
