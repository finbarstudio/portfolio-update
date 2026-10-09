"use client";

import { type ReactNode, useState } from "react";
import { Inspector } from "@/components/mockup-studio/inspector/inspector";
import { LeftPanel } from "@/components/mockup-studio/left-panel/left-panel";
import { Timeline } from "@/components/mockup-studio/timeline/timeline";
import { cn } from "@/components/mockup-studio/ui/cn";
import { ChevronIcon } from "@/components/mockup-studio/ui/icons";
import { Tooltips } from "@/components/mockup-studio/ui/tooltips";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { useDesktop } from "./use-desktop";
import { useShortcuts } from "./use-shortcuts";
import { ViewportArea } from "./viewport-area";

interface SidePanelProps {
  label: string;
  /** Which edge of the window the panel sits on; the collapse arrow points that way. */
  side: "left" | "right";
  children: ReactNode;
}

/**
 * A side panel that folds down to a tall strip to give the viewport more room. Its contents stay mounted while
 * folded, so open sections and scroll positions are kept.
 */
function SidePanel({ label, side, children }: SidePanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  // The chevron points right as drawn.
  const towardsEdge = side === "left" ? "rotate-180" : "";
  const awayFromEdge = side === "left" ? "" : "rotate-180";

  return (
    <aside
      aria-label={label}
      className={cn(
        "flex shrink-0 flex-col overflow-hidden border-ms-line bg-ms-panel",
        side === "left" ? "border-r" : "border-l",
        collapsed ? "w-8" : "w-75",
      )}
    >
      {collapsed ? (
        <button
          type="button"
          aria-expanded={false}
          title={`Show ${label}`}
          onClick={() => setCollapsed(false)}
          className="flex h-full w-full flex-col items-center gap-3 py-2 text-ms-ink-muted hover:bg-ms-raised hover:text-ms-ink"
        >
          <ChevronIcon width={14} height={14} className={awayFromEdge} />
          <span className="[writing-mode:vertical-rl]">{label}</span>
        </button>
      ) : (
        <button
          type="button"
          aria-expanded
          title={`Collapse ${label}`}
          onClick={() => setCollapsed(true)}
          className={cn(
            "flex h-6 shrink-0 items-center gap-1.5 border-ms-line border-b px-3 text-[11px] text-ms-ink-faint hover:text-ms-ink",
            side === "right" && "flex-row-reverse",
          )}
        >
          <ChevronIcon width={12} height={12} className={towardsEdge} />
          <span>{label}</span>
        </button>
      )}
      <div className={cn("min-h-0 flex-1", collapsed && "hidden")}>
        {children}
      </div>
    </aside>
  );
}

function Editor() {
  const proMode = useStudio((s) => s.proMode);
  useShortcuts();

  return (
    <main className="flex h-dvh flex-col bg-ms-canvas">
      <Tooltips />
      <div className="flex min-h-0 flex-1">
        <SidePanel label="Mockup and media" side="left">
          <LeftPanel />
        </SidePanel>
        <ViewportArea />
        <SidePanel label="Inspector" side="right">
          <Inspector />
        </SidePanel>
      </div>
      <section
        aria-label="Timeline"
        className={cn(
          "shrink-0 overflow-hidden border-ms-line border-t bg-ms-panel",
          proMode ? "h-80" : "h-[150px]",
        )}
      >
        <Timeline />
      </section>
    </main>
  );
}

export function Studio() {
  const desktop = useDesktop();

  if (!desktop) {
    return (
      <main className="grid h-dvh place-items-center bg-ms-canvas p-8 text-center">
        <h1 className="max-w-xs text-balance text-sm text-ms-ink-muted">
          Open this on a larger screen
        </h1>
      </main>
    );
  }

  return <Editor />;
}
