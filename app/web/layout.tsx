import "./web.css";
import type { Metadata, Viewport } from "next";
import WebHeader from "@/components/web/WebHeader";
import WebFooter from "@/components/web/WebFooter";

const WEB_URL = "https://web.finbar.studio";

const WEB_DESC =
  "A catalogue of good websites, one at a time. From Finbar Studio, Brisbane. Also on Instagram as @web.finbar.";

// metadataBase points at the subdomain so OG/Twitter image + canonical URLs all
// resolve to web.finbar.studio (the host this section is actually served on),
// not the www apex the root layout sets.
export const metadata: Metadata = {
  metadataBase: new URL(WEB_URL),
  // `absolute` so the root layout's "| Finbar Studio" template does not get
  // appended: this section reads as its own site.
  title: {
    absolute: "web.finbar · websites worth clicking",
    template: "%s · web.finbar",
  },
  description: WEB_DESC,
  alternates: { canonical: WEB_URL },
  openGraph: {
    title: "web.finbar · websites worth clicking",
    description: WEB_DESC,
    url: WEB_URL,
    siteName: "web.finbar",
    locale: "en_AU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "web.finbar · websites worth clicking",
    description: WEB_DESC,
    creator: "@finbarstudio",
  },
};

export const viewport: Viewport = {
  themeColor: "#eeeeee",
};

// This route lives OUTSIDE app/(site), so it gets only the root layout (fonts,
// Meta pixel, CookieNotice) — no portfolio nav/footer. Intentional.
export default function WebLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wf-root">
      <WebHeader />
      <main>{children}</main>
      <WebFooter />
    </div>
  );
}
