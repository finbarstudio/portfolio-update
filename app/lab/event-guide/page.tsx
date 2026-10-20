import type { Metadata } from "next";
import EventGuideTool from "@/components/event-guide/EventGuideTool";
import "@/components/event-guide/engine/core.css";
import "@/components/event-guide/engine/generators/exhibitors.css";
import "@/components/event-guide/engine/generators/locations.css";
import "./event-guide.css";

/**
 * Share to Buy event guide generator. Internal, for clients only: hidden on
 * purpose. No lab tile (not in content/lab-items.ts), no links to it, not in the
 * sitemap, and never indexed. A tool, not a page of the lab: it covers the screen
 * with its own layout, so none of the lab's chrome shows.
 */
export const metadata: Metadata = {
  title: "Event guide generator",
  robots: { index: false, follow: false },
};

export default function EventGuidePage() {
  return <EventGuideTool />;
}
