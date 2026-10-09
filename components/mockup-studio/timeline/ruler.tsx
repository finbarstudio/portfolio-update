"use client";

import type { PointerEvent, RefObject } from "react";
import { useRef } from "react";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import {
  formatTick,
  percent,
  pointerToMs,
  snapToFrame,
  tickStep,
} from "./geometry";
import { Row } from "./row";

/** Scrub the playhead from pointer events on any element, measuring against `laneRef`. */
export function useScrub(laneRef: RefObject<HTMLElement | null>, span: number) {
  const active = useRef(false);

  const seek = (clientX: number) => {
    const lane = laneRef.current;
    if (!lane) return;
    useStudio
      .getState()
      .setPlayhead(snapToFrame(pointerToMs(clientX, lane, span)));
  };

  return {
    onPointerDown(event: PointerEvent<HTMLElement>) {
      if (event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      active.current = true;
      useStudio.getState().setPlaying(false);
      seek(event.clientX);
    },
    onPointerMove(event: PointerEvent<HTMLElement>) {
      if (active.current) seek(event.clientX);
    },
    onPointerUp() {
      active.current = false;
    },
    onPointerCancel() {
      active.current = false;
    },
  };
}

interface RulerProps {
  laneRef: RefObject<HTMLDivElement | null>;
  span: number;
  total: number;
  laneWidth: number;
}

const MINOR_PER_MAJOR = 5;

export function Ruler({ laneRef, span, total, laneWidth }: RulerProps) {
  const scrub = useScrub(laneRef, span);
  const step = tickStep(span, laneWidth);
  const minor = step / MINOR_PER_MAJOR;
  const ticks: { ms: number; major: boolean }[] = [];
  for (let i = 0; i * minor <= span; i++)
    ticks.push({ ms: Math.round(i * minor), major: i % MINOR_PER_MAJOR === 0 });
  // Labels sit right of their tick; drop any that would run past the lane.
  const labelRoom = 36;

  return (
    <Row
      className="h-6 border-b border-ms-line"
      laneProps={{
        ...scrub,
        className: "cursor-pointer touch-none select-none",
      }}
      laneRef={laneRef}
    >
      {ticks.map(({ ms, major }) => (
        <div
          className={`absolute bottom-0 w-px ${major ? "h-2.5 bg-ms-ink-faint" : "h-1.5 bg-ms-line"}`}
          key={ms}
          style={{ left: percent(ms, span) }}
        >
          {major &&
          (laneWidth === 0 ||
            (ms / span) * laneWidth < laneWidth - labelRoom) ? (
            <span className="absolute bottom-2 left-1 text-[10px] text-ms-ink-faint tabular-nums">
              {formatTick(ms)}
            </span>
          ) : null}
        </div>
      ))}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 bg-ms-canvas/50"
        style={{ left: percent(total, span) }}
      />
    </Row>
  );
}
