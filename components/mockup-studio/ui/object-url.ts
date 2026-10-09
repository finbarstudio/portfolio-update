/** Release an object URL we created. Remote URLs are left alone. */
export function revokeIfBlob(url: string): void {
  if (url.startsWith("blob:")) URL.revokeObjectURL(url);
}
