import type { Metadata } from "next";
import PhoneMockupTool from "@/components/sandbox/PhoneMockupTool";

export const metadata: Metadata = {
  title: "Phone Mockup",
  description:
    "Customize a 3D iPhone mockup with your own images and videos, then export a looping video, stills, a GIF or an embed.",
  // Tool page is interactive/client-only — keep it out of the index for MVP.
  robots: { index: false, follow: true },
};

export default function PhoneMockupPage() {
  return <PhoneMockupTool />;
}
