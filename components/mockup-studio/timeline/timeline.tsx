"use client";

import { useRef } from "react";
import { TrackArea } from "./track-area";
import { Transport } from "./transport";
import { usePlaybackClock } from "./use-playback-clock";
import { useTimelineShortcuts } from "./use-shortcuts";

export function Timeline() {
  const rootRef = useRef<HTMLElement>(null);
  usePlaybackClock();
  useTimelineShortcuts(rootRef);

  return (
    <section
      aria-label="Timeline"
      className="flex size-full min-h-0 flex-col overflow-hidden bg-ms-panel"
      ref={rootRef}
    >
      <Transport />
      <TrackArea />
    </section>
  );
}
