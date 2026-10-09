"use client";

import { IconButton } from "@/components/mockup-studio/ui/button";
import { TargetIcon } from "@/components/mockup-studio/ui/icons";
import type { AnimPath } from "@/lib/mockup-studio/scene/params";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { EffectCenters } from "@/lib/mockup-studio/scene/types";
import { ParamSection } from "./param-section";

function PlaceCenterButton({ effect }: { effect: keyof EffectCenters }) {
  const active = useStudio(
    (s) => s.pick?.kind === "effectCenter" && s.pick.effect === effect,
  );
  const setPick = useStudio((s) => s.setPick);

  return (
    <IconButton
      label={`Place the ${effect} centre on the shot`}
      pressed={active}
      onClick={() => setPick(active ? null : { kind: "effectCenter", effect })}
    >
      <TargetIcon width={14} height={14} />
    </IconButton>
  );
}

function extraFor(path: AnimPath) {
  if (path === "effects.blur") return <PlaceCenterButton effect="blur" />;
  if (path === "effects.aberration") {
    return <PlaceCenterButton effect="aberration" />;
  }
  return null;
}

export function EffectsSection() {
  return (
    <ParamSection
      title="Effects"
      group="effects"
      defaultOpen={false}
      renderExtra={extraFor}
    />
  );
}
