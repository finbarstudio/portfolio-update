"use client";

import dynamic from "next/dynamic";
import { type DragEvent, useEffect, useRef, useState } from "react";
import { setMediaFromFile } from "@/components/mockup-studio/left-panel/media";
import { Button, IconButton } from "@/components/mockup-studio/ui/button";
import {
  CloseIcon,
  FitIcon,
  FullscreenIcon,
  GuidesIcon,
  HandIcon,
  SelectIcon,
} from "@/components/mockup-studio/ui/icons";
import { PintLink } from "@/components/mockup-studio/ui/pint-link";
import { PARAMS } from "@/lib/mockup-studio/scene/params";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { PickMode } from "@/lib/mockup-studio/scene/types";

const Viewport = dynamic(
  () => import("@/components/mockup-studio/viewport/viewport").then((m) => m.Viewport),
  { ssr: false },
);

function hasFiles(event: DragEvent<HTMLElement>): boolean {
  return Array.from(event.dataTransfer.types).includes("Files");
}

function pickHint(pick: PickMode): string {
  return pick.kind === "lightTarget"
    ? "Click the device to aim the light."
    : `Click the shot to place the ${pick.effect} centre.`;
}

/** Put the device back in the middle at the default zoom. */
function fitToFrame() {
  const { setValue } = useStudio.getState();
  setValue("camera.zoom", PARAMS["camera.zoom"].default);
  setValue("object.x", PARAMS["object.x"].default);
  setValue("object.y", PARAMS["object.y"].default);
}

function toggleFullscreen(element: HTMLElement | null) {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void element?.requestFullscreen();
}

export function ViewportArea() {
  const tool = useStudio((s) => s.tool);
  const setTool = useStudio((s) => s.setTool);
  const pick = useStudio((s) => s.pick);
  const setPick = useStudio((s) => s.setPick);
  const guides = useStudio((s) => s.guides);
  const setGuides = useStudio((s) => s.setGuides);
  const sectionRef = useRef<HTMLElement>(null);
  const [dragging, setDragging] = useState(false);
  const [dropError, setDropError] = useState<string | null>(null);
  // dragenter/leave fire for every child crossed, so count the depth.
  const depth = useRef(0);

  // A file dropped anywhere else in the window would make the browser navigate to it. Treat it as a media drop too.
  useEffect(() => {
    const allow = (event: globalThis.DragEvent) => {
      if (event.dataTransfer?.types.includes("Files")) event.preventDefault();
    };
    const drop = (event: globalThis.DragEvent) => {
      // Already handled by the viewport's own handler below.
      if (event.defaultPrevented) return;
      const file = event.dataTransfer?.files[0];
      if (!file) return;
      event.preventDefault();
      setDropError(setMediaFromFile(file));
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.isContentEditable || target.matches("input, textarea, select"));
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "f" || event.key === "F")
        toggleFullscreen(sectionRef.current);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("dragover", allow);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("dragover", allow);
      window.removeEventListener("drop", drop);
    };
  }, []);

  function onDragEnter(event: DragEvent<HTMLElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth.current += 1;
    setDragging(true);
  }

  function onDragOver(event: DragEvent<HTMLElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }

  function onDragLeave(event: DragEvent<HTMLElement>) {
    if (!hasFiles(event)) return;
    depth.current = Math.max(0, depth.current - 1);
    if (depth.current === 0) setDragging(false);
  }

  function onDrop(event: DragEvent<HTMLElement>) {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth.current = 0;
    setDragging(false);
    const [file] = Array.from(event.dataTransfer.files);
    if (file) setDropError(setMediaFromFile(file));
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Viewport"
      className="relative min-w-0 flex-1 overflow-hidden bg-ms-canvas"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Strips above and below the frame are kept clear for the controls that float there. */}
      <div className="absolute inset-0 pt-14 pb-16 [:fullscreen_&]:p-0">
        <Viewport />
      </div>

      <div className="absolute left-4 top-4 z-10 flex gap-0.5 rounded-full border border-ms-line bg-ms-panel/80 p-1 backdrop-blur-md [&_button]:rounded-full">
        <IconButton
          label="Select (V)"
          size="iconLg"
          pressed={tool === "select"}
          onClick={() => setTool("select")}
        >
          <SelectIcon width={18} height={18} />
        </IconButton>
        <IconButton
          label="Hand (H)"
          size="iconLg"
          pressed={tool === "hand"}
          onClick={() => setTool("hand")}
        >
          <HandIcon width={18} height={18} />
        </IconButton>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex gap-0.5 rounded-full border border-ms-line bg-ms-panel/80 p-1 backdrop-blur-md [&_button]:rounded-full">
        <IconButton
          label="Safe-zone guides"
          size="iconLg"
          pressed={guides}
          onClick={() => setGuides(!guides)}
        >
          <GuidesIcon width={18} height={18} />
        </IconButton>
        <IconButton
          label="Full screen (F)"
          size="iconLg"
          onClick={() => toggleFullscreen(sectionRef.current)}
        >
          <FullscreenIcon width={18} height={18} />
        </IconButton>
        <IconButton
          label="Fit device to frame"
          size="iconLg"
          onClick={fitToFrame}
        >
          <FitIcon width={18} height={18} />
        </IconButton>
      </div>

      <div className="absolute right-4 bottom-4 z-10 [:fullscreen_&]:hidden">
        <PintLink floating />
      </div>

      {pick ? (
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 rounded-ms-panel bg-ms-panel py-1 pl-3 pr-1">
          <span className="text-ms-ink-muted">{pickHint(pick)}</span>
          <Button variant="ghost" onClick={() => setPick(null)}>
            Cancel
          </Button>
        </div>
      ) : null}

      {dropError ? (
        <div
          role="alert"
          className="absolute left-1/2 top-3 z-10 flex -translate-x-1/2 items-center gap-1 rounded-ms-panel bg-ms-panel py-1 pl-3 pr-1 text-ms-rec"
        >
          <span>{dropError}</span>
          <IconButton label="Dismiss error" onClick={() => setDropError(null)}>
            <CloseIcon width={12} height={12} />
          </IconButton>
        </div>
      ) : null}

      {dragging ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-2 z-20 grid place-items-center rounded-ms-panel border border-dashed border-ms-ink bg-ms-canvas/70 text-ms-ink"
        >
          Drop to use as the screen
        </div>
      ) : null}
    </section>
  );
}
