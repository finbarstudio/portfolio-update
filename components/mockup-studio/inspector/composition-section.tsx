"use client";

import { Button } from "@/components/mockup-studio/ui/button";
import { NumberField } from "@/components/mockup-studio/ui/number-field";
import { Section } from "@/components/mockup-studio/ui/section";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { AspectPreset } from "@/lib/mockup-studio/scene/types";

interface AspectOption {
  preset: Exclude<AspectPreset, "custom">;
  w: number;
  h: number;
}

const ASPECTS: AspectOption[] = [
  { preset: "1:1", w: 1, h: 1 },
  { preset: "16:9", w: 16, h: 9 },
  { preset: "2:1", w: 2, h: 1 },
  { preset: "4:3", w: 4, h: 3 },
  { preset: "3:4", w: 3, h: 4 },
  { preset: "9:16", w: 9, h: 16 },
];

const GLYPH_PX = 12;

/** A tiny rectangle with the proportions of the aspect ratio. */
function Glyph({ w, h }: { w: number; h: number }) {
  const k = GLYPH_PX / Math.max(w, h);
  return (
    <span
      aria-hidden="true"
      className="block rounded-[2px] border border-current"
      style={{ width: w * k, height: h * k }}
    />
  );
}

export function CompositionSection() {
  const composition = useStudio((s) => s.composition);
  const setAspect = useStudio((s) => s.setAspect);
  const setCustomSize = useStudio((s) => s.setCustomSize);
  const { preset, width, height } = composition;

  return (
    <Section title="Composition">
      <div className="grid grid-cols-3 gap-1">
        {ASPECTS.map((option) => (
          <Button
            key={option.preset}
            size="lg"
            pressed={preset === option.preset}
            onClick={() => setAspect(option.preset)}
          >
            <Glyph w={option.w} h={option.h} />
            {option.preset}
          </Button>
        ))}
        <Button
          size="lg"
          pressed={preset === "custom"}
          onClick={() => setCustomSize(width, height)}
        >
          Custom
        </Button>
      </div>
      {preset === "custom" ? (
        <div className="flex items-center gap-2 pt-1">
          <span aria-hidden="true" className="text-ms-ink-muted">
            W
          </span>
          <NumberField
            label="Width in pixels"
            value={width}
            min={16}
            max={7680}
            step={2}
            onCommit={(next) => setCustomSize(next, height)}
            className="flex-1"
          />
          <span aria-hidden="true" className="text-ms-ink-muted">
            H
          </span>
          <NumberField
            label="Height in pixels"
            value={height}
            min={16}
            max={7680}
            step={2}
            onCommit={(next) => setCustomSize(width, next)}
            className="flex-1"
          />
        </div>
      ) : null}
      <p className="pt-1 tabular-nums text-ms-ink-faint">
        {width} × {height} px
      </p>
    </Section>
  );
}
