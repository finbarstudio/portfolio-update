"use client";

import type { ReactNode } from "react";
import { locateShot } from "@/lib/mockup-studio/scene/animation";
import { typedLimits } from "@/lib/mockup-studio/scene/limits";
import { type AnimPath, paramMeta } from "@/lib/mockup-studio/scene/params";
import { useResolvedValue, useStudio } from "@/lib/mockup-studio/scene/store";
import { cn } from "./cn";
import { DiamondIcon } from "./icons";
import { Slider } from "./slider";

/** Same tolerance the store uses when deciding a keyframe is "here". */
const KEY_SNAP_MS = 20;

type KeyState = "key" | "track" | "none";

function toggleKeyframe(path: AnimPath) {
  const { shots, playhead, addKeyframes, removeKeyframe } =
    useStudio.getState();
  const { shot, localMs } = locateShot(shots, playhead);
  const here = shot.tracks[path]?.find(
    (keyframe) => Math.abs(keyframe.t - localMs) <= KEY_SNAP_MS,
  );
  if (here) removeKeyframe(shot.id, path, here.id);
  else addKeyframes([path]);
}

function KeyframeButton({ path, label }: { path: AnimPath; label: string }) {
  // Resolves to a string so this only re-renders when the state changes.
  const state = useStudio((s): KeyState => {
    const { shot, localMs } = locateShot(s.shots, s.playhead);
    const keyframes = shot.tracks[path];
    if (!keyframes?.length) return "none";
    return keyframes.some(
      (keyframe) => Math.abs(keyframe.t - localMs) <= KEY_SNAP_MS,
    )
      ? "key"
      : "track";
  });

  const action =
    state === "key" ? `Remove ${label} keyframe` : `Add ${label} keyframe`;

  return (
    <button
      type="button"
      aria-label={action}
      title={action}
      onClick={() => toggleKeyframe(path)}
      className={cn(
        "inline-flex size-7 shrink-0 items-center justify-center rounded-ms-control hover:bg-ms-raised",
        state === "none" ? "text-ms-ink-faint hover:text-ms-ink-muted" : "text-ms-key",
      )}
    >
      <DiamondIcon filled={state === "key"} width={12} height={12} />
    </button>
  );
}

/**
 * One animatable parameter. Its own component so only this row re-renders
 * while the playhead moves.
 */
export function ParamSlider({
  path,
  extra,
}: {
  path: AnimPath;
  /** Extra controls placed before the keyframe button. */
  extra?: ReactNode;
}) {
  const meta = paramMeta(path);
  const [typedMin, typedMax] = typedLimits(path);
  const value = useResolvedValue(path);
  const setValue = useStudio((s) => s.setValue);

  return (
    <Slider
      label={meta.label}
      value={value}
      onChange={(next) => setValue(path, next)}
      min={meta.min}
      max={meta.max}
      typedMin={typedMin}
      typedMax={typedMax}
      step={meta.step}
      unit={meta.unit}
      defaultValue={meta.default}
      trailing={
        <>
          {extra}
          <KeyframeButton path={path} label={meta.label} />
        </>
      }
    />
  );
}
