import "./gemfest.css";
import type { Metadata } from "next";
import GemfestHero from "@/components/lab/gemfest/GemfestHero";

export const metadata: Metadata = {
  title: "GemFest",
  description: "Scroll the constellation.",
};

// Just the hero sequence: constellation, into the logo window, into the video.
// No GemFest nav, menu, sections or footer.
export default function GemfestPage() {
  return <GemfestHero />;
}
