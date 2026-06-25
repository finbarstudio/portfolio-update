import type { Metadata } from "next";
import Link from "next/link";

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
        <Link key={fx.href} href={fx.href} className="sb-mock-btn">
          {fx.title}
        </Link>
      ))}
    </section>
  );
}
