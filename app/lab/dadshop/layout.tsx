import type { Metadata, Viewport } from "next";
import TabBar from "@/components/dad-shop/TabBar";
import "./dad-shop.css";

/**
 * Dad's shop: a private Sainsbury's helper, served at lab.finbar.studio/dadshop.
 * Hidden: not linked from the lab, not in the sitemap, and told to stay out of
 * search. Like the email tool it covers the whole screen with its own light
 * layout, so none of the lab's black chrome shows.
 */
export const metadata: Metadata = {
  title: "Dad's shop",
  description: "A shopping list and helper for Sainsbury's.",
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
  return (
    <div className="ds-app">
      <main className="ds-main">{children}</main>
      <TabBar />
    </div>
  );
}
