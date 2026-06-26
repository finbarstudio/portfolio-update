import type { Metadata } from "next";
import SandboxLinkButton from "@/components/sandbox/SandboxLinkButton";

export const metadata: Metadata = {
  title: "Library",
  description:
    "A reference library of effects from finbar✶studio — motion and rendering techniques worth keeping around. First up: a 1950s drum-credits roll.",
  robots: { index: false, follow: true },
};

const EFFECTS = [{ title: "Drum Credits", href: "/library/drum-credits" }];

export default function LibraryPage() {
  return (
    <section className="sb-mockups">
      {EFFECTS.map((fx) => (
        <SandboxLinkButton key={fx.href} href={fx.href}>
          {fx.title}
        </SandboxLinkButton>
      ))}
    </section>
  );
}
