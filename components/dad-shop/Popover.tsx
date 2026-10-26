"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";

interface Props {
  open: boolean;
  anchor: RefObject<HTMLElement | null>;
  /** `refocus` is true when Escape closed it, so focus should go back to the button. */
  onClose: (refocus: boolean) => void;
  width: number;
  id: string;
  label: string;
  role?: string;
  className?: string;
  /** Selector of the control to focus when it opens. */
  autoFocus?: string;
  children: ReactNode;
}

interface Pos {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
  maxHeight: number;
}

/**
 * A panel fixed under its button, so a row that scrolls sideways on a phone
 * can't clip it. Flips above the button near the bottom of the screen, closes
 * on Escape or a tap anywhere else.
 */
export default function Popover({ open, anchor, onClose, width, id, label, role = "dialog", className = "", autoFocus, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);

  useEffect(() => {
    if (!open) return;
    function place() {
      const a = anchor.current;
      if (!a) return;
      const r = a.getBoundingClientRect();
      const w = Math.min(width, window.innerWidth - 24);
      // The tab bar sits under the page: keep clear of it.
      const bottomGap = 8 + (document.querySelector(".ds-tabs")?.getBoundingClientRect().height ?? 0);
      const below = r.bottom + 6 + 240 < window.innerHeight - bottomGap || r.top < 280;
      const left = Math.max(12, Math.min(r.left + r.width - w, window.innerWidth - w - 12, r.left));
      setPos({
        top: below ? r.bottom + 6 : undefined,
        bottom: below ? undefined : window.innerHeight - r.top + 6,
        left,
        width: w,
        maxHeight: Math.max(220, below ? window.innerHeight - r.bottom - 6 - bottomGap : r.top - 20),
      });
    }
    function onDown(e: PointerEvent) {
      const t = e.target;
      if (!(t instanceof Node)) return;
      if (ref.current?.contains(t) || anchor.current?.contains(t)) return;
      onClose(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose(true);
      }
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, anchor, width, onClose]);

  useEffect(() => {
    if (open && autoFocus) ref.current?.querySelector<HTMLElement>(autoFocus)?.focus({ preventScroll: true });
  }, [open, autoFocus]);

  if (!open) return null;
  return (
    <div
      ref={ref}
      id={id}
      role={role}
      aria-label={label}
      className={`ds-pop ${className}`}
      style={pos ? { top: pos.top, bottom: pos.bottom, left: pos.left, width: pos.width, maxHeight: pos.maxHeight } : { visibility: "hidden" }}
    >
      {children}
    </div>
  );
}
