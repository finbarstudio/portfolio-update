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

// Map a WMO weather code to a compact inline icon. One stroke weight, currentColor.
function WeatherIcon({ code, size = 13 }: { code: number; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  // Clear
  if (code === 0)
    return (
      <svg {...common}><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" /></svg>
    );
  // Mainly clear / partly cloudy
  if (code === 1 || code === 2)
    return (
      <svg {...common}><circle cx="8" cy="8" r="3" /><path d="M8 2.5v1.5M2.5 8h1.5M4 4l1 1M12 4l-1 1" /><path d="M17 20H9a3.5 3.5 0 0 1-.4-6.98A4.5 4.5 0 0 1 17.5 13 3.5 3.5 0 0 1 17 20Z" /></svg>
    );
  // Overcast / fog
  if (code === 3 || code === 45 || code === 48)
    return (
      <svg {...common}><path d="M17 18H8a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A3.5 3.5 0 0 1 17 18Z" /><path d="M6 21h12" /></svg>
    );
  // Snow
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return (
      <svg {...common}><path d="M17 15H8a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A3.5 3.5 0 0 1 17 15Z" /><path d="M9 19v.01M12 21v.01M15 19v.01" /></svg>
    );
  // Thunderstorm
  if (code >= 95)
    return (
      <svg {...common}><path d="M17 14H8a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A3.5 3.5 0 0 1 17 14Z" /><path d="M13 13l-2.5 4H13l-1.5 3.5" /></svg>
    );
  // Default: rain (drizzle 51-67, showers 80-82, anything else)
  return (
    <svg {...common}><path d="M17 14H8a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1A3.5 3.5 0 0 1 17 14Z" /><path d="M9 18l-1 2M13 18l-1 2M16 18l-1 2" /></svg>
  );
}

function WeatherDisplay() {
  const [temp, setTemp] = useState<number | null>(null);
  const [code, setCode] = useState<number | null>(null);

  useEffect(() => {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${BNE_LAT}&longitude=${BNE_LNG}` +
      `&current=temperature_2m,weather_code&timezone=Australia%2FBrisbane`;

    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        const t = d?.current?.temperature_2m;
        const c = d?.current?.weather_code;
        if (typeof t === "number") setTemp(Math.round(t));
        if (typeof c === "number") setCode(c);
      })
      .catch(() => {/* silently fail */});
  }, []);

  return (
    <span className="flex items-center gap-1.5 text-ink-soft">
      <span className="hidden sm:inline">Brisbane, AU</span>
      {code !== null && <WeatherIcon code={code} />}
      {temp !== null && <span className="tabular-nums text-ink">{temp}°</span>}
    </span>
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
        <WeatherDisplay />

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
