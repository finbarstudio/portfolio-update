"use client";

import { useId } from "react";
import { Button } from "@/components/mockup-studio/ui/button";
import { ColourPicker } from "@/components/mockup-studio/ui/colour-picker";
import { PlusIcon, TargetIcon, TrashIcon } from "@/components/mockup-studio/ui/icons";
import { ParamSlider } from "@/components/mockup-studio/ui/param-slider";
import { Section } from "@/components/mockup-studio/ui/section";
import { Slider } from "@/components/mockup-studio/ui/slider";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Light } from "@/lib/mockup-studio/scene/types";
import { LightPad } from "./light-pad";

function LightEditor({ light }: { light: Light }) {
  const updateLight = useStudio((s) => s.updateLight);
  const setPick = useStudio((s) => s.setPick);
  const aiming = useStudio(
    (s) => s.pick?.kind === "lightTarget" && s.pick.lightId === light.id,
  );
  const nameId = useId();

  return (
    <div className="flex flex-col gap-1 rounded-ms-control border border-ms-line p-2">
      <div className="flex items-center gap-2">
        <label htmlFor={nameId} className="w-12 shrink-0 text-ms-ink-muted">
          Name
        </label>
        <input
          id={nameId}
          type="text"
          value={light.name}
          autoComplete="off"
          onChange={(event) =>
            updateLight(light.id, { name: event.target.value })
          }
          className="h-7 min-w-0 flex-1 rounded-ms-control bg-ms-raised px-2"
        />
      </div>
      <Slider
        label="Intensity"
        value={light.intensity}
        min={0}
        max={10}
        step={0.1}
        onChange={(intensity) => updateLight(light.id, { intensity })}
      />
      <Slider
        label="Azimuth"
        value={light.azimuth}
        min={-180}
        max={180}
        step={1}
        unit="°"
        defaultValue={0}
        onChange={(azimuth) => updateLight(light.id, { azimuth })}
      />
      <Slider
        label="Elevation"
        value={light.elevation}
        min={-90}
        max={90}
        step={1}
        unit="°"
        defaultValue={0}
        onChange={(elevation) => updateLight(light.id, { elevation })}
      />
      <ColourPicker
        label="Colour"
        value={light.color}
        onChange={(color) => updateLight(light.id, { color })}
      />
      <Button
        pressed={aiming}
        onClick={() =>
          setPick(aiming ? null : { kind: "lightTarget", lightId: light.id })
        }
      >
        <TargetIcon width={14} height={14} />
        Aim at a spot
      </Button>
    </div>
  );
}

export function LightsSection() {
  const lights = useStudio((s) => s.lights);
  const selectedLightId = useStudio((s) => s.selectedLightId);
  const selectLight = useStudio((s) => s.selectLight);
  const addLight = useStudio((s) => s.addLight);
  const removeLight = useStudio((s) => s.removeLight);
  const selected = lights.find((light) => light.id === selectedLightId);

  return (
    <Section title="Lights" defaultOpen={false}>
      <div className="flex flex-wrap gap-1">
        {lights.map((light) => (
          <Button
            key={light.id}
            pressed={light.id === selectedLightId}
            onClick={() => selectLight(light.id)}
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full border border-ms-ink-faint"
              style={{ backgroundColor: light.color }}
            />
            <span className="max-w-24 truncate">{light.name}</span>
          </Button>
        ))}
      </div>
      <div className="flex gap-1">
        <Button onClick={() => addLight()}>
          <PlusIcon width={14} height={14} />
          Add light
        </Button>
        <Button
          disabled={!selected}
          onClick={() => {
            if (selected) removeLight(selected.id);
          }}
        >
          <TrashIcon width={14} height={14} />
          Delete light
        </Button>
      </div>
      <LightPad />
      {selected ? <LightEditor key={selected.id} light={selected} /> : null}
      <ParamSlider path="lights.ambient" />
      <ParamSlider path="lights.rotation" />
    </Section>
  );
}
