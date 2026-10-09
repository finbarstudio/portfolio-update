import type { Metadata } from "next";
import { Studio } from "@/components/mockup-studio/studio/studio";
import "./mockup.css";

/**
 * Lab 0008: mockup studio. 3D device mockups with a keyframed camera, lights
 * and export. A tool, not a page of the lab: it covers the screen with its
 * own layout, so none of the lab's chrome shows.
 */
export const metadata: Metadata = {
  title: "Mockup studio",
  robots: { index: false, follow: false },
};

export default function MockupPage() {
  return (
    <div className="ms-tool">
      <Studio />
    </div>
  );
}
