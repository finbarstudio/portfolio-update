"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useGroupHover — drives a hover boolean from the nearest `.group` ancestor
 * (i.e. the whole card), so a mockup animates on the single card-hover state
 * instead of its own separate thumbnail hover. Pointer + keyboard focus are
 * OR'd together. Falls back to the element itself when there's no `.group`
 * ancestor (e.g. a standalone case-study hero). No-ops when `enabled` is false.
 *
 * Returns a ref to attach to the component's root element and the live state.
 */
export function useGroupHover<T extends HTMLElement>(enabled = true) {
  const ref = useRef<T>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const target = (el.closest(".group") as HTMLElement | null) ?? el;

    let pointer = false;
    let focus = false;
    const sync = () => setHovered(pointer || focus);

    const onEnter = () => { pointer = true; sync(); };
    const onLeave = () => { pointer = false; sync(); };
    const onFocusIn = () => { focus = true; sync(); };
    const onFocusOut = () => { focus = false; sync(); };

    target.addEventListener("pointerenter", onEnter);
    target.addEventListener("pointerleave", onLeave);
    target.addEventListener("focusin", onFocusIn);
    target.addEventListener("focusout", onFocusOut);
    return () => {
      target.removeEventListener("pointerenter", onEnter);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener("focusin", onFocusIn);
      target.removeEventListener("focusout", onFocusOut);
    };
  }, [enabled]);

  return { ref, hovered };
}
