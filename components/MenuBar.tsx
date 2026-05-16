"use client";

// Top-of-screen "Apple-menu" style bar.
// Always visible — gives the OS frame. Live local clock on the right.

import Link from "next/link";
import { useEffect, useState } from "react";

const MENU_ITEMS = ["File", "Edit", "View", "Window", "Help"];

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) return <span className="tabular-nums">--:--:--</span>;
  return (
    <span className="tabular-nums">
      {new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Brisbane",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now)}
    </span>
  );
}

export default function MenuBar() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-ink bg-bg flex items-center px-3"
      style={{
        height: "var(--menubar-h)",
        fontSize: "11px",
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}
      role="banner"
    >
      {/* Brand */}
      <Link
        href="/"
        className="flex items-center gap-1.5 font-bold uppercase tracking-[0.08em] hover:text-pink transition-colors"
        aria-label="finbar.studio — home"
      >
        <span className="pixel-star text-[14px]">✶</span>
        <span>finbar.studio</span>
      </Link>

      {/* Menu items — non-functional, just chrome */}
      <nav className="hidden sm:flex items-center gap-0 ml-5" aria-label="Menu">
        {MENU_ITEMS.map((m) => (
          <button
            key={m}
            type="button"
            className="px-2 py-0.5 text-ink hover:bg-ink hover:text-bg transition-colors"
            tabIndex={-1}
          >
            {m}
          </button>
        ))}
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-3 text-ink">
        <span className="hidden md:inline-flex items-center gap-1.5">
          <span className="status-dot" />
          <span className="text-teal font-bold tracking-[0.1em]">ONLINE</span>
        </span>
        <span className="text-ink-soft hidden sm:inline">BNE</span>
        <LiveClock />
      </div>
    </header>
  );
}
