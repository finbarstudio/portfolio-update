/** Hand a blob to the browser as a file download, then release the object URL. */
export function download(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  // Firefox ignores clicks on anchors that are not in the document.
  document.body.append(link);
  link.click();
  link.remove();
  // The download has started by the next task; the delay is slack for Safari.
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

/** Local-time stamp for file names, e.g. 2026-10-09T14-03-22. */
export function fileStamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  return `${date}T${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
}
