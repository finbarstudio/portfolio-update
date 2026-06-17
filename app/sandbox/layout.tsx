import type { Metadata } from "next";
import Link from "next/link";
import BrandStar from "@/components/BrandStar";

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

function SandboxHeader() {
  return (
    <header className="sb-header">
      <Link href="/" className="sb-wordmark" aria-label="finbar studio Sandbox, home">
        finbar<BrandStar className="sb-star" size="0.82em" />studio
        <span className="sb-header-tag mono-label">Sandbox</span>
      </Link>
      <nav className="sb-header-nav mono-label" aria-label="Sandbox">
        <Link href="/"><span className="sb-nav-num">01</span>Tools</Link>
        <a href="https://www.finbar.studio" target="_blank" rel="noopener noreferrer">
          <span className="sb-nav-num">02</span>finbar.studio ↗
        </a>
      </nav>
    </header>
  );
}

export default function SandboxLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sb-root">
      <SandboxHeader />
      <div className="sb-content">{children}</div>
      <footer className="sb-footer mono-label">
        <span className="sb-foot-left">
          <span className="sb-mark">(FS<span className="sb-mark-dot">·</span>SB)<sup className="sb-reg">®</sup></span>
          finbar<BrandStar className="sb-star" size="0.82em" />studio Sandbox
        </span>
        <span>Experimental · Built with Claude</span>
      </footer>
    </div>
  );
}
