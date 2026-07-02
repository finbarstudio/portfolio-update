import type { Metadata } from "next";
import { Barlow_Semi_Condensed, Chivo, Inter, Fragment_Mono, Libre_Baskerville } from "next/font/google";
import "./toombul-site.css";

// Toombul District Cricket Club — a redesign demo, ripped from toombulcricket.com.
// Lives outside the (site) route group, so it inherits only the root
// html/body (fonts) and never mounts the portfolio's LayoutShell chrome.
// Not linked from anywhere on the main site and excluded from the sitemap —
// reachable only by direct URL.
//
// Fonts are the club's OWN real stack (read from their live theme CSS,
// wp-content/themes/Toombul CC/assets/css/toombul-cc.min.css), not the
// portfolio's — this is a refresh of Toombul's brand, not Finbar's:
// Barlow Semi Condensed (hero title), Chivo (section headings, 900 italic
// caps), Inter (body), Fragment Mono (buttons/labels, italic uppercase).
const barlow = Barlow_Semi_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});
const chivo = Chivo({
  variable: "--font-chivo",
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});
const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});
// The crest voice: the interlocked TDCC monogram on their logo is a classical
// transitional Roman serif (Baskerville-style bracketed serifs). Used for the
// hero monument so the biggest type on the page speaks in the crest's face.
const libreBaskerville = Libre_Baskerville({
  variable: "--font-crest",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Toombul District Cricket Club" },
  description:
    "Toombul District Cricket Club. Brisbane Premier Grade cricket since 1882. A redesign demo by Finbar Studio.",
  robots: { index: false, follow: false },
  alternates: { canonical: undefined },
};

export default function ToombulLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`tc-site ${barlow.variable} ${chivo.variable} ${inter.variable} ${fragmentMono.variable} ${libreBaskerville.variable}`}>
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: ".tc-site .tc-reveal{opacity:1;transform:none}" }} />
      </noscript>
      {children}
    </div>
  );
}
