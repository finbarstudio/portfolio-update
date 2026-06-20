import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: { absolute: "Brisbane Web Design | Finbar Studio" },
  description:
    "Brisbane web design — brand-led websites, Framer builds, CMS and UI design for businesses across Australia and the UK. See selected web projects.",
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Brisbane Web Design | Finbar Studio",
    description:
      "Brand-led websites, Framer builds, CMS and UI design from a Brisbane studio. Selected web projects.",
    url: `${SITE_URL}/web-design`,
    type: "website",
  },
};

export default function WebDesignPage() {
  return (
    <ServiceLanding
      slug="web-design"
      label="Service · Brisbane"
      heading="Brisbane web design"
      serviceName="Web Design"
      description="Brisbane web design — brand-led websites, Framer builds, CMS and UI design for businesses across Australia and the UK."
      intro="I design and build websites for businesses in Brisbane and across Australia. That means brand-led sites with a clean, fast front end, content systems clients can run themselves, and the same care for type and detail that goes into the identity work. Below is a selection of web and UI projects, from full Framer builds to product interfaces."
      terms={["web", "ui", "framer"]}
    />
  );
}
