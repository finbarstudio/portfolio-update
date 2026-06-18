"use client";

// Top nav bar. For now every item is a plain pill tag (the .tag token, same as
// the intro "menu" button) — to be refined later.

import Link from "next/link";
import { usePathname } from "next/navigation";

const SANDBOX_HREF = "https://sandbox.finbar.studio";

const items = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
];

export default function TopNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname.startsWith(href) || (href === "/work" && pathname.startsWith("/case-studies/"));

  return (
    <header className="top-nav" role="banner">
      <nav className="top-nav-inner" aria-label="Primary">
        {items.map((it) => (
          <Link
            key={it.href}
            href={it.href}
            aria-current={isActive(it.href) ? "page" : undefined}
            className={`tag ${isActive(it.href) ? "tag-pink" : "tag-default"}`}
          >
            {it.label}
          </Link>
        ))}
        <a href={SANDBOX_HREF} className="tag tag-default">
          Sandbox ↗
        </a>
      </nav>
    </header>
  );
}
