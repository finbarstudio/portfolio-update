import { jsonLdHtml } from "@/lib/json-ld";
import type { Metadata, Viewport } from "next";
import { Archivo, Host_Grotesk, Space_Mono, Noto_Sans_Symbols_2 } from "next/font/google";
import TempusKernel from "@/components/TempusKernel";
import MetaPixel from "@/components/MetaPixel";
import CookieNotice from "@/components/CookieNotice";
import { META_PIXEL_ID } from "@/lib/meta-const";
import "./globals.css";

// Archivo (variable weight) — the numeral/body face for the demo sites; weight reacts to
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

// Display grotesque for big titles (hero, site-list rows).
const hostGrotesk = Host_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-host",
  display: "swap",
});

// Dingbat/symbol font (OFL) — quirky Unicode glyphs set inline in the
// big-type disciplines wall on the home page. --font-dingbat in globals.
// display:block (not swap) so the glyph slot stays invisible until the symbol
// font is ready, instead of painting .notdef tofu boxes in the mono fallback
// (which lacks these glyphs) and flashing a grey box / size jump.
const notoSymbols = Noto_Sans_Symbols_2({
  variable: "--font-dingbat",
  subsets: ["symbols"],
  weight: ["400"],
  display: "block",
  // 230KB symbols file used for a handful of inline icons — by far the
  // heaviest font on the site. Never preload it ahead of the text fonts;
  // display:block keeps the icons invisible (not tofu) until it arrives.
  preload: false,
});

const SITE_URL = "https://www.finbar.studio";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Brisbane Web Design & Development Studio | Finbar Studio",
    template: "%s | Finbar Studio",
  },
  description:
    "Brisbane web design and development studio building custom websites, with brand identity, editorial and motion design behind them. Selected projects for businesses across Australia and the UK.",
  applicationName: "Finbar Studio",
  authors: [{ name: "Finbar Skitini", url: SITE_URL }],
  creator: "Finbar Skitini",
  publisher: "Finbar Skitini",
  // No site-wide `keywords`: Google ignores the tag, and a global list bleeds
  // Brisbane-web-design terms onto unrelated pages (e.g. the journal), which
  // reads as a non-per-post template. Pages that want keywords set their own.
  alternates: { canonical: "/" },
  openGraph: {
    title: "Brisbane Web Design & Development Studio | Finbar Studio",
    description:
      "Brisbane web design and development studio building custom websites, with brand identity, editorial and motion design behind them, for businesses across Australia and the UK.",
    url: SITE_URL,
    siteName: "Finbar Studio",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brisbane Web Design & Development Studio | Finbar Studio",
    description:
      "Brisbane web design and development. Custom websites, brand identity, editorial and motion.",
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
    title: "Finbar Studio",
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
  brand: { "@type": "Brand", name: "Finbar Studio" },
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
  name: "Finbar Studio",
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
  name: "Finbar Studio",
  alternateName: "finbar.studio",
  description:
    "Brisbane graphic design and web design studio. Brand identity, websites, editorial and motion for businesses across Australia and the UK.",
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
      className={`${archivo.variable} ${spaceMono.variable} ${hostGrotesk.variable} ${notoSymbols.variable}`}
    >
      <head>
        {/* Meta base pixel in <head>, init ONLY: every track (PageView per
            route, Schedule on booking) fires from client code with an
            event_id, dual-channel with the /api/meta Conversions API relay,
            so Meta dedups the pairs. A tracked PageView here would have no
            event_id and double-count against its server twin. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');`,
          }}
        />
      </head>
      {/* suppressHydrationWarning: browser extensions (e.g. ColorZilla adds
          cz-shortcut-listen) mutate <body> before hydration; suppress the
          attribute-mismatch warning for this node only, not its children. */}
      <body className="bg-bg text-ink font-sans antialiased min-h-screen" suppressHydrationWarning>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            alt=""
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
        {/* One shared rAF loop (tempus): absorbs every native requestAnimationFrame
            — Lenis, canvas effects, R3F, GSAP — into a single ordered loop. */}
        <TempusKernel />
        {/* PageView per client-side navigation (the head snippet only fires the
            first one; App Router route changes don't reload the page). */}
        <MetaPixel />
        {/* Bookmania (Typekit) was removed: --font-display is referenced nowhere
            and HeroHeadline is unmounted, so the render-blocking third-party
            stylesheet was pure LCP cost on every page. */}
        {/* Routes bring their own chrome: portfolio routes via app/(site)/layout
            (the sidebar shell); the Sandbox + embeds via their own bare layouts. */}
        {children}
        {/* Informational cookie/tracking notice (dismissible, remembered). */}
        <CookieNotice />
        {/* JSON-LD as plain inline <script> tags (the pattern the Next docs
            recommend) — next/script beforeInteractive re-renders these on the
            client and React warns the script "will never execute", which is
            noise for data-only ld+json blocks. */}
        <script
          id="ld-person"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(personJsonLd) }}
        />
        <script
          id="ld-website"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(websiteJsonLd) }}
        />
        <script
          id="ld-studio"
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(serviceJsonLd) }}
        />
      </body>
    </html>
  );
}
