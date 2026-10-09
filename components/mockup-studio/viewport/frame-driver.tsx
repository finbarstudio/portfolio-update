"use client";

import { useFrame } from "@react-three/fiber";
import { useState } from "react";
import { Color, MathUtils, PerspectiveCamera } from "three";
import { visibleSpan } from "@/lib/mockup-studio/scene/framing";
import { resolveAt, useStudio } from "@/lib/mockup-studio/scene/store";
import type { ViewportRuntime } from "./runtime";

/**
 * Runs first on every frame, live or exported. It decides the time, resolves the scene values once for everyone else
 * (`runtime.values`), then applies the camera and the clear colour.
 */
export function FrameDriver({ runtime }: { runtime: ViewportRuntime }) {
  const [clear] = useState(() => new Color());

  useFrame((state) => {
    const studio = useStudio.getState();
    runtime.timeMs = runtime.exportMs ?? studio.playhead;
    const v = resolveAt(runtime.timeMs);
    runtime.values = v;

    // Zoom is relative to the device and the frame: at 60 the whole device fits whatever its proportions or the
    // composition's, with room to turn. The lens changes the perspective but not this framing.
    const { camera } = state;
    if (camera instanceof PerspectiveCamera) {
      const fov = 50 - v["camera.lens"] * 0.4;
      const aspect = studio.composition.width / studio.composition.height;
      const span = visibleSpan(runtime.deviceExtents, aspect, v["camera.zoom"]);
      const distance = span / (2 * Math.tan(MathUtils.degToRad(fov / 2)));
      camera.manual = true;
      camera.fov = fov;
      camera.aspect = studio.composition.width / studio.composition.height;
      camera.near = Math.max(0.01, distance - 5);
      camera.far = distance + 20;
      camera.position.set(0, 0, distance);
      camera.updateProjectionMatrix();
    }

    const { background } = studio;
    if (background.transparent) {
      state.gl.setClearColor(0x000000, 0);
    } else {
      // Opacity composites the colour over black, done on the sRGB values like a CSS overlay would.
      clear.set(background.color).convertLinearToSRGB();
      clear.multiplyScalar(v["background.opacity"] / 100).convertSRGBToLinear();
      state.gl.setClearColor(clear, 1);
    }
  }, -10);

  return null;
}
