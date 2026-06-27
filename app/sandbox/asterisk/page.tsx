import type { Metadata } from "next";
import AsteriskStudioClient from "@/components/sandbox/asterisk/AsteriskStudioClient";

export const metadata: Metadata = {
  title: "3D SVG Studio",
  description:
    "Extrude an SVG into 3D, light it, stack post-process effects, keyframe it on a timeline, and export video, a transparent PNG or an embed.",
  robots: { index: false, follow: true },
};

export default function AsteriskStudioPage() {
  return <AsteriskStudioClient />;
}
