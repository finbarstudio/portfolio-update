import type { Metadata } from "next";
import MacMockupTool from "@/components/sandbox/MacMockupTool";

export const metadata: Metadata = {
  title: "Mac Mockup",
  description:
    "Customize a 3D Studio Display mockup with your own screenshot or screen recording, then export a looping turntable video, stills, a GIF or an embed.",
  // Tool page is interactive/client-only — keep it out of the index for MVP.
  robots: { index: false, follow: true },
};

export default function MacMockupPage() {
  return <MacMockupTool />;
}
