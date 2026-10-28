import type { Metadata, Viewport } from "next";
import { getCurrentUser } from "@/lib/food-shop/auth";
import { BASE_PATH, PRIVACY_PATH } from "@/lib/food-shop/paths";
import "./food-shop.css";

/**
 * Food Shop (beta): Finbar's Tesco helper for friends, at lab.finbar.studio/foodshop. The shop itself is his
 * own page (app/lab/foodshop/route.ts); this layout wraps only login, setup, settings and privacy, styled to
 * match it. Invite-only, hidden from search, none of the lab's chrome.
 */
export const metadata: Metadata = {
  title: "Food Shop (beta)",
  description: "Tesco offers and picks that suit you.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function FoodShopLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser().catch(() => null);
  return (
    <div className="fs-app">
      <header className="fs-hdr">
        <div className="hbar">
          {/* the shop is a plain page, not a Next route: ordinary links, no client-side navigation */}
          <a href={BASE_PATH} className="fs-brand">
            Food Shop <span className="fs-beta">beta</span>
          </a>
          {user?.setupDone && (
            <a href={BASE_PATH} className="pbtn fs-back">
              <b>Back to the shop</b>
            </a>
          )}
        </div>
      </header>
      <main className="fs-main">{children}</main>
      <footer className="fs-foot">
        <a href={PRIVACY_PATH}>Privacy</a>
      </footer>
    </div>
  );
}
