import type { Metadata } from "next";
import BezierStudio from "@/components/sandbox/tools/BezierStudio";

export const metadata: Metadata = {
  title: "Bezier Studio",
  description:
    "Paste or upload an SVG and visualise its bezier curves, anchor points and control handles as a styleable specimen plate — then export a crisp SVG or PNG for portfolio assets.",
  robots: { index: false, follow: true },
};

export default function BezierStudioPage() {
  return <BezierStudio />;
}
