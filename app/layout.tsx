import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Archivo, Space_Mono, Noto_Sans_Symbols_2 } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Body + mono/label text. The H1 display serif is Bookmania, loaded from Adobe
// Fonts (Typekit) via the <link> in <body>; --font-display in globals uses it.
const archivoNarrow = Archivo_Narrow({
  variable: "--font-archivo-narrow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Archivo (variable weight) — the World Cup ENGLAND wordmark; weight reacts to
// the cursor via font-variation-settings.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  display: "swap",
});

// Space Mono — wide-tracked caps for small details (dates, badges, links).
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

// Dingbat/symbol font (OFL) — quirky Unicode glyphs set inline in the
// big-type disciplines wall on the home page. --font-dingbat in globals.
const notoSymbols = Noto_Sans_Symbols_2({
  variable: "--font-dingbat",
  subsets: ["symbols"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Finbar Studio | Brisbane Graphic & Web Design",
    template: "%s | Finbar Studio",
  },
  description:
    "Brisbane graphic design and web design studio working in brand identity, websites, editorial and motion. Selected projects for businesses across Australia and the UK.",
  applicationName: "finbar✶studio",
  authors: [{ name: "Finbar Skitini", url: SITE_URL }],
  creator: "Finbar Skitini",
  publisher: "Finbar Skitini",
  keywords: [
    "Brisbane web design",
    "web design Brisbane",
    "Brisbane web designer",
    "website design Brisbane",
    "Brisbane graphic design",
    "Brisbane graphic designer",
    "graphic designer Brisbane",
    "brand identity designer Brisbane",
    "logo designer Brisbane",
    "freelance graphic designer Brisbane",
    "creative studio Brisbane",
    "editorial design",
    "motion graphics",
    "Finbar Skitini",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Finbar Studio | Brisbane Graphic & Web Design",
    description:
      "Brisbane graphic design and web design studio working in brand identity, websites, editorial and motion for businesses across Australia and the UK.",
    url: SITE_URL,
    siteName: "finbar✶studio",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finbar Studio | Brisbane Graphic & Web Design",
    description:
      "Brisbane graphic design and web design — brand identity, websites, editorial and motion.",
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
  themeColor: "#F6EFE1",
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
  jobTitle: "Graphic Designer",
  description:
    "Brisbane graphic designer working in brand identity, editorial, web and motion design.",
  email: "finbar@finbar.studio",
  telephone: "+61412796630",
  knowsLanguage: ["en-AU", "en-GB"],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  // Occupations, for richer entity understanding.
  hasOccupation: [
    {
      "@type": "Occupation",
      name: "Graphic Designer",
      occupationLocation: { "@type": "City", name: "Brisbane" },
      skills:
        "Brand identity, logo design, editorial and publication design, infographic design, motion graphics",
    },
    {
      "@type": "Occupation",
      name: "Web & UI Designer",
      occupationLocation: { "@type": "City", name: "Brisbane" },
      skills:
        "Website design, UI design, brand-led web design, creative direction",
    },
  ],
  // Services offered — helps surface the practice as a hireable studio.
  makesOffer: [
    "Brand Identity",
    "Logo Design",
    "Editorial & Publication Design",
    "Web & UI Design",
    "Motion Graphics",
    "Creative Direction",
  ].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
  brand: { "@type": "Brand", name: "finbar✶studio" },
  nationality: { "@type": "Country", name: "United Kingdom" },
  alumniOf: [
    { "@type": "EducationalOrganization", name: "Ravensbourne University London" },
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

// The studio as a hireable service — anchors "Brisbane web design" / "Brisbane
// graphic design" local intent. ProfessionalService (a LocalBusiness subtype)
// with the area served + a catalogue of services, provided by the one Person.
const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${SITE_URL}/#studio`,
  name: "finbar✶studio",
  alternateName: "Finbar Studio",
  description:
    "Brisbane graphic design and web design studio — brand identity, websites, editorial and motion for businesses across Australia and the UK.",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  email: "finbar@finbar.studio",
  telephone: "+61412796630",
  priceRange: "$$",
  founder: { "@id": PERSON_ID },
  provider: { "@id": PERSON_ID },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  areaServed: [
    { "@type": "City", name: "Brisbane" },
    { "@type": "State", name: "Queensland" },
    { "@type": "Country", name: "Australia" },
    { "@type": "Country", name: "United Kingdom" },
  ],
  knowsLanguage: ["en-AU", "en-GB"],
  sameAs: [
    "https://linkedin.com/in/finbarskitini",
    "https://x.com/finbarstudio",
    "https://instagram.com/finbar.studio",
    "https://are.na/finbar-studio",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Design services",
    itemListElement: [
      "Web Design",
      "Website Design & Development",
      "Graphic Design",
      "Brand Identity & Logo Design",
      "Editorial & Publication Design",
      "Motion Graphics",
      "Creative Direction",
    ].map((name) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name,
        areaServed: { "@type": "City", name: "Brisbane" },
        provider: { "@id": PERSON_ID },
      },
    })),
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${archivoNarrow.variable} ${archivo.variable} ${spaceMono.variable} ${notoSymbols.variable}`}
    >
      <body className="bg-bg text-ink font-sans antialiased min-h-screen">
        {/* Bookmania (Adobe Fonts / Typekit) — H1 display serif */}
        <link rel="stylesheet" href="https://use.typekit.net/rlo3ixj.css" />
        {/* Routes bring their own chrome: portfolio routes via app/(site)/layout
            (the sidebar shell); the Sandbox + embeds via their own bare layouts. */}
        {children}
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
        <Script
          id="ld-studio"
          type="application/ld+json"
          strategy="beforeInteractive"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </body>
    </html>
  );
}
