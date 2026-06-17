import type { Metadata } from "next";

const SANDBOX_URL = "https://sandbox.finbar.studio";

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
      <div className="sb-content">{children}</div>
      <div className="sb-screen-mask" aria-hidden="true" />
    </div>
  );
}
