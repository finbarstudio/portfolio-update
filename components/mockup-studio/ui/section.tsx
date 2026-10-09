"use client";

import { type ReactNode, useId } from "react";
import { cn } from "./cn";
import { ChevronIcon } from "./icons";
import { useStoredOpen } from "./use-stored-open";

export interface SectionProps {
  title: string;
  defaultOpen?: boolean;
  /** Controls shown at the right of the header (e.g. a reset button). */
  actions?: ReactNode;
  children: ReactNode;
}

/** Collapsible panel section. Whether it is open is remembered between visits, by title. */
export function Section({
  title,
  defaultOpen = true,
  actions,
  children,
}: SectionProps) {
  const [open, setOpen] = useStoredOpen(`section:${title}`, defaultOpen);
  const bodyId = useId();

  return (
    <section className="border-b border-ms-line last:border-b-0">
      <div className="flex items-center pr-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen(!open)}
          className="group flex h-11 min-w-0 flex-1 items-center gap-2 px-4 text-left"
        >
          <ChevronIcon
            width={12}
            height={12}
            className={cn(
              "shrink-0 text-ms-ink-faint transition-transform",
              open && "rotate-90",
            )}
          />
          <span className="truncate font-semibold text-[10px] text-ms-ink-muted uppercase tracking-[0.14em] group-hover:text-ms-ink">
            {title}
          </span>
        </button>
        {actions}
      </div>
      {open ? (
        <div id={bodyId} className="flex flex-col gap-1.5 px-4 pb-5">
          {children}
        </div>
      ) : null}
    </section>
  );
}
