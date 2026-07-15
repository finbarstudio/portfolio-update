"use client";

import { resetIntro } from "./intro";

/**
 * Link from the marketing/pitch page into the demo. Clears the preloader gate on
 * click so the branded intro plays every time the demo is opened from the pitch.
 * Kept as a plain <a> (full reload between portfolio and the demo, matching the
 * other pitch links); internal demo navigation + refresh stay gated.
 */
export default function DemoLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className} onClick={() => resetIntro()}>
      {children}
    </a>
  );
}
