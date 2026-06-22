"use client";

/**
 * ContactCta — opens the global ContactPanel drawer (mounted in LayoutShell) by
 * dispatching the same "contact:open" event the nav button uses. Lets any page
 * drop in a "talk to me" button without its own drawer.
 */

import type { ReactNode } from "react";

export default function ContactCta({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("contact:open"))}
    >
      {children}
    </button>
  );
}
