"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { Raycaster, Vector2 } from "three";
import { visibleSpan } from "@/lib/mockup-studio/scene/framing";
import { resolveAt, useStudio } from "@/lib/mockup-studio/scene/store";
import type { PickMode } from "@/lib/mockup-studio/scene/types";
import type { ViewportRuntime } from "./runtime";

/** Degrees of rotation per pixel of drag. */
const ROTATE_SPEED = 0.4;
/** Zoom change per wheel pixel (ln units). Pinch gestures arrive as ctrl+wheel with small deltas, so they get more. */
const WHEEL_SPEED = 0.0015;
const PINCH_SPEED = 0.01;

type Drag =
  | {
      mode: "rotate";
      pointerId: number;
      x: number;
      y: number;
      rotX: number;
      rotY: number;
    }
  | {
      mode: "pan";
      pointerId: number;
      x: number;
      y: number;
      objectX: number;
      objectY: number;
      zoom: number;
    };

function wrapDegrees(degrees: number): number {
  return ((((degrees + 180) % 360) + 360) % 360) - 180;
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n));
}

function wheelUnit(mode: number): number {
  if (mode === WheelEvent.DOM_DELTA_LINE) return 16;
  if (mode === WheelEvent.DOM_DELTA_PAGE) return 400;
  return 1;
}

/**
 * Pointer interaction on the canvas element. Every change goes through the store's `setValue`, so recording and
 * keyframed tracks behave exactly as they do for the inspector.
 */
export function Interaction({ runtime }: { runtime: ViewportRuntime }) {
  const gl = useThree((s) => s.gl);
  const get = useThree((s) => s.get);

  useEffect(() => {
    const canvas = gl.domElement;
    const raycaster = new Raycaster();
    const ndc = new Vector2();
    let drag: Drag | null = null;

    canvas.style.touchAction = "none";

    const updateCursor = () => {
      const { pick, tool } = useStudio.getState();
      if (pick) canvas.style.cursor = "crosshair";
      else if (drag) canvas.style.cursor = "grabbing";
      else if (tool === "hand") canvas.style.cursor = "grab";
      else canvas.style.cursor = "default";
    };

    const place = (event: PointerEvent, pick: PickMode) => {
      const rect = canvas.getBoundingClientRect();
      const u = clamp01((event.clientX - rect.left) / rect.width);
      const v = clamp01((event.clientY - rect.top) / rect.height);
      const studio = useStudio.getState();

      if (pick.kind === "effectCenter") {
        studio.setEffectCenter(pick.effect, [u, v]);
        studio.setPick(null);
        return;
      }

      const device = runtime.device;
      if (!device) return;
      ndc.set(u * 2 - 1, -(v * 2 - 1));
      raycaster.setFromCamera(ndc, get().camera);
      device.updateWorldMatrix(true, true);
      const hit = raycaster.intersectObject(device, true)[0];
      // A click that misses the device keeps the pick armed.
      if (!hit) return;
      const local = device.worldToLocal(hit.point.clone());
      studio.updateLight(pick.lightId, { target: [local.x, local.y, local.z] });
      studio.setPick(null);
    };

    const onPointerDown = (event: PointerEvent) => {
      const studio = useStudio.getState();
      if (studio.pick) {
        event.preventDefault();
        if (event.button === 0) place(event, studio.pick);
        return;
      }

      const panning =
        event.button === 1 || (event.button === 0 && studio.tool === "hand");
      if (!panning && event.button !== 0) return;
      event.preventDefault();
      canvas.setPointerCapture(event.pointerId);

      const v = resolveAt(studio.playhead);
      drag = panning
        ? {
            mode: "pan",
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            objectX: v["object.x"],
            objectY: v["object.y"],
            zoom: v["camera.zoom"],
          }
        : {
            mode: "rotate",
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            rotX: v["object.rotX"],
            rotY: v["object.rotY"],
          };
      updateCursor();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      const { setValue } = useStudio.getState();

      if (drag.mode === "rotate") {
        setValue("object.rotY", wrapDegrees(drag.rotY + dx * ROTATE_SPEED));
        setValue("object.rotX", wrapDegrees(drag.rotX + dy * ROTATE_SPEED));
        return;
      }

      // The device sits at the origin plane, so one pixel is span / canvas height world units there. The values are in
      // hundredths of a world unit, and screen y points down.
      const { width, height } = useStudio.getState().composition;
      const span = visibleSpan(
        runtime.deviceExtents,
        width / height,
        drag.zoom,
      );
      const worldPerPixel = span / canvas.getBoundingClientRect().height;
      setValue("object.x", drag.objectX + dx * worldPerPixel * 100);
      setValue("object.y", drag.objectY - dy * worldPerPixel * 100);
    };

    const endDrag = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.pointerId) return;
      drag = null;
      if (canvas.hasPointerCapture(event.pointerId))
        canvas.releasePointerCapture(event.pointerId);
      updateCursor();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const studio = useStudio.getState();
      const zoom = resolveAt(studio.playhead)["camera.zoom"];
      const speed = event.ctrlKey ? PINCH_SPEED : WHEEL_SPEED;
      studio.setValue(
        "camera.zoom",
        zoom * Math.exp(-event.deltaY * wheelUnit(event.deltaMode) * speed),
      );
    };

    // Middle-click would otherwise start the browser's autoscroll.
    const onMouseDown = (event: MouseEvent) => {
      if (event.button === 1) event.preventDefault();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (useStudio.getState().pick) useStudio.getState().setPick(null);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", endDrag);
    canvas.addEventListener("pointercancel", endDrag);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);
    const unsubscribe = useStudio.subscribe((state, previous) => {
      if (state.pick !== previous.pick || state.tool !== previous.tool)
        updateCursor();
    });
    updateCursor();

    return () => {
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", endDrag);
      canvas.removeEventListener("pointercancel", endDrag);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      unsubscribe();
      canvas.style.cursor = "";
    };
  }, [gl, get, runtime]);

  return null;
}
