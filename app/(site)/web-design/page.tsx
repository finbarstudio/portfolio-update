import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: { absolute: "Brisbane Web Design & Development | Finbar Studio" },
  description:
    "Brisbane web design and development. Custom-coded, brand-led websites with a CMS clients run themselves, for businesses across Australia and the UK. See selected web projects.",
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Brisbane Web Design & Development | Finbar Studio",
    description:
      "Custom-coded, brand-led websites with a CMS you run yourself, from a Brisbane studio. Selected web projects.",
    url: `${SITE_URL}/web-design`,
    type: "website",
  },
};

export default function WebDesignPage() {
  return (
    <ServiceLanding
      slug="web-design"
      label="Service · Brisbane"
      heading="Brisbane web design & development"
      serviceName="Web Design & Development"
      description="Brisbane web design and development. Custom-coded, brand-led websites with a CMS clients run themselves, for businesses across Australia and the UK."
      intro="I design and build websites for businesses in Brisbane and across Australia. Mostly custom-coded: hand-built front ends that load fast and behave exactly how they were drawn, wired into a CMS the client runs themselves after launch. Where they earn their place, I build the extras in too, like instant estimate tools and live social feeds. It starts with the brand, from the first sketch, and the same care for type and detail carries through to the code."
      terms={["web", "ui", "framer"]}
      capsTitle="What I build"
      capabilities={[
        "Custom-coded websites",
        "A CMS you run yourself",
        "Brand-led design and UI",
        "Interactive tools, like instant estimate calculators",
        "Live social and content feeds",
        "Fast, search-ready front ends",
      ]}
      ctaHeading="Thinking about a new website?"
      faqs={[
        {
          q: "Do you build custom websites or use templates?",
          a: "Mostly custom. Most sites are hand-built front ends, so every part is a decision rather than a template default. Where a project suits it, I build on a CMS the client runs after launch.",
        },
        {
          q: "Will I be able to update the site myself?",
          a: "Yes. Sites come wired into a CMS, and I walk you through it at handover, so you can change words, images and pages without touching code or coming back to me.",
        },
        {
          q: "Do you work with businesses outside Brisbane?",
          a: "Yes. I am based in Brisbane and work with clients across Australia and the UK. Most of the work happens over calls and shared files, so location is not a barrier.",
        },
        {
          q: "How much does a website cost?",
          a: "It depends on the size of the site and what it needs to do. Small brochure sites sit at the lower end; sites with custom tools, animation or a full brand behind them cost more. Tell me what you are after and I will quote it properly.",
        },
        {
          q: "How long does a website take?",
          a: "A straightforward site is usually a few weeks. Bigger builds with custom features or a brand from scratch take longer. I will give you a timeline once I know the scope.",
        },
        {
          q: "Can you design the brand as well as the site?",
          a: "Yes, and it is often better that way. When the brand and the build come from one place, they read as a single piece of work rather than a logo dropped onto a template.",
        },
      ]}
    />
  );
}
