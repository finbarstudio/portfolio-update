"use client";

import { useState } from "react";
import { IconButton } from "@/components/mockup-studio/ui/button";
import { ColourPicker } from "@/components/mockup-studio/ui/colour-picker";
import { FileButton } from "@/components/mockup-studio/ui/file-button";
import { CloseIcon, ImageIcon, PlusIcon } from "@/components/mockup-studio/ui/icons";
import { revokeIfBlob } from "@/components/mockup-studio/ui/object-url";
import { ParamSlider } from "@/components/mockup-studio/ui/param-slider";
import { Section } from "@/components/mockup-studio/ui/section";
import { Segmented, type SegmentedOption } from "@/components/mockup-studio/ui/segmented";
import { Slider } from "@/components/mockup-studio/ui/slider";
import { Switch } from "@/components/mockup-studio/ui/switch";
import { HDRIS, hdriFormat } from "@/lib/mockup-studio/scene/hdris";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { FloorKind } from "@/lib/mockup-studio/scene/types";

/** Surfaces the device can stand on. Shadows switch on with any of them. */
const FLOORS: SegmentedOption<FloorKind>[] = [
  { value: "none", label: "No floor" },
  { value: "concrete", label: "Concrete" },
  { value: "asphalt", label: "Asphalt" },
  { value: "wood", label: "Wood" },
];

import type { BackgroundLayer } from "@/lib/mockup-studio/scene/types";

const LAYER_FITS: SegmentedOption<BackgroundLayer["fit"]>[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
];

function LayerRow({ layer }: { layer: BackgroundLayer }) {
  const updateBackgroundLayer = useStudio((s) => s.updateBackgroundLayer);
  const removeBackgroundLayer = useStudio((s) => s.removeBackgroundLayer);

  return (
    <li className="flex flex-col gap-1 rounded-ms-control border border-ms-line p-2">
      <div className="flex items-center gap-1.5">
        <ImageIcon width={14} height={14} className="shrink-0 text-ms-ink-faint" />
        <span className="min-w-0 flex-1 truncate" title={layer.name}>
          {layer.name}
        </span>
        <IconButton
          label={`Remove layer ${layer.name}`}
          onClick={() => {
            revokeIfBlob(layer.url);
            removeBackgroundLayer(layer.id);
          }}
        >
          <CloseIcon width={14} height={14} />
        </IconButton>
      </div>
      <Slider
        label="Opacity"
        value={layer.opacity}
        min={0}
        max={100}
        step={1}
        unit="%"
        defaultValue={100}
        onChange={(opacity) => updateBackgroundLayer(layer.id, { opacity })}
      />
      <Segmented
        label={`Fit for ${layer.name}`}
        value={layer.fit}
        options={LAYER_FITS}
        onChange={(fit) => updateBackgroundLayer(layer.id, { fit })}
      />
    </li>
  );
}

export function BackgroundSection() {
  const background = useStudio((s) => s.background);
  const setBackground = useStudio((s) => s.setBackground);
  const addBackgroundLayer = useStudio((s) => s.addBackgroundLayer);
  const [hdriError, setHdriError] = useState<string | null>(null);

  function addLayers(files: File[]) {
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      addBackgroundLayer({
        url: URL.createObjectURL(file),
        name: file.name,
        opacity: 100,
        fit: "cover",
      });
    }
  }

  function addEnvironment([file]: File[]) {
    if (!file) return;
    const format = hdriFormat(file.name);
    if (!format) {
      setHdriError(`${file.name} is not an .hdr or .exr file.`);
      return;
    }
    setHdriError(null);
    if (background.hdriFile) revokeIfBlob(background.hdriFile.url);
    setBackground({
      hdriFile: {
        id: file.name,
        name: file.name,
        url: URL.createObjectURL(file),
        format,
      },
    });
  }

  return (
    <Section title="Background" defaultOpen={false}>
      <ColourPicker
        label="Colour"
        value={background.color}
        onChange={(color) => setBackground({ color })}
      />
      <ParamSlider path="background.opacity" />
      <Switch
        label="Transparent"
        checked={background.transparent}
        onChange={(transparent) => setBackground({ transparent })}
      />
      <Segmented
        label="Floor"
        value={background.floor}
        options={FLOORS}
        onChange={(floor) => setBackground({ floor })}
      />
      <div className="flex min-h-7 items-center justify-between gap-2">
        <span className="text-ms-ink-muted">Environment</span>
        <div className="flex min-w-0 items-center gap-1">
          {HDRIS.length > 0 && !background.hdriFile ? (
            <select
              aria-label="Built-in environment"
              value={background.hdri ?? ""}
              onChange={(event) =>
                setBackground({ hdri: event.target.value || null })
              }
              className="h-7 max-w-32 rounded-ms-control border border-ms-line bg-ms-raised px-1.5 text-ms-ink"
            >
              <option value="">None</option>
              {HDRIS.map((hdri) => (
                <option key={hdri.id} value={hdri.id}>
                  {hdri.name}
                </option>
              ))}
            </select>
          ) : null}
          {background.hdriFile ? (
            <>
              <span
                className="max-w-28 truncate text-ms-ink"
                title={background.hdriFile.name}
              >
                {background.hdriFile.name}
              </span>
              <IconButton
                label="Remove environment"
                onClick={() => {
                  if (background.hdriFile)
                    revokeIfBlob(background.hdriFile.url);
                  setBackground({ hdriFile: null });
                }}
              >
                <CloseIcon width={14} height={14} />
              </IconButton>
            </>
          ) : (
            <FileButton accept=".hdr,.exr" onFiles={addEnvironment}>
              <PlusIcon width={14} height={14} />
              Add HDRI
            </FileButton>
          )}
        </div>
      </div>
      {hdriError ? (
        <p role="alert" className="text-ms-rec">
          {hdriError}
        </p>
      ) : null}
      {background.hdri || background.hdriFile ? (
        <>
          <Slider
            label="Blur"
            value={background.hdriBlur}
            min={0}
            max={100}
            step={1}
            defaultValue={25}
            onChange={(hdriBlur) => setBackground({ hdriBlur })}
          />
          <Slider
            label="Brightness"
            value={background.hdriBrightness}
            min={0}
            max={200}
            step={1}
            unit="%"
            defaultValue={100}
            onChange={(hdriBrightness) => setBackground({ hdriBrightness })}
          />
          <Slider
            label="Turn"
            value={background.hdriRotation}
            min={-180}
            max={180}
            step={1}
            unit="°"
            defaultValue={0}
            onChange={(hdriRotation) => setBackground({ hdriRotation })}
          />
          <Switch
            label="Light the device with it"
            checked={background.hdriLighting}
            onChange={(hdriLighting) => setBackground({ hdriLighting })}
          />
          {background.transparent ? (
            <p className="text-ms-ink-faint">Hidden while Transparent is on.</p>
          ) : null}
        </>
      ) : null}
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-medium text-ms-ink-muted">Layers</h3>
        <FileButton accept="image/*" multiple onFiles={addLayers}>
          <PlusIcon width={14} height={14} />
          Add layer
        </FileButton>
      </div>
      {background.layers.length === 0 ? (
        <p className="text-ms-ink-faint">No image layers.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {background.layers.map((layer) => (
            <LayerRow key={layer.id} layer={layer} />
          ))}
        </ul>
      )}
    </Section>
  );
}
