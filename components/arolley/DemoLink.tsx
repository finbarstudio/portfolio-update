"use client";

import Link from "next/link";
import { resetIntro } from "./intro";

/**
 * Link from the marketing/pitch page into a demo. Resets the preloader gate on
 * click so the branded intro plays every time the demo is opened from the pitch
 * (same-tab navigation). Internal demo navigation + refresh stay gated.
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
    <Link href={href} className={className} onClick={() => resetIntro()}>
      {children}
    </Link>
  );
}
