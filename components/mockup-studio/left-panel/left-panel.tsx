"use client";

import { VERSION } from "@/lib/mockup-studio/version";
import { AppHeader } from "./app-header";
import { MockupSection } from "./mockup-section";
import { PresetsSection } from "./presets-section";
import { ScreenMediaSection } from "./screen-media-section";

export function LeftPanel() {
  return (
    <div className="flex h-full flex-col overflow-y-auto overscroll-contain">
      <AppHeader />
      <MockupSection />
      <ScreenMediaSection />
      <PresetsSection />
      <footer className="mt-auto flex flex-col gap-2 border-ms-line border-t p-4">
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
