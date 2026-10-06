import "./lab.css";
import type { Metadata, Viewport } from "next";
import LabRoot from "@/components/lab/LabRoot";

const LAB_URL = "https://lab.finbar.studio";

const LAB_DESC = "Things made and not published anywhere else yet. From Finbar Studio, London.";

// metadataBase points at the subdomain so canonical URLs resolve to
// lab.finbar.studio (the host this section is served on), not the www apex.
export const metadata: Metadata = {
  metadataBase: new URL(LAB_URL),
  // `absolute` so the root layout's "| Finbar Studio" template is not appended.
  title: {
    absolute: "Finbar Studio Lab",
    template: "%s · Lab",
  },
  description: LAB_DESC,
  alternates: { canonical: LAB_URL },
  // The card itself is app/lab/opengraph-image.tsx; Next adds it to both.
  openGraph: {
    title: "Finbar Studio Lab",
    description: LAB_DESC,
    url: LAB_URL,
    siteName: "Finbar Studio Lab",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Finbar Studio Lab",
    description: LAB_DESC,
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

// Lives OUTSIDE app/(site), so it gets only the root layout (fonts): no
// portfolio nav/footer. Intentional. LabRoot owns the black opening state.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <LabRoot>{children}</LabRoot>;
}
