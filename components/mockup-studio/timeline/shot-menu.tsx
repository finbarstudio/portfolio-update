"use client";

import type { KeyboardEvent } from "react";
import { useEffect, useRef } from "react";

export interface ShotMenuAnchor {
  x: number;
  /** Viewport y of the top and bottom of whatever opened the menu. */
  top: number;
  bottom: number;
}

interface ShotMenuProps {
  anchor: ShotMenuAnchor;
  canDelete: boolean;
  onRename(): void;
  onDuplicate(): void;
  onDelete(): void;
  onClose(): void;
}

const MENU_WIDTH = 144;
const MENU_HEIGHT = 104;

/**
 * A small menu in viewport coordinates, so the panel's overflow never clips it.
 * Opens above the anchor when there is no room below (the timeline sits at the bottom).
 */
export function ShotMenu({
  anchor,
  canDelete,
  onRename,
  onDuplicate,
  onDelete,
  onClose,
}: ShotMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  // The parent passes a fresh onClose each render; the listeners below must not be re-attached (and focus reset) for that.
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const close = () => closeRef.current();
    menuRef.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();
    const onPointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        menuRef.current?.contains(event.target)
      )
        return;
      close();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", close);
    window.addEventListener("blur", close);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", close);
      window.removeEventListener("blur", close);
    };
  }, []);

  const flipUp = anchor.bottom + MENU_HEIGHT + 8 > window.innerHeight;
  const left = Math.max(
    4,
    Math.min(anchor.x, window.innerWidth - MENU_WIDTH - 4),
  );

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>(
        "button:not(:disabled)",
      ) ?? [],
    );
    const at = items.findIndex((item) => item === document.activeElement);
    const next =
      (at + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
    items[next]?.focus();
  };

  const choose = (action: () => void) => () => {
    onClose();
    action();
  };

  const item =
    "flex h-7 w-full items-center rounded-ms-control px-2 text-left text-ms-ink hover:bg-ms-hover focus-visible:bg-ms-hover disabled:pointer-events-none disabled:text-ms-ink-faint";

  return (
    <div
      aria-label="Shot options"
      className="fixed z-30 rounded-ms-panel border border-ms-line bg-ms-raised p-1 shadow-lg"
      onKeyDown={onMenuKeyDown}
      ref={menuRef}
      role="menu"
      style={{
        left,
        width: MENU_WIDTH,
        ...(flipUp
          ? { bottom: window.innerHeight - anchor.top + 4 }
          : { top: anchor.bottom + 4 }),
      }}
    >
      <button
        className={item}
        onClick={choose(onRename)}
        role="menuitem"
        type="button"
      >
        Rename
      </button>
      <button
        className={item}
        onClick={choose(onDuplicate)}
        role="menuitem"
        type="button"
      >
        Duplicate
      </button>
      <button
        className={item}
        disabled={!canDelete}
        onClick={choose(onDelete)}
        role="menuitem"
        type="button"
      >
        Delete
      </button>
    </div>
  );
}
