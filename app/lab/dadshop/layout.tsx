import type { Metadata, Viewport } from "next";
import "./dad-app.css";

/**
 * Dad's shop: a private Sainsbury's helper, served at lab.finbar.studio/dadshop.
 * Hidden: not linked from the lab, not in the sitemap, and told to stay out of
 * search. The home page (DadApp) covers the whole screen with its own light
 * layout and header, so none of the lab's black chrome shows. The stylesheet is
 * scoped under .dad-app, so the error and not-found pages share it.
 */
export const metadata: Metadata = {
  title: "Dad's Shop",
  description: "A shopping helper for Sainsbury's Chislehurst.",
  robots: { index: false, follow: false },
};

// Light page on a phone: the browser bar follows it (the lab's own is black).
export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function DadShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
