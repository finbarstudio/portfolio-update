import type { Metadata, Viewport } from "next";
import { Archivo_Narrow } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";

// Single font family. Archivo Narrow used for both body and mono/label text.
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Finbar Studio | Brisbane Graphic Designer & Framer Developer",
    template: "%s | Finbar Studio",
  },
  description:
    "Brisbane-based graphic designer and Framer developer. See selected web design and branding projects built for real clients across Australia.",
  applicationName: "finbar✶studio",
  authors: [{ name: "Finbar Skitini", url: SITE_URL }],
  creator: "Finbar Skitini",
  publisher: "Finbar Skitini",
  keywords: [
    "Finbar Skitini",
    "Finbar Studio",
    "graphic designer Brisbane",
    "Framer developer",
    "brand identity designer",
    "Brisbane web designer",
    "publication design",
    "motion graphics",
    "NDIS brand design",
    "freelance designer Australia",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Skitini | Brisbane Graphic Designer & Framer Developer",
    description:
      "Brisbane-based graphic designer and Framer developer. See selected web design and branding projects built for real clients across Australia.",
    url: SITE_URL,
    siteName: "finbar✶studio",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finbar Skitini | Brisbane Graphic Designer & Framer Developer",
    description:
      "Brisbane-based graphic designer and Framer developer. See selected web design and branding projects built for real clients across Australia.",
    creator: "@finbarstudio",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // Icons are auto-detected from the file conventions in /app
  // (favicon.ico, icon.tsx, apple-icon.tsx) — no manual list needed.
  appleWebApp: {
    capable: true,
    title: "finbar✶studio",
    statusBarStyle: "default",
  },
  // The site uses explicit tel:/mailto: links, so stop iOS Safari from
  // auto-detecting and restyling phone numbers and addresses in body copy.
  formatDetection: { telephone: false, address: false, email: false },
  category: "Design",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#FAFAF8",
};

// Stable node id so other schema graphs can reference this one Person.
const PERSON_ID = `${SITE_URL}/#person`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Finbar Skitini",
  alternateName: "Finbar Studio",
  url: SITE_URL,
  image: `${SITE_URL}/images/headshot.webp`,
  jobTitle: "Graphic Designer & Framer Developer",
  description:
    "Brisbane-based graphic designer and Framer developer. Brand identity, web, publication and motion design.",
  email: "mailto:finbar@finbar.studio",
  telephone: "+61412796630",
  knowsLanguage: ["en-AU", "en-GB"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  // Designer + developer occupations, for richer entity understanding.
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Graphic Designer",
      occupationLocation: { "@type": "City", name: "Brisbane" },
      skills:
        "Brand identity, logo design, publication design, infographic design, motion graphics",
    },
    {
      "@type": "Occupation",
      name: "Framer Developer",
      occupationLocation: { "@type": "City", name: "Brisbane" },
      skills:
        "Framer development, CMS setup, custom interactive components, web accessibility, SEO foundations",
    },
  ],
  // Services offered — helps surface the practice as a hireable studio.
  makesOffer: [
    "Brand Identity",
    "Logo Design",
    "Framer Website Development",
    "Publication Design",
    "Motion Graphics",
    "Web Accessibility",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
  brand: { "@type": "Brand", name: "finbar✶studio" },
  nationality: { "@type": "Country", name: "United Kingdom" },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "University of Brighton" },
  ],
  knowsAbout: [
    "Brand Identity",
    "Logo Design",
    "Framer Development",
    "Publication Design",
    "Motion Graphics",
    "Web Design",
    "Accessibility",
  ],
  sameAs: [
    "https://linkedin.com/in/finbarskitini",
    "https://x.com/finbarstudio",
    "https://instagram.com/finbar.studio",
    "https://are.na/finbar-studio",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  name: "finbar✶studio",
  alternateName: "Finbar Skitini Portfolio",
  url: SITE_URL,
  inLanguage: "en-AU",
  publisher: { "@id": PERSON_ID },
  about: { "@id": PERSON_ID },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={archivoNarrow.variable}
    >
      <body className="bg-bg text-ink font-sans antialiased min-h-screen">
        <LayoutShell>{children}</LayoutShell>
        <Script
          id="ld-person"
          type="application/ld+json"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
