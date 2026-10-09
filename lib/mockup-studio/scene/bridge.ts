/**
 * Handle the viewport registers so non-React code (export, thumbnails) can
 * drive the renderer deterministically. The viewport calls `setRenderer`
 * on mount and `setRenderer(null)` on unmount.
 */

export interface RendererBridge {
  /** The WebGL canvas, sized to the composition while exporting. */
  canvas: HTMLCanvasElement;
  /**
   * Resize the drawing buffer to exact output pixels and stop the live
   * render loop. Call `endExport` when finished.
   */
  beginExport(width: number, height: number): Promise<void>;
  /**
   * Render the scene as it looks at global time `ms` (including seeking
   * any screen video to the matching frame) and resolve once the canvas
   * holds that frame.
   */
  renderAt(ms: number): Promise<void>;
  /** Restore the live size and render loop. */
  endExport(): void;
}

let current: RendererBridge | null = null;

export function setRenderer(bridge: RendererBridge | null): void {
  current = bridge;
}

export function getRenderer(): RendererBridge {
  if (!current) throw new Error("The viewport is not ready yet");
  return current;
}
