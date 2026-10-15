import type { Metadata } from "next";
import MotionTool from "@/components/motion-presets/MotionTool";
import "./motion.css";

/**
 * Lab 0005: motion presets. Fifty looping layouts for a set of images or
 * videos. A tool, not a page of the lab: it covers the screen with its own
 * layout, so none of the lab's chrome shows.
 *
 * The source lives in finbar.studio/Lab/motion-tool. The site's copy is
 * overwritten by that folder's scripts/sync-to-lab.sh, so edit it there.
 */
export const metadata: Metadata = {
  title: "Motion presets",
  robots: { index: false, follow: false },
};

export default function MotionPage() {
  return <MotionTool />;
}
