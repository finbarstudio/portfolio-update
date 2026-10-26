"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BASE_PATH } from "@/lib/dad-shop/types";
import { ListStore } from "./listStore";

type TabId = "list" | "find" | "week" | "settings";

const TABS: { id: TabId; label: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "list",
    label: "List",
    href: BASE_PATH,
    icon: <path d="M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2" />,
  },
  {
    id: "find",
    label: "Find",
    href: `${BASE_PATH}/find`,
    icon: (
      <>
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l5 5" />
      </>
    ),
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

/** Works whether the browser shows /dadshop/find or the internal /lab/... path. */
function activeTab(pathname: string): TabId {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.includes("find") || parts.includes("p")) return "find";
  if (parts.includes("week")) return "week";
  if (parts.includes("settings")) return "settings";
  return "list";
}

export default function TabBar() {
  const pathname = usePathname();
  const active = activeTab(pathname);

  // Off the List page nobody is draining the saved-changes queue, so a change
  // that failed on his phone would sit there. This keeper sends it, if any.
  useEffect(() => {
    if (active === "list") return;
    return new ListStore([]).start(false, true);
  }, [active]);

  return (
    <nav className="ds-tabs" aria-label="Sections">
      {TABS.map((t) => (
        <Link
          key={t.id}
          href={t.href}
          className={`ds-tab${t.id === active ? " is-active" : ""}`}
          aria-current={t.id === active ? "page" : undefined}
        >
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {t.icon}
          </svg>
          <span>{t.label}</span>
        </Link>
      ))}
    </nav>
  );
}
