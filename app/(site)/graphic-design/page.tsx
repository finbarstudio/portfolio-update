import type { Metadata } from "next";
import ServiceLanding from "@/components/ServiceLanding";

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  title: { absolute: "Brisbane Graphic Design | Finbar Studio" },
  description:
    "Brisbane graphic design. Brand identity, logos, editorial, print and art direction for businesses across Australia and the UK. See selected projects.",
  alternates: { canonical: "/graphic-design" },
  openGraph: {
    title: "Brisbane Graphic Design | Finbar Studio",
    description:
      "Brand identity, logos, editorial, print and art direction from a Brisbane studio. Selected graphic design projects.",
    url: `${SITE_URL}/graphic-design`,
    type: "website",
  },
};

export default function GraphicDesignPage() {
  return (
    <ServiceLanding
      slug="graphic-design"
      label="Service · Brisbane"
      heading="Brisbane graphic design"
      serviceName="Graphic Design"
      description="Brisbane graphic design. Brand identity, logos, editorial, print and art direction for businesses across Australia and the UK."
      intro="Graphic design is the core of the studio. Brand identities, logos, editorial and print, packaging and art direction for clients in Brisbane, around Australia and in the UK. Below is a selection of graphic design work spanning identity systems, publications and campaigns."
      terms={["brand", "publication", "print", "editorial", "infographic", "information", "art direction", "cover", "packaging"]}
    />
  );
}
