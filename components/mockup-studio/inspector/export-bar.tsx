"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/mockup-studio/ui/button";
import { DownloadIcon, VideoIcon } from "@/components/mockup-studio/ui/icons";
import { Segmented, type SegmentedOption } from "@/components/mockup-studio/ui/segmented";
import { useDismiss } from "@/components/mockup-studio/ui/use-dismiss";
import { type ExportProgress, exportImage, exportVideo } from "@/lib/mockup-studio/export";
import { useStudio } from "@/lib/mockup-studio/scene/store";

type ImageScale = 1 | 2 | 4;
type VideoFps = 30 | 60;
type VideoScale = 0.5 | 1 | 2;

const IMAGE_SCALES: ImageScale[] = [1, 2, 4];

const FPS_OPTIONS: SegmentedOption<VideoFps>[] = [
  { value: 30, label: "30 fps" },
  { value: 60, label: "60 fps" },
];

const VIDEO_SCALE_OPTIONS: SegmentedOption<VideoScale>[] = [
  { value: 0.5, label: "0.5×" },
  { value: 1, label: "1×" },
  { value: 2, label: "2×" },
];

type ExportState =
  | { status: "idle" }
  | {
      status: "running";
      kind: "image" | "video";
      progress: number;
      stage: ExportProgress["stage"] | null;
    }
  | { status: "error"; message: string };

function messageOf(error: unknown): string {
  return error instanceof Error && error.message
    ? error.message
    : "The export failed.";
}

function stageText(state: Extract<ExportState, { status: "running" }>) {
  if (state.kind === "image") return "Rendering image…";
  return state.stage === "finalizing"
    ? "Finalizing video…"
    : "Rendering frames…";
}

export function ExportBar() {
  const composition = useStudio((s) => s.composition);
  const [state, setState] = useState<ExportState>({ status: "idle" });
  const [menu, setMenu] = useState<"image" | "video" | null>(null);
  const [fps, setFps] = useState<VideoFps>(60);
  const [scale, setScale] = useState<VideoScale>(1);
  const abortRef = useRef<AbortController | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useDismiss(rootRef, menu !== null, () => setMenu(null));

  const busy = state.status === "running";

  async function runImage(imageScale: ImageScale) {
    setMenu(null);
    setState({ status: "running", kind: "image", progress: 0, stage: null });
    try {
      await exportImage(imageScale);
      setState({ status: "idle" });
    } catch (error) {
      setState({ status: "error", message: messageOf(error) });
    }
  }

  async function runVideo() {
    const controller = new AbortController();
    abortRef.current = controller;
    setMenu(null);
    setState({ status: "running", kind: "video", progress: 0, stage: null });
    try {
      await exportVideo({
        fps,
        scale,
        signal: controller.signal,
        onProgress: ({ progress, stage }) => {
          if (controller.signal.aborted) return;
          setState({ status: "running", kind: "video", progress, stage });
        },
      });
      setState({ status: "idle" });
    } catch (error) {
      // Cancelling rejects the export; that is not an error worth showing.
      if (controller.signal.aborted) setState({ status: "idle" });
      else setState({ status: "error", message: messageOf(error) });
    } finally {
      abortRef.current = null;
    }
  }

  return (
    <div ref={rootRef} className="relative border-b border-ms-line p-4">
      <div className="grid grid-cols-2 gap-2">
        <Button
          disabled={busy}
          aria-expanded={menu === "image"}
          onClick={() => setMenu(menu === "image" ? null : "image")}
        >
          <DownloadIcon width={14} height={14} />
          Export image
        </Button>
        <Button
          variant="primary"
          disabled={busy}
          aria-expanded={menu === "video"}
          onClick={() => setMenu(menu === "video" ? null : "video")}
        >
          <VideoIcon width={14} height={14} />
          Export video
        </Button>
      </div>

      {menu === "image" ? (
        <fieldset className="absolute inset-x-3 top-full z-20 mt-1 flex flex-col gap-1 rounded-ms-control border border-ms-line bg-ms-raised p-1.5 shadow-lg">
          <legend className="sr-only">Image size</legend>
          {IMAGE_SCALES.map((imageScale) => (
            <button
              key={imageScale}
              type="button"
              onClick={() => runImage(imageScale)}
              className="flex h-8 items-center justify-between rounded-ms-control px-2 hover:bg-ms-hover"
            >
              <span>{imageScale}×</span>
              <span className="tabular-nums text-ms-ink-muted">
                {composition.width * imageScale} ×{" "}
                {composition.height * imageScale} px
              </span>
            </button>
          ))}
        </fieldset>
      ) : null}

      {menu === "video" ? (
        <div className="absolute inset-x-3 top-full z-20 mt-1 flex flex-col gap-2 rounded-ms-control border border-ms-line bg-ms-raised p-2 shadow-lg">
          <Segmented<VideoFps>
            label="Frame rate"
            value={fps}
            options={FPS_OPTIONS}
            onChange={setFps}
            className="bg-ms-panel"
          />
          <Segmented<VideoScale>
            label="Resolution"
            value={scale}
            options={VIDEO_SCALE_OPTIONS}
            onChange={setScale}
            className="bg-ms-panel"
          />
          <p className="tabular-nums text-ms-ink-muted">
            {Math.round(composition.width * scale)} ×{" "}
            {Math.round(composition.height * scale)} px
          </p>
          <Button variant="primary" onClick={runVideo}>
            Start
          </Button>
        </div>
      ) : null}

      {state.status === "running" ? (
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-ms-ink-muted">
            <span>{stageText(state)}</span>
            {state.kind === "video" ? (
              <span className="tabular-nums">
                {Math.round(state.progress * 100)}%
              </span>
            ) : null}
          </div>
          <progress
            aria-label={stageText(state)}
            max={1}
            value={state.kind === "video" ? state.progress : undefined}
            className="h-1.5 w-full appearance-none overflow-hidden rounded-full bg-ms-raised [&::-moz-progress-bar]:bg-ms-ink [&::-webkit-progress-bar]:bg-ms-raised [&::-webkit-progress-value]:bg-ms-ink"
          />
          {state.kind === "video" ? (
            <Button onClick={() => abortRef.current?.abort()}>Cancel</Button>
          ) : null}
        </div>
      ) : null}

      {state.status === "error" ? (
        <p role="alert" className="mt-3 text-ms-rec">
          {state.message}
        </p>
      ) : null}
    </div>
  );
}
