"use client";

// Bottom-of-screen status bar, shows READY indicator, current path,
// project count, and a live tick of memory/uptime numbers for flavour.

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { projects } from "@/content/projects";

const TOTAL_PROJECTS = projects.length;

export default function StatusBar() {
  const pathname = usePathname();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Stable-looking but slowly-evolving memory/uptime values for retro flavour
  const mem = 64 + (tick % 8); // 64–72 K
  const uptime = `${String(Math.floor(tick / 60)).padStart(2, "0")}:${String(
    tick % 60
  ).padStart(2, "0")}`;

  const path = pathname === "/" ? "~/" : `~${pathname}`;

  return (
    <footer
      className="hidden md:flex fixed bottom-0 left-0 right-0 z-50 border-t border-ink bg-bg items-center justify-between px-3 text-ink-soft"
      style={{
        height: "var(--statusbar-h)",
        fontSize: "10px",
        letterSpacing: "0.06em",
        lineHeight: 1,
      }}
      role="contentinfo"
    >
      {/* Left cluster, READY indicator + path */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-teal font-bold uppercase">
          <span className="status-dot" />
          READY
        </span>
        <span className="text-ink hidden xs:inline">·</span>
        <span className="text-ink tracking-[0.04em]">{path}</span>
      </div>

      {/* Right cluster, stats */}
      <div className="flex items-center gap-3 uppercase">
        <span className="hidden sm:inline">{TOTAL_PROJECTS} PROJECTS</span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden md:inline tabular-nums">MEM {mem}K</span>
        <span className="hidden md:inline">·</span>
        <span className="tabular-nums">UP {uptime}</span>
      </div>
    </footer>
  );
}
