import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Reveal from "@/components/Reveal";
import InlineIcon from "@/components/InlineIcon";
import MaskReveal from "@/components/MaskReveal";
import { projects } from "@/content/projects";

const SITE_URL = "https://www.finbar.studio";

// Combined About + Contact page. ProfilePage with a contactPoint, pointing at
// the one Person node defined in the root layout.
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about#webpage`,
  url: `${SITE_URL}/about`,
  name: "About & Contact | Finbar Skitini, Brisbane Graphic Designer",
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

const SERVICES = [
  "Brand identity",
  "Editorial & print",
  "Web & UI design",
  "Motion graphics",
  "Creative direction",
];

// Personal / concept work — not commissioned clients.
const NON_CLIENT_SLUGS = new Set(["palmsmotel", "london-home-show"]);
// Some projects carry their real client's name rather than the project title.
const CLIENT_NAME: Record<string, string> = { tmyr: "Share to Buy" };

const CLIENTS = [...projects]
  .filter((p) => !p.hidden && !NON_CLIENT_SLUGS.has(p.slug))
  .sort((a, b) => a.rank - b.rank)
  .map((p) => CLIENT_NAME[p.slug] ?? p.name);

export const metadata: Metadata = {
  title: { absolute: "About & Contact | Finbar Skitini, Brisbane Graphic Designer" },
  description:
    "Finbar Skitini is a Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio, plus how to get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About & Contact | Finbar Studio",
    description:
      "Brisbane graphic designer working in brand identity, editorial, web and motion. About the studio and how to get in touch.",
    url: "/about",
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="px-5 md:px-10 pb-10">
      <Script
        id="ld-about"
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />

      {/* ── Big statement with inline icons ───────────────────── */}
      <section
        className="min-h-[70svh] flex items-center py-16 md:py-24"
        aria-label="Introduction"
      >
        <MaskReveal
          as="h1"
          className="home-disc"
          aria-label="Nice to meet you, I'm Finbar. One day I woke up and found my feet in design and I haven't moved since."
        >
          {"Nice to meet you "}
          <InlineIcon char="👪" className="home-disc-icon" />
          {" I’m "}
          <span className="home-disc-pink">Finbar</span>
          <InlineIcon char="⦿" className="home-disc-icon" />
          {" one day I woke up and found my feet in design "}
          <InlineIcon char="✎" className="home-disc-icon" />
          {" and I haven’t moved since "}
          <InlineIcon char="♡" className="home-disc-icon" />
        </MaskReveal>
      </section>

      {/* ── Four columns: services / clients / bio / mission ──── */}
      <section
        id="contact"
        className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-12 pb-4"
        aria-label="Services, clients and about"
      >
        <Reveal as="div">
          <h2 className="font-sans font-bold text-pink mb-1" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}>Services</h2>
          <ul className="text-pink font-sans leading-snug" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}>
            {SERVICES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Reveal>

        <Reveal as="div">
          <h2 className="font-sans font-bold text-pink mb-1" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}>Clients</h2>
          <ul className="text-pink font-sans leading-snug" style={{ fontSize: "clamp(1.1rem, 1.5vw, 1.5rem)" }}>
            {CLIENTS.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>
              <Link href="/work" className="text-pink u-underline">View all &rarr;</Link>
            </li>
          </ul>
        </Reveal>

        <Reveal as="div" className="md:col-span-2">
          <p className="text-ink font-sans leading-snug" style={{ fontSize: "clamp(1.5rem, 2.4vw, 2.4rem)" }}>
            BA (Hons), Brighton &amp; Ravensbourne University (admittedly I don&rsquo;t think they mean
            much). I explore design with my clients. My mission is to bring high-end studio outcomes
            to a much wider audience, because we all want to look good right?!
          </p>
        </Reveal>
      </section>
    </div>
  );
}
