import HomeIntro from "@/components/HomeIntro";
import Reveal from "@/components/Reveal";
import MaskReveal from "@/components/MaskReveal";
import SiteWindow from "@/components/home/SiteWindow";
import WebsiteList, { type Website } from "@/components/home/WebsiteList";

// 1:1 copy of the home page (app/(site)/page.tsx) for the redesign sandbox.
// JSON-LD + SEO metadata deliberately stripped: this page is noindex and only
// exists to iterate on the skin (see redesign.css). Keep the section structure
// in sync with the real home page when it changes.

const WEBSITES: Website[] = [
  {
    slug: "lows-design-build",
    name: "Lows Design + Build",
    url: "/go/lows",
    year: "2026",
    bio: "A family-run design and build company in London. The brand came first, logo through to the vehicle wrap, and now the site matches it: a custom build with instant quoting and the full project story.",
    images: ["/images/web/lows-1.webp", "/images/web/lows-2.webp", "/images/web/lows-3.webp"],
  },
  {
    slug: "kinaya",
    name: "KinAya",
    url: "/go/kinaya",
    year: "2024",
    bio: "Full rebrand and a six-page site for an Adelaide NDIS provider, with the CMS handed over to their team and a site-wide accessibility text resizer, because their audience genuinely needs one.",
    images: ["/images/web/kinaya-1.webp", "/images/web/kinaya-2.webp", "/images/web/kinaya-3.webp"],
  },
];

const WINDOW_SHOTS = WEBSITES.map((w) => ({ src: w.images[0], label: w.name }));

export default function RedesignHomePage() {
  return (
    <>
      <HomeIntro />
      <section id="hero" className="px-5 md:px-10 pt-[12svh] md:pt-[16svh] pb-16 md:pb-24" aria-label="Introduction">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 gap-y-12">
          <MaskReveal as="h1" className="home-hero-display md:col-span-10">
            A boutique web development studio, with a designer&rsquo;s eye.
          </MaskReveal>
          <Reveal as="div" delay={0.25} className="md:col-span-6 md:col-start-1 max-w-[54ch] self-end">
            <p className="text-ink leading-relaxed" style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.3rem)" }}>
              finbar&#10033;studio designs and builds websites end to end. Custom code, no
              templates, made in Brisbane for businesses anywhere.
            </p>
            <p className="text-ink-soft leading-relaxed mt-5" style={{ fontSize: "clamp(0.98rem, 1.3vw, 1.15rem)" }}>
              The web work sits on years of brand and graphic design, so the site never
              has to arrive alone. Identity, print, motion, art direction: the whole feel
              of your brand can come from the same hand, held together by one good eye.
            </p>
          </Reveal>
          <Reveal as="div" delay={0.4} className="md:col-span-4 md:col-start-9 self-end">
            <SiteWindow shots={WINDOW_SHOTS} />
          </Reveal>
        </div>
      </section>
      <div id="nav-reveal-sentinel" aria-hidden="true" />
      <Reveal section as="section" className="home-section no-rule px-5 md:px-10 pt-20 md:pt-28 pb-24" aria-label="Websites">
        <p className="mono-label text-ink-soft mb-6">Websites</p>
        <WebsiteList sites={WEBSITES} />
      </Reveal>
    </>
  );
}
