"use client";

import type { KeyboardEvent, RefObject } from "react";
import { useEffect, useRef } from "react";
import { totalDuration } from "@/lib/mockup-studio/scene/animation";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import {
  FRAME_MS,
  formatSeconds,
  GUTTER_OFFSET,
  LANE_PADDING,
  snapToFrame,
} from "./geometry";
import { useScrub } from "./ruler";

interface PlayheadProps {
  /** The ruler lane, so dragging the handle scrubs against the same width. */
  laneRef: RefObject<HTMLDivElement | null>;
  span: number;
  total: number;
}

/**
 * The playhead line over all rows. It subscribes to the store itself and moves
 * with a CSS transform, so playback at 60fps never re-renders the timeline.
 */
export function Playhead({ laneRef, span, total }: PlayheadProps) {
  const moverRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const scrub = useScrub(laneRef, span);

  useEffect(() => {
    const apply = (ms: number) => {
      // Percent of the mover's own width, which is the full lane.
      if (moverRef.current)
        moverRef.current.style.transform = `translateX(${(ms / span) * 100}%)`;
      const slider = sliderRef.current;
      if (slider) {
        slider.setAttribute("aria-valuenow", String(Math.round(ms)));
        slider.setAttribute("aria-valuetext", formatSeconds(ms));
      }
    };
    apply(useStudio.getState().playhead);
    return useStudio.subscribe((state, prev) => {
      if (state.playhead !== prev.playhead) apply(state.playhead);
    });
  }, [span]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { playhead, shots, setPlayhead, setPlaying } = useStudio.getState();
    const step = (event.shiftKey ? 10 : 1) * FRAME_MS;
    let next: number;
    if (event.key === "ArrowLeft") next = snapToFrame(playhead - step);
    else if (event.key === "ArrowRight") next = snapToFrame(playhead + step);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = totalDuration(shots);
    else return;
    event.preventDefault();
    setPlaying(false);
    setPlayhead(next);
  };

  return (
    <div
      className={`pointer-events-none absolute inset-y-0 right-0 z-10 ${GUTTER_OFFSET} ${LANE_PADDING}`}
    >
      <div className="relative size-full">
        <div className="absolute inset-y-0 left-0 w-full" ref={moverRef}>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-px -translate-x-1/2 bg-ms-ink/80" />
          <div
            aria-label="Playhead"
            aria-orientation="horizontal"
            aria-valuemax={total}
            aria-valuemin={0}
            // Kept current imperatively by the store subscription above.
            aria-valuenow={0}
            className="pointer-events-auto absolute top-0 left-0 h-3.5 w-3 -translate-x-1/2 cursor-ew-resize touch-none rounded-b-[4px] bg-ms-ink"
            onKeyDown={onKeyDown}
            ref={sliderRef}
            role="slider"
            tabIndex={0}
            {...scrub}
          />
        </div>
      </div>
    </div>
  );
}
