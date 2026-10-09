"use client";

import type { KeyboardEvent, PointerEvent, RefObject } from "react";
import { useRef } from "react";
import { EASE_OPTIONS, locateShot } from "@/lib/mockup-studio/scene/animation";
import { ANIM_PATHS, type AnimPath, paramMeta } from "@/lib/mockup-studio/scene/params";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Ease, Shot } from "@/lib/mockup-studio/scene/types";
import {
  FRAME_MS,
  formatSeconds,
  formatValue,
  percent,
  pointerToMs,
  snapToFrame,
} from "./geometry";
import { CloseIcon } from "./icons";
import { Row } from "./row";
import { type KeyframeRef, useSelection } from "./selection";

const EASE_LABELS: Record<Ease, string> = {
  linear: "Linear",
  easeIn: "Ease in",
  easeOut: "Ease out",
  easeInOut: "Ease in-out",
  easeOutExpo: "Ease out (expo)",
  easeInOutQuint: "Ease in-out (strong)",
  easeOutBack: "Overshoot",
  spring: "Spring",
  hold: "Hold",
};

function seekTo(ms: number) {
  const { setPlaying, setPlayhead } = useStudio.getState();
  setPlaying(false);
  setPlayhead(ms);
}

function DiamondShape({ selected }: { selected: boolean }) {
  return (
    <span
      className={`block size-2 rotate-45 ${selected ? "bg-ms-ink" : "bg-ms-key"}`}
    />
  );
}

const diamondButton =
  "absolute top-1/2 grid size-4 -translate-x-1/2 -translate-y-1/2 place-items-center touch-none rounded-ms-control";

/** One diamond per distinct keyframe time across every track, per shot. */
export function SummaryRow({ span }: { span: number }) {
  const shots = useStudio((s) => s.shots);
  const diamonds: { key: string; ms: number }[] = [];
  let start = 0;
  for (const shot of shots) {
    const times = new Set<number>();
    for (const keyframes of Object.values(shot.tracks))
      for (const keyframe of keyframes ?? []) times.add(keyframe.t);
    for (const t of times)
      diamonds.push({ key: `${shot.id}:${t}`, ms: start + t });
    start += shot.duration;
  }

  return (
    <Row className="h-6" label="Keyframes">
      {diamonds.map(({ key, ms }) => (
        <button
          aria-label={`Keyframe at ${formatSeconds(ms)}`}
          className={`${diamondButton} cursor-pointer`}
          key={key}
          onClick={() => seekTo(ms)}
          style={{ left: percent(ms, span) }}
          title={`Keyframe at ${formatSeconds(ms)}`}
          type="button"
        >
          <DiamondShape selected={false} />
        </button>
      ))}
    </Row>
  );
}

interface DiamondProps {
  shot: Shot;
  /** Global start of the shot. */
  start: number;
  path: AnimPath;
  keyframeId: string;
  t: number;
  span: number;
  selected: boolean;
  laneRef: RefObject<HTMLDivElement | null>;
}

const DRAG_THRESHOLD_PX = 3;

function KeyframeDiamond({
  shot,
  start,
  path,
  keyframeId,
  t,
  span,
  selected,
  laneRef,
}: DiamondProps) {
  const dragRef = useRef<{ startX: number; moved: boolean } | null>(null);
  const ref: KeyframeRef = { shotId: shot.id, path, id: keyframeId };

  const retime = (localMs: number) => {
    const clamped = Math.min(Math.max(localMs, 0), shot.duration);
    useStudio.getState().moveKeyframe(shot.id, path, keyframeId, clamped);
    useStudio.getState().setPlayhead(start + clamped);
  };

  const onPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, moved: false };
    useSelection.getState().select(ref);
  };

  const onPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current;
    const lane = laneRef.current;
    if (!drag || !lane) return;
    if (
      !drag.moved &&
      Math.abs(event.clientX - drag.startX) < DRAG_THRESHOLD_PX
    )
      return;
    drag.moved = true;
    retime(snapToFrame(pointerToMs(event.clientX, lane, span) - start));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const direction = event.key === "ArrowLeft" ? -1 : 1;
    retime(snapToFrame(t + direction * (event.shiftKey ? 10 : 1) * FRAME_MS));
  };

  return (
    <button
      aria-label={`${paramMeta(path).label} keyframe at ${formatSeconds(t)}`}
      aria-pressed={selected}
      className={`${diamondButton} cursor-ew-resize`}
      onClick={() => {
        useSelection.getState().select(ref);
        // Read the keyframe fresh: a drag may have moved it since this render.
        const current = useStudio
          .getState()
          .shots.find((s) => s.id === shot.id)
          ?.tracks[path]?.find((k) => k.id === keyframeId);
        seekTo(start + (current?.t ?? t));
      }}
      onKeyDown={onKeyDown}
      onPointerCancel={() => {
        dragRef.current = null;
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={() => {
        dragRef.current = null;
      }}
      style={{ left: percent(start + t, span) }}
      title={`${paramMeta(path).label} at ${formatSeconds(t)}. Drag to retime, arrows to nudge.`}
      type="button"
    >
      <DiamondShape selected={selected} />
    </button>
  );
}

interface PathRowProps {
  shot: Shot;
  start: number;
  path: AnimPath;
  span: number;
}

function PathRow({ shot, start, path, span }: PathRowProps) {
  const laneRef = useRef<HTMLDivElement>(null);
  const selected = useSelection((s) => s.selected);
  const meta = paramMeta(path);
  const label = `${meta.group} · ${meta.label}`;

  return (
    <Row
      className="h-6 shrink-0"
      label={
        <>
          <span className="min-w-0 flex-1 truncate" title={label}>
            <span className="capitalize">{meta.group}</span> ·{" "}
            <span className="text-ms-ink-muted">{meta.label}</span>
          </span>
          <button
            aria-label={`Clear ${label} track`}
            className="grid size-5 shrink-0 place-items-center rounded-ms-control hover:bg-ms-hover hover:text-ms-ink"
            onClick={() => useStudio.getState().clearTrack(shot.id, path)}
            title="Clear track"
            type="button"
          >
            <CloseIcon />
          </button>
        </>
      }
      laneRef={laneRef}
    >
      <div
        className="pointer-events-none absolute inset-y-0 bg-ms-ink/5"
        style={{
          left: percent(start, span),
          width: percent(shot.duration, span),
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-ms-line" />
      {shot.tracks[path]?.map((keyframe) => (
        <KeyframeDiamond
          keyframeId={keyframe.id}
          laneRef={laneRef}
          path={path}
          selected={selected?.id === keyframe.id && selected.path === path}
          shot={shot}
          span={span}
          start={start}
          t={keyframe.t}
          key={keyframe.id}
        />
      ))}
    </Row>
  );
}

function KeyframeEditor() {
  const selected = useSelection((s) => s.selected);
  const keyframe = useStudio((s) =>
    selected
      ? s.shots
          .find((shot) => shot.id === selected.shotId)
          ?.tracks[selected.path]?.find((k) => k.id === selected.id)
      : undefined,
  );

  if (!selected || !keyframe) {
    return (
      <p className="px-3 text-ms-ink-faint">
        Select a keyframe to edit its easing. Delete removes it.
      </p>
    );
  }

  const meta = paramMeta(selected.path);
  return (
    <div className="flex min-w-0 items-center gap-3 px-3">
      <span className="min-w-0 truncate text-ms-ink-muted">
        <span className="capitalize">{meta.group}</span> · {meta.label}
      </span>
      <span className="text-ms-ink tabular-nums">{formatSeconds(keyframe.t)}</span>
      <span className="text-ms-ink tabular-nums">
        {formatValue(keyframe.value, meta.unit)}
      </span>
      <label className="ml-auto flex items-center gap-1.5 text-ms-ink-muted">
        Ease
        <select
          className="h-6 rounded-ms-control border border-ms-line bg-ms-raised px-1.5 text-ms-ink"
          onChange={(event) => {
            const ease = EASE_OPTIONS.find(
              (option) => option === event.target.value,
            );
            if (ease)
              useStudio
                .getState()
                .setKeyframeEase(
                  selected.shotId,
                  selected.path,
                  selected.id,
                  ease,
                );
          }}
          value={keyframe.ease}
        >
          {EASE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {EASE_LABELS[option]}
            </option>
          ))}
        </select>
      </label>
      <button
        className="h-6 rounded-ms-control border border-ms-line px-2 text-ms-ink-muted hover:bg-ms-hover hover:text-ms-ink"
        onClick={() => {
          useStudio
            .getState()
            .removeKeyframe(selected.shotId, selected.path, selected.id);
          useSelection.getState().select(null);
        }}
        type="button"
      >
        Delete
      </button>
    </div>
  );
}

/** Pro Mode: one row per animated param of the shot under the playhead, plus the selected keyframe's controls. */
export function ProSection({ span }: { span: number }) {
  const shots = useStudio((s) => s.shots);
  const activeId = useStudio((s) => locateShot(s.shots, s.playhead).shot.id);
  const shot = shots.find((candidate) => candidate.id === activeId);
  if (!shot) return null;

  let start = 0;
  for (const candidate of shots) {
    if (candidate.id === shot.id) break;
    start += candidate.duration;
  }
  const animated = ANIM_PATHS.filter((path) => shot.tracks[path]?.length);

  return (
    <div className="flex min-h-0 flex-1 flex-col border-t border-ms-line">
      {/* Scrollbar hidden so the lanes keep exactly the same width as the rows above. */}
      <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {animated.length === 0 ? (
          <p className="px-3 py-3 text-ms-ink-faint">
            Turn on Rec and move something, or apply a preset.
          </p>
        ) : (
          animated.map((path) => (
            <PathRow
              key={path}
              path={path}
              shot={shot}
              span={span}
              start={start}
            />
          ))
        )}
      </div>
      <div className="flex h-8 shrink-0 items-center border-t border-ms-line">
        <KeyframeEditor />
      </div>
    </div>
  );
}
