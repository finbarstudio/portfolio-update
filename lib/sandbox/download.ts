/**
 * download — trigger a client-side file download from a Blob / data URL.
 * Used by the export pipeline (PNG, video, GIF) to hand the user their file.
 */

/** Download a Blob as `filename`. Revokes the temporary object URL after. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  // Defer revoke a tick so the navigation/download has the URL.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Download a data URL (e.g. canvas.toDataURL) as `filename`. */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  triggerDownload(dataUrl, filename);
}

function triggerDownload(href: string, filename: string): void {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/** A filesystem-safe slug for export filenames. */
export function safeName(base: string): string {
  return (
    base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 48) || "phone-mockup"
  );
}
