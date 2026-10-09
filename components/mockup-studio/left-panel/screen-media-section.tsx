"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/mockup-studio/ui/button";
import { FileButton } from "@/components/mockup-studio/ui/file-button";
import { CloseIcon, UploadIcon } from "@/components/mockup-studio/ui/icons";
import { Section } from "@/components/mockup-studio/ui/section";
import { Segmented, type SegmentedOption } from "@/components/mockup-studio/ui/segmented";
import { Slider } from "@/components/mockup-studio/ui/slider";
import { createTestFootage } from "@/lib/mockup-studio/media/test-footage";
import { type DeviceDef, getDevice } from "@/lib/mockup-studio/scene/devices";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { MediaFit } from "@/lib/mockup-studio/scene/types";
import { clearMedia, setMediaFromFile } from "./media";

const FIT_OPTIONS: SegmentedOption<MediaFit>[] = [
  { value: "cover", label: "Cover" },
  { value: "contain", label: "Contain" },
  { value: "stretch", label: "Stretch" },
];

/** The size to make media at: the real panel's pixels when known, otherwise the screen's shape at a 2000px long edge. */
function screenSize(device: DeviceDef): [number, number] {
  if (device.screenPixels) return device.screenPixels;
  const even = (n: number) => Math.round(n / 2) * 2;
  return device.screenAspect >= 1
    ? [2000, even(2000 / device.screenAspect)]
    : [even(2000 * device.screenAspect), 2000];
}

const COMMON_RATIOS: [number, number][] = [
  [1, 1],
  [4, 3],
  [3, 2],
  [16, 10],
  [16, 9],
  [2, 1],
  [3, 4],
  [2, 3],
  [9, 16],
  [9, 19.5],
  [5, 7],
  [2, 9],
];

/** A familiar ratio when the screen is within 2% of one, otherwise width over height to two decimals. */
function ratioLabel(aspect: number): string {
  const match = COMMON_RATIOS.find(
    ([w, h]) => Math.abs(w / h - aspect) / aspect < 0.02,
  );
  return match ? `${match[0]}:${match[1]}` : `${aspect.toFixed(2)}:1`;
}

export function ScreenMediaSection() {
  const media = useStudio((s) => s.media);
  const updateMedia = useStudio((s) => s.updateMedia);
  const fitTimelineTo = useStudio((s) => s.fitTimelineTo);
  const [error, setError] = useState<string | null>(null);
  const [making, setMaking] = useState(false);
  const device = useStudio((s) => getDevice(s.deviceId));
  const size = screenSize(device);
  const ratio = ratioLabel(device.screenAspect);

  const useTestFootage = async () => {
    setMaking(true);
    try {
      setError(setMediaFromFile(await createTestFootage(size)));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not make test footage.",
      );
    } finally {
      setMaking(false);
    }
  };

  return (
    <Section title="Screen media">
      <FileButton
        accept="image/*,video/*"
        size="lg"
        onFiles={([file]) => setError(setMediaFromFile(file))}
      >
        <UploadIcon width={14} height={14} />
        {media ? "Replace image or video" : "Upload image or video"}
      </FileButton>
      <p className="text-ms-ink-faint">Or drop a file anywhere in the window.</p>
      <Button
        onClick={useTestFootage}
        disabled={making}
        title="Fill the screen with a looping 8 second sample clip made to fit this device"
      >
        {making ? "Making test footage…" : "Use test footage"}
      </Button>
      <p className="text-ms-ink-muted">
        Screen is{" "}
        <span className="text-ms-ink tabular-nums">
          {size[0]} × {size[1]} px
        </span>{" "}
        ({ratio}). Media at that shape fills it exactly.
      </p>
      {error ? (
        <p role="alert" className="text-ms-rec">
          {error}
        </p>
      ) : null}

      {media ? (
        <div className="flex flex-col gap-1 pt-1">
          <div className="relative aspect-video w-full overflow-hidden rounded-ms-control bg-ms-raised">
            {media.kind === "image" ? (
              <Image
                src={media.url}
                alt={`Preview of ${media.name}`}
                fill
                unoptimized
                sizes="256px"
                className="object-contain"
              />
            ) : (
              <video
                src={media.url}
                aria-label={`Preview of ${media.name}`}
                muted
                playsInline
                preload="metadata"
                className="size-full object-contain"
              />
            )}
          </div>
          <div className="flex items-center gap-1">
            <span className="min-w-0 flex-1 truncate" title={media.name}>
              {media.name}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                clearMedia();
                setError(null);
              }}
            >
              <CloseIcon width={14} height={14} />
              Remove
            </Button>
          </div>
          {media.kind === "video" && media.duration ? (
            <Button
              onClick={() => fitTimelineTo(media.duration ?? 0)}
              title="Stretch or squeeze the animation so it lasts exactly as long as the video"
            >
              Match animation to video ({(media.duration / 1000).toFixed(1)}s)
            </Button>
          ) : null}
          <Segmented
            label="Fit"
            value={media.fit}
            options={FIT_OPTIONS}
            onChange={(fit) => updateMedia({ fit })}
          />
          <Slider
            label="Scale"
            value={media.scale}
            min={0.2}
            max={4}
            typedMin={0.05}
            typedMax={20}
            step={0.01}
            defaultValue={1}
            onChange={(scale) => updateMedia({ scale })}
          />
          <Slider
            label="Offset X"
            value={media.offsetX}
            min={-1}
            max={1}
            typedMin={-5}
            typedMax={5}
            step={0.01}
            defaultValue={0}
            onChange={(offsetX) => updateMedia({ offsetX })}
          />
          <Slider
            label="Offset Y"
            value={media.offsetY}
            min={-1}
            max={1}
            typedMin={-5}
            typedMax={5}
            step={0.01}
            defaultValue={0}
            onChange={(offsetY) => updateMedia({ offsetY })}
          />
        </div>
      ) : null}
    </Section>
  );
}
