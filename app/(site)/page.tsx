import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata } from "next";
import Script from "next/script";
import HomeIntro from "@/components/HomeIntro";
import SelectedWork from "@/components/home/SelectedWork";
import { OG_IMAGE } from "@/lib/og";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: "Finbar Skitini, Graphic & Digital Designer, London",
  description:
    "The portfolio of Finbar Skitini, a graphic and digital designer in London. Brand, print, motion and websites for clients in the UK and Australia, with the case studies behind each one.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Skitini, Graphic & Digital Designer, London",
    description:
      "Brand, print, motion and websites, with the case studies behind each one. Based in London.",
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
    name: "Finbar Skitini, Graphic and Digital Designer, London",
    description:
      "The portfolio of a graphic and digital designer in London: brand, print, motion and websites, with the case studies behind each one.",
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
        Graphic and digital designer. Brand, print, motion and websites.
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
