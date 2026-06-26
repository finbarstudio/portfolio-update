"use client";

/**
 * SandboxLinkButton — the pill button used on the Mockups / Tools / Library
 * index lists, with built-in click feedback: useLinkStatus reports the pending
 * state of *this* navigation the instant it's tapped (regardless of prefetch),
 * so the button dims and shows a spinner until the next page commits.
 */

import Link, { useLinkStatus } from "next/link";

function ButtonInner({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span className={`sb-mock-inner ${pending ? "is-pending" : ""}`}>
      <span className="sb-mock-label">{children}</span>
      <span className="sb-mock-spin" aria-hidden="true" />
    </span>
  );
}

export default function SandboxLinkButton({
  href,
  children,
  className = "sb-mock-btn",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={className}>
      <ButtonInner>{children}</ButtonInner>
    </Link>
  );
}
