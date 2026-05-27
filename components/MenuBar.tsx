"use client";

// Top-of-screen OS-style menu bar.
// Brand links home. Nav items link to real pages on desktop.
// Mobile: brand + hamburger (opens MobileMenu via prop).

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Work",    href: "/" },
  { label: "About",   href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Brisbane coords for Open-Meteo (free, no API key)
const BNE_LAT  = -27.47;
const BNE_LNG  = 153.02;

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

function WeatherDisplay() {
  const [temp, setTemp] = useState<number | null>(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${BNE_LAT}&longitude=${BNE_LNG}` +
      `&current=temperature_2m&timezone=Australia%2FBrisbane`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const t = d?.current?.temperature_2m;
        if (typeof t === "number") setTemp(Math.round(t));
      })
      .catch(() => {/* silently fail */});
  }, []);

  if (temp === null) return null;
  return (
    <span className="text-ink-soft hidden sm:inline tabular-nums">{temp}°</span>
  );
}

export default function MenuBar({
  onMobileMenuOpen,
}: {
  onMobileMenuOpen?: () => void;
}) {
  const pathname = usePathname();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b border-ink bg-bg flex items-center px-3 text-[12px] md:text-[11px]"
      style={{
        height: "var(--menubar-h)",
        letterSpacing: "0.04em",
        lineHeight: 1,
      }}
      role="banner"
    >
      {/* Brand, always links home */}
      <Link
        href="/"
        className="font-bold uppercase tracking-[0.08em] hover:text-pink transition-colors"
        aria-label="finbar.studio, home"
      >
        finbar<span className="pixel-star text-[13px]">✶</span>studio
      </Link>

      {/* Nav items, functional links, desktop only */}
      <nav className="hidden md:flex items-center gap-0 ml-5" aria-label="Primary">
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-0.5 transition-colors"
              style={{
                color: isActive ? "var(--bg)" : "var(--ink)",
                background: isActive ? "var(--ink)" : "transparent",
              }}
              aria-current={isActive ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-3 text-ink">
        <span className="hidden lg:inline-flex items-center gap-1.5">
          <span className="status-dot" />
          <span className="text-teal font-bold tracking-[0.1em]">ONLINE</span>
        </span>
        <span className="text-ink-soft hidden sm:inline">BNE</span>
        <WeatherDisplay />
        <LiveClock />

        {/* Mobile hamburger — real tap target */}
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation menu"
          className="md:hidden flex items-center justify-center text-ink hover:text-pink transition-colors -mr-2"
          style={{ width: 40, height: 40 }}
        >
          <svg width="22" height="16" viewBox="0 0 22 16" fill="none" aria-hidden="true">
            <path d="M1 1.5h20M1 8h20M1 14.5h20" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </header>
  );
}
