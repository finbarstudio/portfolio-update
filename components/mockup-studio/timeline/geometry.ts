/**
 * Time/pixel maths shared by the ruler, shots row and keyframe rows. Every lane
 * draws the same time span edge to edge, so positions are percentages of the
 * span and only pointer handling needs a measured width.
 */

export const FRAME_MS = 1000 / 30;

/** Tailwind classes for the label column and the padded lane next to it. Keep in sync: the playhead overlay uses both. */
export const GUTTER = "w-36 shrink-0";
export const GUTTER_OFFSET = "left-36";
export const LANE_PADDING = "px-2";

export function snapToFrame(ms: number): number {
  return Math.round(Math.round(ms / FRAME_MS) * FRAME_MS);
}

/**
 * Time the lanes cover: the whole timeline plus some empty room on the right so
 * the last shot can be dragged longer.
 */
export function spanFor(total: number): number {
  return total + Math.max(total * 0.35, 1000);
}

export function percent(ms: number, span: number): string {
  return `${(ms / span) * 100}%`;
}

/** Global time under a pointer for a lane that shows `span` ms across its full width. */
export function pointerToMs(
  clientX: number,
  lane: HTMLElement,
  span: number,
): number {
  const rect = lane.getBoundingClientRect();
  if (rect.width === 0) return 0;
  return ((clientX - rect.left) / rect.width) * span;
}

const TICK_STEPS = [
  50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 15000, 30000, 60000,
  120000, 300000,
];
const MIN_TICK_GAP_PX = 64;

/** Smallest round interval that keeps labelled ticks at least ~64px apart. */
export function tickStep(span: number, laneWidth: number): number {
  const width = laneWidth > 0 ? laneWidth : 600;
  return (
    TICK_STEPS.find((step) => (step / span) * width >= MIN_TICK_GAP_PX) ??
    TICK_STEPS[TICK_STEPS.length - 1]
  );
}

export function formatTick(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${Number((ms / 1000).toFixed(2))}s`;
}

export function formatSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(2)}s`;
}

export function formatValue(value: number, unit?: string): string {
  return `${Number(value.toFixed(1))}${unit ?? ""}`;
}
