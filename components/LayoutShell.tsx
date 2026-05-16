"use client";

// OS shell: fixed MenuBar (top) + StatusBar (bottom), Sidebar between them,
// main content offset by sidebar width and chrome heights.

import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MenuBar from "./MenuBar";
import StatusBar from "./StatusBar";

export const SIDEBAR_EXPANDED_W = 224; // px
export const SIDEBAR_COLLAPSED_W = 48; // px

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

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
    <>
      <MenuBar />
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <main
        className="min-w-0"
        style={{
          marginLeft: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_EXPANDED_W,
          paddingTop: "var(--menubar-h)",
          paddingBottom: "var(--statusbar-h)",
          minHeight: "100vh",
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
        }}
        id="main-content"
      >
        {children}
      </main>
      <StatusBar />
    </>
  );
}
