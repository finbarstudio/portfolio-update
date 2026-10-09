"use client";

import { type KeyboardEvent, type PointerEvent, useRef } from "react";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Light } from "@/lib/mockup-studio/scene/types";

const SIZE = 148;
const CENTER = SIZE / 2;
/** Radius of the horizon ring, where a light sits level with the device. */
const RADIUS = 62;
const KEY_STEP = 5;

/**
 * Where a light sits on the pad. The pad is the lighting rig seen from above: the device is in the middle, the camera
 * is at the bottom, and a light moves towards the middle as it climbs overhead.
 */
function toPad(light: Light): { x: number; y: number } {
  const distance = RADIUS * (1 - Math.max(0, light.elevation) / 90);
  const azimuth = (light.azimuth * Math.PI) / 180;
  return {
    x: CENTER + Math.sin(azimuth) * distance,
    y: CENTER + Math.cos(azimuth) * distance,
  };
}

function fromPad(x: number, y: number): Pick<Light, "azimuth" | "elevation"> {
  const dx = x - CENTER;
  const dy = y - CENTER;
  const distance = Math.min(Math.hypot(dx, dy), RADIUS);
  return {
    azimuth: Math.round((Math.atan2(dx, dy) * 180) / Math.PI),
    elevation: Math.round((1 - distance / RADIUS) * 90),
  };
}

/** A top-down map of the lights around the device. Drag a light to move it. */
export function LightPad() {
  const lights = useStudio((s) => s.lights);
  const selectedLightId = useStudio((s) => s.selectedLightId);
  const selectLight = useStudio((s) => s.selectLight);
  const updateLight = useStudio((s) => s.updateLight);
  const padRef = useRef<SVGSVGElement>(null);

  const move = (event: PointerEvent<SVGCircleElement>, light: Light) => {
    const pad = padRef.current;
    if (!pad || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
    const box = pad.getBoundingClientRect();
    updateLight(
      light.id,
      fromPad(
        ((event.clientX - box.left) / box.width) * SIZE,
        ((event.clientY - box.top) / box.height) * SIZE,
      ),
    );
  };

  const nudge = (event: KeyboardEvent<SVGCircleElement>, light: Light) => {
    const turn =
      event.key === "ArrowRight"
        ? KEY_STEP
        : event.key === "ArrowLeft"
          ? -KEY_STEP
          : 0;
    const lift =
      event.key === "ArrowUp"
        ? KEY_STEP
        : event.key === "ArrowDown"
          ? -KEY_STEP
          : 0;
    if (!turn && !lift) return;
    event.preventDefault();
    updateLight(light.id, {
      azimuth: ((light.azimuth + turn + 540) % 360) - 180,
      elevation: Math.min(90, Math.max(0, light.elevation + lift)),
    });
  };

  return (
    <div className="flex flex-col items-center gap-1 py-1">
      <svg
        ref={padRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        width={SIZE}
        height={SIZE}
        className="touch-none select-none"
        aria-label="Light positions seen from above"
      >
        {[1, 2 / 3, 1 / 3].map((ring) => (
          <circle
            key={ring}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS * ring}
            fill="none"
            className="stroke-ms-line"
          />
        ))}
        <line
          x1={CENTER}
          y1={CENTER - RADIUS}
          x2={CENTER}
          y2={CENTER + RADIUS}
          className="stroke-ms-line"
        />
        <line
          x1={CENTER - RADIUS}
          y1={CENTER}
          x2={CENTER + RADIUS}
          y2={CENTER}
          className="stroke-ms-line"
        />
        {/* The device, with its screen side towards the camera at the bottom. */}
        <rect
          x={CENTER - 9}
          y={CENTER - 3}
          width={18}
          height={6}
          rx={2}
          className="fill-ms-ink-faint"
        />
        {lights.map((light) => {
          const { x, y } = toPad(light);
          const selected = light.id === selectedLightId;
          return (
            <circle
              key={light.id}
              cx={x}
              cy={y}
              r={selected ? 7 : 6}
              fill={light.color}
              className={
                selected
                  ? "cursor-grab stroke-ms-ink stroke-2"
                  : "cursor-grab stroke-ms-ink-faint"
              }
              role="slider"
              tabIndex={0}
              aria-label={`${light.name} light position`}
              aria-valuemin={-180}
              aria-valuemax={180}
              aria-valuenow={light.azimuth}
              aria-valuetext={`${light.azimuth} degrees round, ${light.elevation} degrees up`}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                selectLight(light.id);
              }}
              onPointerMove={(event) => move(event, light)}
              onKeyDown={(event) => nudge(event, light)}
              onFocus={() => selectLight(light.id)}
            />
          );
        })}
      </svg>
      <p className="text-[11px] text-ms-ink-faint">
        Seen from above. Camera at the bottom, centre is overhead.
      </p>
    </div>
  );
}
