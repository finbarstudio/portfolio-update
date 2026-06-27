import type { Metadata, Viewport } from "next";
import SandboxNav from "@/components/sandbox/SandboxNav";
import SandboxTransition from "@/components/sandbox/SandboxTransition";
import SuggestionWidget from "@/components/sandbox/SuggestionWidget";

const SANDBOX_URL = "https://sandbox.finbar.studio";

// The sandbox reads as a dark "device screen" framed by the rounded mask, so tint
// iOS Safari's top/bottom chrome to match the bezel (--sb-screen-frame) — the
// portfolio root sets a warm cream, which otherwise shows as a light strip past
// the rounded edges at the very top/bottom.
export const viewport: Viewport = {
  themeColor: "#1C1C1C",
};

const SANDBOX_DESC =
  "Free in-browser creative tools from finbar✶studio: Bezier Studio, a 3D SVG studio, phone and Mac mockup generators, and an effects library. Export crisp SVG, PNG, video, GIF or an embed.";

// metadataBase points at the subdomain so OG/Twitter image + canonical URLs all
// resolve to sandbox.finbar.studio (the host the Sandbox is actually served on),
// not the www apex the root layout sets.
export const metadata: Metadata = {
  metadataBase: new URL(SANDBOX_URL),
  title: {
    default: "Sandbox · finbar✶studio — free creative tools",
    template: "%s · Sandbox · finbar✶studio",
  },
  description: SANDBOX_DESC,
  applicationName: "finbar✶studio Sandbox",
  category: "Design tools",
  keywords: [
    "free design tools",
    "bezier curve tool",
    "SVG to 3D",
    "phone mockup generator",
    "mac mockup generator",
    "browser design tools",
    "finbar studio",
  ],
  alternates: { canonical: SANDBOX_URL },
  openGraph: {
    title: "Sandbox · finbar✶studio — free creative tools",
    description: SANDBOX_DESC,
    url: SANDBOX_URL,
    siteName: "finbar✶studio Sandbox",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sandbox · finbar✶studio — free creative tools",
    description: SANDBOX_DESC,
    creator: "@finbarstudio",
  },
};

// Structured data: a WebSite + an ItemList of the free tools, so search engines
// can surface the Sandbox as a collection of free, browser-based design tools.
const tool = (pos: number, name: string, description: string, path: string) => ({
  "@type": "ListItem",
  position: pos,
  item: {
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${SANDBOX_URL}${path}`,
    applicationCategory: "DesignApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "AUD" },
    author: { "@type": "Organization", name: "finbar✶studio", url: "https://www.finbar.studio" },
  },
});

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SANDBOX_URL}/#website`,
      url: SANDBOX_URL,
      name: "finbar✶studio Sandbox",
      description: "Free in-browser creative tools from finbar✶studio.",
      inLanguage: "en-AU",
      publisher: { "@type": "Organization", name: "finbar✶studio", url: "https://www.finbar.studio" },
    },
    {
      "@type": "ItemList",
      name: "finbar✶studio Sandbox tools",
      itemListElement: [
        tool(1, "Bezier Studio", "Visualise an SVG's bezier curves, anchors and control handles as a styleable specimen, then export SVG, PNG, video or GIF.", "/bezier"),
        tool(2, "3D SVG Studio", "Extrude an SVG into 3D, light it, keyframe it on a timeline and export video, a transparent PNG or an embed.", "/asterisk"),
        tool(3, "Phone Mockup", "Drop your own media onto a 3D iPhone and export looping video, stills, GIFs or an embed.", "/phone-mockup"),
        tool(4, "Mac Mockup", "Place your screen onto a 3D Mac and export video, stills or an embed.", "/mac-mockup"),
      ],
    },
  ],
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-root">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <SandboxNav />
      {/* The device "screen": a fixed, rounded, clipped scroller. Content scrolls
          inside it; the document itself never does — so iOS Safari's top/bottom
          chrome stays put and nothing leaks past the rounded edges. */}
      <div className="sb-screen">
        <div className="sb-content">
          <SandboxTransition>{children}</SandboxTransition>
        </div>
      </div>
      <SuggestionWidget />
    </div>
  );
}
