"use client";

// Holds the sidebar collapse state so both Sidebar and <main> can react to it.
// Persists preference to localStorage.

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";

export const SIDEBAR_EXPANDED_W = 224; // px  (w-56)
export const SIDEBAR_COLLAPSED_W = 48; // px  (w-12)

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Hydrate from localStorage (runs only on client, so no SSR mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <main
        className="flex-1 min-w-0 pt-14 md:pt-0"
        style={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        id="main-content"
      >
        {children}
      </main>
    </div>
  );
}
