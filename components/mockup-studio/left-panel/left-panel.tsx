"use client";

import { PintLink } from "@/components/mockup-studio/ui/pint-link";
import { AppHeader } from "./app-header";
import { MockupSection } from "./mockup-section";
import { PresetsSection } from "./presets-section";
import { ScreenMediaSection } from "./screen-media-section";

/** Shown at the foot of the left panel. Bumped by hand as the studio changes. */
const VERSION = "v0.1";

export function LeftPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
      <AppHeader />
      <MockupSection />
      <ScreenMediaSection />
      <PresetsSection />
      <footer className="mt-auto flex flex-col gap-2 border-ms-line border-t p-4">
        <PintLink />
        <a
          href="https://lab.finbar.studio"
          target="_blank"
          rel="noopener"
          className="text-center text-[11px] text-ms-ink-muted hover:text-ms-ink hover:underline"
        >
          lab.finbar.studio
        </a>
        <p className="text-center text-[10px] text-ms-ink-faint tabular-nums">
          {VERSION}
        </p>
      </footer>
    </div>
  );
}
