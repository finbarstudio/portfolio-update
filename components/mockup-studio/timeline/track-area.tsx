"use client";

import { useRef, useState } from "react";
import { totalDuration } from "@/lib/mockup-studio/scene/animation";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { spanFor } from "./geometry";
import { ProSection, SummaryRow } from "./keyframe-rows";
import { Playhead } from "./playhead";
import { Ruler } from "./ruler";
import { ShotsRow } from "./shots-row";
import { useElementWidth } from "./use-element-width";

/** Ruler, shots, keyframe rows and the playhead over them, all sharing one time axis. */
export function TrackArea() {
  const total = useStudio((s) => totalDuration(s.shots));
  const proMode = useStudio((s) => s.proMode);
  // While a shot edge is dragged the total changes; pinning the span keeps the edge under the pointer.
  const [frozenSpan, setFrozenSpan] = useState<number | null>(null);
  const span = frozenSpan ?? spanFor(total);
  const rulerLaneRef = useRef<HTMLDivElement>(null);
  const laneWidth = useElementWidth(rulerLaneRef);

  return (
    <div className="relative flex min-h-0 flex-1 flex-col text-[11px] select-none">
      <Ruler
        laneRef={rulerLaneRef}
        laneWidth={laneWidth}
        span={span}
        total={total}
      />
      <ShotsRow
        laneWidth={laneWidth}
        onFreezeSpan={setFrozenSpan}
        span={span}
      />
      <SummaryRow span={span} />
      {proMode ? <ProSection span={span} /> : null}
      <Playhead laneRef={rulerLaneRef} span={span} total={total} />
    </div>
  );
}
