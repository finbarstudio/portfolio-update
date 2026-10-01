import type { Metadata } from "next";
import PathwayTool from "@/components/stb/PathwayTool";
import "./pathway.css";

/**
 * Lab 0004: the Share to Buy pathway maker. A brand tool, not a page of the
 * lab: it covers the screen with its own layout, so none of the lab's black
 * chrome shows.
 */
export const metadata: Metadata = {
  title: "Pathway maker",
  robots: { index: false, follow: false },
};

export default function PathwayPage() {
  return <PathwayTool />;
}
