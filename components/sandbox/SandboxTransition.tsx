"use client";

/**
 * SandboxTransition — slides the page content in on every sandbox route change,
 * in the same direction the nav highlight slides (mockups = from the right, home
 * = from the left). Keyed by pathname so each navigation remounts + replays the
 * CSS slide. Pure CSS motion; respects prefers-reduced-motion.
 */

import { usePathname } from "next/navigation";

export default function SandboxTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onMockups = pathname.includes("mockup");
  return (
    <div key={pathname} className="sb-page" data-dir={onMockups ? "right" : "left"}>
      {children}
    </div>
  );
}
