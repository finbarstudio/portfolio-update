"use client";

import { BackgroundLayers } from "./background";
import { Device } from "./device";
import { Effects } from "./effects";
import { ExportBridge } from "./export-bridge";
import { Floor } from "./floor";
import { FrameDriver } from "./frame-driver";
import { Interaction } from "./interaction";
import { Lights } from "./lights";
import type { ViewportRuntime } from "./runtime";

/**
 * Everything inside the canvas. This component has no store subscriptions of its own, so it never re-renders on its
 * own; each child subscribes only to the structural state it needs and animates through `runtime`.
 */
export function StudioScene({ runtime }: { runtime: ViewportRuntime }) {
  return (
    <>
      <FrameDriver runtime={runtime} />
      <Lights runtime={runtime} />
      <BackgroundLayers />
      <Device runtime={runtime} />
      <Floor runtime={runtime} />
      <Effects runtime={runtime} />
      <Interaction runtime={runtime} />
      <ExportBridge runtime={runtime} />
    </>
  );
}
