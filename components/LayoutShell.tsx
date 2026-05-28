"use client";

// OS shell: fixed MenuBar (top) + StatusBar (bottom).
// Desktop: persistent Sidebar between bars; mobile: full-screen MobileMenu
// opened from the MenuBar hamburger (state held here so MenuBar can trigger).

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import MenuBar from "./MenuBar";

export const SIDEBAR_EXPANDED_W = 224; // px
export const SIDEBAR_COLLAPSED_W = 48; // px

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") setCollapsed(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  const sidebarW = collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W;

  return (
    <>
      <MenuBar onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      <Sidebar
        collapsed={collapsed}
        onToggle={toggle}
        mobileMenuOpen={mobileMenuOpen}
        onMobileMenuClose={() => setMobileMenuOpen(false)}
      />
      <main
        className="min-w-0 ml-0 md:ml-[var(--sidebar-w)]"
        style={
          {
            "--sidebar-w": `${sidebarW}px`,
            paddingTop: "var(--menubar-h)",
            minHeight: "100vh",
            transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
          } as React.CSSProperties
        }
        id="main-content"
      >
        {children}
      </main>
    </>
  );
}
