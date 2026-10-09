"use client";

import { type ReactNode, useId } from "react";
import { cn } from "./cn";
import { ChevronIcon } from "./icons";
import { useStoredOpen } from "./use-stored-open";

export interface FoldProps {
  /** Shown in the header. */
  title: string;
  /** Where the open state is remembered. Unique across the app. */
  storageKey: string;
  defaultOpen?: boolean;
  /** A count or note at the right of the header. */
  note?: ReactNode;
  children: ReactNode;
}

/** A folding group inside a section: a hairline, a chevron, a title and a count. */
export function Fold({
  title,
  storageKey,
  defaultOpen = false,
  note,
  children,
}: FoldProps) {
  const [open, setOpen] = useStoredOpen(storageKey, defaultOpen);
  const bodyId = useId();

  return (
    <div className="border-ms-line border-t first:border-t-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={bodyId}
        onClick={() => setOpen(!open)}
        className="group flex h-8 w-full items-center gap-1.5 rounded-ms-control text-left text-ms-ink-muted hover:text-ms-ink"
      >
        <ChevronIcon
          width={10}
          height={10}
          className={cn(
            "shrink-0 text-ms-ink-faint transition-transform",
            open && "rotate-90",
          )}
        />
        <span className="min-w-0 flex-1 truncate">{title}</span>
        {note !== undefined ? (
          <span className="text-[11px] text-ms-ink-faint tabular-nums">
            {note}
          </span>
        ) : null}
      </button>
      {open ? (
        <div id={bodyId} className="pb-2">
          {children}
        </div>
      ) : null}
    </div>
  );
}
