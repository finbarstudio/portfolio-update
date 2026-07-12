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
    />
  );
}
