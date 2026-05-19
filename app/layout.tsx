import type { Metadata } from "next";
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

const SITE_URL = "https://finbar.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "finbar✶studio | Graphic Designer & Framer Developer in Brisbane",
    template: "%s | finbar✶studio",
  },
  description:
    "Finbar Skitini is a graphic designer and Framer developer based in Brisbane. Brand identity, web, publication and motion design. 4+ years of experience. Open for work.",
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
    title: "finbar✶studio | Graphic Designer & Framer Developer",
    description:
      "Brand identity, web, publication and motion design from Brisbane. Open for full-time and freelance.",
    url: SITE_URL,
    siteName: "finbar✶studio",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "finbar✶studio | Graphic Designer & Framer Developer",
    description:
      "Brand identity, web, publication and motion design from Brisbane. Open for work.",
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
  icons: {
    icon: "/favicon.ico",
  },
  category: "Design",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Finbar Skitini",
  alternateName: "Finbar Studio",
  url: SITE_URL,
  jobTitle: "Graphic Designer & Framer Developer",
  description:
    "Brisbane-based graphic designer and Framer developer. Brand identity, web, publication and motion design.",
  email: "mailto:finbar@finbar.studio",
  telephone: "+61412796630",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
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
  name: "finbar✶studio",
  url: SITE_URL,
  inLanguage: "en-AU",
  publisher: { "@type": "Person", name: "Finbar Skitini" },
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
