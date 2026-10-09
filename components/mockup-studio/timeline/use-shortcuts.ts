"use client";

import { type RefObject, useEffect } from "react";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { useSelection } from "./selection";

function isTextEntry(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/**
 * Space (play/pause), K (keyframe) and Delete (remove the selected keyframe).
 * Keys typed into fields, or aimed at a dialog or menu, are left alone.
 */
export function useTimelineShortcuts(
  rootRef: RefObject<HTMLElement | null>,
): void {
  useEffect(() => {
    const ignores = (event: KeyboardEvent): boolean => {
      if (
        event.defaultPrevented ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey
      )
        return true;
      if (isTextEntry(event.target)) return true;
      if (!(event.target instanceof Element)) return false;
      if (event.target.closest('[role="dialog"], dialog, [role="menu"]'))
        return true;
      // Space plays or pauses even with a button focused, so the last thing clicked never swallows it.
      return false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (ignores(event)) return;
      const { playing, setPlaying, addKeyframes, removeKeyframe } =
        useStudio.getState();

      if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) setPlaying(!playing);
      } else if (event.key === "k" || event.key === "K") {
        event.preventDefault();
        if (!event.repeat) addKeyframes();
      } else if (event.key === "Delete" || event.key === "Backspace") {
        const { selected, select } = useSelection.getState();
        if (!selected) return;
        event.preventDefault();
        removeKeyframe(selected.shotId, selected.path, selected.id);
        select(null);
      }
    };

    // Firefox clicks a focused button on Space keyup even if keydown was handled.
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space" && !ignores(event)) event.preventDefault();
    };

    // The selection only owns Delete while the user is working in the timeline.
    const onPointerDown = (event: PointerEvent) => {
      const root = rootRef.current;
      if (root && event.target instanceof Node && !root.contains(event.target))
        useSelection.getState().select(null);
    };

    // Capture phase, so a focused button does not get to treat Space as a click first.
    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("keyup", onKeyUp, true);
    window.addEventListener("pointerdown", onPointerDown, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("keyup", onKeyUp, true);
      window.removeEventListener("pointerdown", onPointerDown, true);
    };
  }, [rootRef]);
}
