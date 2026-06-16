/**
 * export-still — render a single composited frame to a PNG blob. The carousel is
 * seeked to centre the chosen media (or any offset), captured, and read off the
 * shared 2D canvas. Transparent backgrounds keep their alpha; solid backgrounds
 * are already baked in by the renderer's `draw`.
 */

export async function renderStillBlob(
  canvas: HTMLCanvasElement,
  draw: (offset: number, hover: number) => Promise<void>,
  offset: number,
  hover: number,
  type = "image/png",
  quality?: number,
): Promise<Blob | null> {
  await draw(offset, hover);
  return await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), type, quality);
  });
}
