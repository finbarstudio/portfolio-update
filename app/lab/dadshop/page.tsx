import type { Metadata } from "next";
import DadApp from "@/components/dad-shop/app/DadApp";

export const metadata: Metadata = {
  title: "Dad's Shop",
  description: "A shopping helper for Sainsbury's Chislehurst.",
  robots: { index: false, follow: false },
};

/** The home page: the whole app (search, offers, For you, meal deals, my list, past shops) in one screen. */
export default function HomePage() {
  return <DadApp />;
}
