"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/mockup-studio/ui/button";
import { cn } from "@/components/mockup-studio/ui/cn";
import { ColourPicker } from "@/components/mockup-studio/ui/colour-picker";
import { FileButton } from "@/components/mockup-studio/ui/file-button";
import { CloseIcon, UploadIcon } from "@/components/mockup-studio/ui/icons";
import { Section } from "@/components/mockup-studio/ui/section";
import { Segmented, type SegmentedOption } from "@/components/mockup-studio/ui/segmented";
import { Slider } from "@/components/mockup-studio/ui/slider";
import { Switch } from "@/components/mockup-studio/ui/switch";
import { createTestFootage } from "@/lib/mockup-studio/media/test-footage";
import { type DeviceDef, getDevice } from "@/lib/mockup-studio/scene/devices";
import {
  DEFAULT_FRAME,
  FRAME_STYLES,
  WALLPAPERS,
  wallpaperCss,
} from "@/lib/mockup-studio/scene/frames";
import { DEFAULT_STATUS_BAR, MAX_STATUS_BAR } from "@/lib/mockup-studio/scene/status-bar";
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

/** What sits behind and around the media when it is shown in a frame rather than filling the screen. */
function FrameControls() {
  const frame = useStudio((s) => s.frame);
  const setFrame = useStudio((s) => s.setFrame);
  return (
    <>
      <fieldset className="flex flex-col gap-1.5">
        <legend className="mb-1.5 text-ms-ink-muted">Behind</legend>
        <div className="grid grid-cols-5 gap-1.5">
          <WallpaperSwatch
            label="Plain colour"
            selected={frame.wallpaper === null}
            background={frame.backdropColor}
            onSelect={() => setFrame({ wallpaper: null })}
          />
          {WALLPAPERS.map((wallpaper) => (
            <WallpaperSwatch
              key={wallpaper.id}
              label={wallpaper.name}
              selected={frame.wallpaper === wallpaper.id}
              background={wallpaperCss(wallpaper)}
              onSelect={() => setFrame({ wallpaper: wallpaper.id })}
            />
          ))}
        </div>
      </fieldset>
      {frame.wallpaper === null ? (
        <ColourPicker
          label="Behind colour"
          value={frame.backdropColor}
          onChange={(backdropColor) => setFrame({ backdropColor })}
        />
      ) : null}
      <ColourPicker
        label={frame.style === "card" ? "Card colour" : "Window colour"}
        value={frame.windowColor}
        onChange={(windowColor) => setFrame({ windowColor })}
      />
      <Slider
        label="Space around"
        value={frame.screenPadding}
        min={0}
        max={40}
        step={1}
        defaultValue={DEFAULT_FRAME.screenPadding}
        onChange={(screenPadding) => setFrame({ screenPadding })}
      />
      <Slider
        label="Space inside"
        value={frame.mediaPadding}
        min={0}
        max={20}
        step={1}
        defaultValue={DEFAULT_FRAME.mediaPadding}
        onChange={(mediaPadding) => setFrame({ mediaPadding })}
      />
      <Slider
        label="Corners"
        value={frame.radius}
        min={0}
        max={100}
        step={1}
        defaultValue={DEFAULT_FRAME.radius}
        onChange={(radius) => setFrame({ radius })}
      />
      <Slider
        label="Shadow"
        value={frame.shadow}
        min={0}
        max={100}
        step={1}
        defaultValue={DEFAULT_FRAME.shadow}
        onChange={(shadow) => setFrame({ shadow })}
      />
    </>
  );
}

const BAR_COLOUR_OPTIONS: SegmentedOption<"auto" | "custom">[] = [
  { value: "auto", label: "From media" },
  { value: "custom", label: "Custom" },
];

/**
 * The band a phone's browser paints across the top of the screen, behind the status bar and the Dynamic Island. Its
 * height is set in the screen's own pixels, so it can be matched to a real device.
 */
function StatusBarControls({ screenHeight }: { screenHeight: number }) {
  const bar = useStudio((s) => s.statusBar);
  const setStatusBar = useStudio((s) => s.setStatusBar);
  const toPixels = (percent: number) =>
    Math.round((percent / 100) * screenHeight);
  return (
    <>
      <Switch
        label="Status bar"
        checked={bar.on}
        onChange={(on) => setStatusBar({ on })}
      />
      {bar.on ? (
        <>
          <Slider
            label="Bar height"
            value={toPixels(bar.height)}
            min={0}
            max={toPixels(MAX_STATUS_BAR)}
            step={1}
            unit="px"
            defaultValue={toPixels(DEFAULT_STATUS_BAR.height)}
            onChange={(px) =>
              setStatusBar({ height: (px / screenHeight) * 100 })
            }
          />
          <Segmented
            label="Bar colour"
            value={bar.auto ? "auto" : "custom"}
            options={BAR_COLOUR_OPTIONS}
            onChange={(choice) => setStatusBar({ auto: choice === "auto" })}
          />
          {bar.auto ? null : (
            <ColourPicker
              label="Bar colour"
              value={bar.color}
              onChange={(color) => setStatusBar({ color })}
            />
          )}
          <p className="text-[11px] text-ms-ink-faint text-pretty">
            The media sits below the bar, the way a page does in a phone&apos;s
            browser. From media takes the colour along its top edge.
          </p>
        </>
      ) : null}
    </>
  );
}

function WallpaperSwatch({
  label,
  selected,
  background,
  onSelect,
}: {
  label: string;
  selected: boolean;
  background: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "aspect-square rounded-ms-control border border-ms-line outline-offset-2 focus-visible:outline-2 focus-visible:outline-ms-ink",
        selected && "ring-2 ring-ms-ink",
      )}
      style={{ background }}
    />
  );
}

export function ScreenMediaSection() {
  const media = useStudio((s) => s.media);
  const updateMedia = useStudio((s) => s.updateMedia);
  const fitTimelineTo = useStudio((s) => s.fitTimelineTo);
  const frame = useStudio((s) => s.frame);
  const setFrame = useStudio((s) => s.setFrame);
  const [error, setError] = useState<string | null>(null);
  /** 0..1 while the test clip is being made, otherwise null. */
  const [making, setMaking] = useState<number | null>(null);
  const sound = useStudio((s) => s.sound);
  const setSound = useStudio((s) => s.setSound);
  const speakerSound = useStudio((s) => s.speakerSound);
  const setSpeakerSound = useStudio((s) => s.setSpeakerSound);
  const device = useStudio((s) => getDevice(s.deviceId));
  const size = screenSize(device);
  const ratio = ratioLabel(device.screenAspect);

  const useTestFootage = async () => {
    setMaking(0);
    try {
      setError(setMediaFromFile(await createTestFootage(size, setMaking)));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not make test footage.",
      );
    } finally {
      setMaking(null);
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
        disabled={making !== null}
        title="Fill the screen with a looping 10 second sample clip made to fit this device"
        className="relative overflow-hidden"
      >
        {making !== null ? (
          <>
            {/* Fills left to right as frames are encoded. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-full origin-left bg-ms-fill transition-transform duration-150 ease-out"
              style={{ transform: `scaleX(${making})` }}
            />
            <span
              className="relative tabular-nums"
              role="status"
              aria-live="polite"
            >
              Making test footage {Math.round(making * 100)}%
            </span>
          </>
        ) : (
          "Use test footage"
        )}
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
          {media.kind === "video" ? (
            <>
              <Switch label="Sound" checked={sound} onChange={setSound} />
              <Switch
                label="From the device's speakers"
                checked={speakerSound}
                onChange={setSpeakerSound}
              />
              <p className="text-[11px] text-ms-ink-faint text-pretty">
                Heard while the animation plays, and kept in exported video.
                From the speakers, it thins out on small devices, dulls when a
                lid shuts or the device turns away, and rises as the camera
                moves in.
              </p>
            </>
          ) : null}
          {media.kind === "video" && media.duration ? (
            <Button
              onClick={() => fitTimelineTo(media.duration ?? 0)}
              title="Stretch or squeeze the animation so it lasts exactly as long as the video"
            >
              Match animation to video ({(media.duration / 1000).toFixed(1)}s)
            </Button>
          ) : null}
          <Segmented
            label="Frame"
            value={frame.style}
            options={FRAME_STYLES}
            onChange={(style) => setFrame({ style })}
          />
          {frame.style === "none" ? (
            <>
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
            </>
          ) : (
            <FrameControls />
          )}
          <StatusBarControls screenHeight={size[1]} />
        </div>
      ) : null}
    </Section>
  );
}
