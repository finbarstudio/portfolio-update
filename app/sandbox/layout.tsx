import type { Metadata, Viewport } from "next";
import SandboxNav from "@/components/sandbox/SandboxNav";
import SandboxTransition from "@/components/sandbox/SandboxTransition";

const SANDBOX_URL = "https://sandbox.finbar.studio";

// The sandbox reads as a dark "device screen" framed by the rounded mask, so tint
// iOS Safari's top/bottom chrome to match the bezel (--sb-screen-frame) — the
// portfolio root sets a warm cream, which otherwise shows as a light strip past
// the rounded edges at the very top/bottom.
export const viewport: Viewport = {
  themeColor: "#1C1C1C",
};

export const metadata: Metadata = {
  title: {
    default: "Sandbox",
    template: "%s — Sandbox · finbar✶studio",
  },
  description:
    "Free creative tools from finbar✶studio. First up: a customizable 3D phone-mockup generator — drop in your media and export looping video, stills, GIFs or an embed.",
  alternates: { canonical: SANDBOX_URL },
  openGraph: {
    title: "Sandbox · finbar✶studio",
    description: "Free creative tools from finbar✶studio. First up: a 3D phone-mockup generator.",
    url: SANDBOX_URL,
    type: "website",
  },
};

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-root">
      <SandboxNav />
      {/* The device "screen": a fixed, rounded, clipped scroller. Content scrolls
          inside it; the document itself never does — so iOS Safari's top/bottom
          chrome stays put and nothing leaks past the rounded edges. */}
      <div className="sb-screen">
        <div className="sb-content">
          <SandboxTransition>{children}</SandboxTransition>
        </div>
      </div>
    </div>
  );
}
