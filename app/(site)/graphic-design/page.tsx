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
      excludeSlugs={["lows-design-build", "plated-with-issy", "lola-audio", "kinaya"]}
      capsTitle="What I do"
      capabilities={[
        "Brand identity and logo design",
        "Brand guidelines and creative direction",
        "Editorial, reports and print media",
        "Large-format and packaging artwork",
        "Motion graphics and social content",
        "Print-ready artworking",
      ]}
      ctaHeading="Got a brand or print project in mind?"
      faqs={[
        {
          q: "What graphic design services do you offer?",
          a: "Brand identity and logos, editorial and print, packaging, large-format artwork, and motion graphics for social. From a single logo to a full brand system and the artwork that follows it.",
        },
        {
          q: "Do you design full brand identities or just logos?",
          a: "Both. A logo on its own, or a complete identity with type, colour, guidelines and the templates a team needs to keep it consistent.",
        },
        {
          q: "Can you supply print-ready artwork?",
          a: "Yes. I artwork files properly for print, from business cards to large-format, so what leaves the studio is what comes back from the printer.",
        },
        {
          q: "Do you work with clients outside Brisbane?",
          a: "Yes. I am Brisbane-based and work with clients across Australia and the UK.",
        },
        {
          q: "How much does a design project cost?",
          a: "It depends on the scope. A single piece of artwork is different from a full brand system. Send me the brief and I will quote it.",
        },
        {
          q: "Do you also build websites?",
          a: "Yes. Web design and development is a big part of the studio. If your project needs both, the brand and the site can come from one place.",
        },
      ]}
    />
  );
}
