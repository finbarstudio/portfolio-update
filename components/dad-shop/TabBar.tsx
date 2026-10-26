"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { BASE_PATH, LIST_PATH } from "@/lib/dad-shop/types";
import { getListStore, hasPendingChanges } from "./listStore";
import { useChromeOnScroll } from "./useChromeOnScroll";

type TabId = "list" | "find" | "week" | "settings";

const TABS: { id: TabId; label: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "find",
    label: "Find",
    href: BASE_PATH,
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l5 5" />
      </>
    ),
  },
  {
    id: "list",
    label: "List",
    href: LIST_PATH,
    icon: <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />,
  },
  {
    id: "week",
    label: "This week",
    href: `${BASE_PATH}/week`,
    icon: (
      <>
        <rect x="4" y="5" width="16" height="15" rx="2" />
        <path d="M4 10h16M9 3v4M15 3v4" />
      </>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    href: `${BASE_PATH}/settings`,
    icon: (
      <>
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </>
    ),
  },
];

/** Works whether the browser shows /dadshop/list or the internal /lab/... path. Home (Find on For you) lights Find up. */
function activeTab(pathname: string): TabId {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.includes("list")) return "list";
  if (parts.includes("week")) return "week";
  if (parts.includes("settings")) return "settings";
  return "find";
}

export default function TabBar() {
  const pathname = usePathname();
  const active = activeTab(pathname);
  const nav = useRef<HTMLElement>(null);
  // Header and tab bar slide away on the way down and come back on the way up.
  useChromeOnScroll(nav, pathname);

  // Pages that show the list send its changes themselves. On the others (This week,
  // Settings) a change that failed on his phone would sit there, so this keeper sends it.
  useEffect(() => {
    if (!hasPendingChanges()) return;
    return getListStore([]).acquire(false, true);
  }, [active]);

  return (
    <nav ref={nav} className="ds-tabs" aria-label="Sections">
      {TABS.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={`ds-tab${t.id === active ? " is-active" : ""}`}
          aria-current={t.id === active ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {t.icon}
          </svg>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
