import type { HTMLAttributes, ReactNode, Ref } from "react";
import { GUTTER, LANE_PADDING } from "./geometry";

interface RowProps {
  label?: ReactNode;
  /** Height and any extra classes for the row. */
  className?: string;
  /** The element whose box maps to the full time span; pointer maths measure this. */
  laneRef?: Ref<HTMLDivElement>;
  /** Handlers for the padded lane area (so clicks in the margins still count). */
  laneProps?: HTMLAttributes<HTMLDivElement>;
  children?: ReactNode;
}

/** A label column plus a padded lane. Every row uses this so lanes line up with the playhead overlay. */
export function Row({
  label,
  className = "",
  laneRef,
  laneProps,
  children,
}: RowProps) {
  return (
    <div className={`flex ${className}`}>
      <div
        className={`${GUTTER} flex items-center gap-1 overflow-hidden pr-1 pl-3 text-ms-ink-faint`}
      >
        {label}
      </div>
      <div
        {...laneProps}
        className={`relative min-w-0 flex-1 ${LANE_PADDING} ${laneProps?.className ?? ""}`}
      >
        <div className="relative size-full" ref={laneRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
