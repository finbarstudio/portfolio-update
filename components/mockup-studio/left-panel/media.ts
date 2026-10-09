import { revokeIfBlob } from "@/components/mockup-studio/ui/object-url";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Media } from "@/lib/mockup-studio/scene/types";

const IMAGE_EXT = /\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i;
const VIDEO_EXT = /\.(mp4|m4v|mov|webm|ogv)$/i;

function kindOf(file: File): Media["kind"] | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  // Some platforms hand over files with an empty MIME type.
  if (IMAGE_EXT.test(file.name)) return "image";
  if (VIDEO_EXT.test(file.name)) return "video";
  return null;
}

/** Record a video's length on the media once its metadata is in, unless the media has changed meanwhile. */
function readVideoDuration(url: string | undefined): void {
  if (!url) return;
  const probe = document.createElement("video");
  probe.preload = "metadata";
  probe.onloadedmetadata = () => {
    const { media, updateMedia } = useStudio.getState();
    if (media?.url === url && Number.isFinite(probe.duration))
      updateMedia({ duration: Math.round(probe.duration * 1000) });
    probe.removeAttribute("src");
    probe.load();
  };
  probe.src = url;
}

/**
 * Use a chosen or dropped file as the screen media, releasing the previous
 * object URL. Returns an error message, or null on success.
 */
export function setMediaFromFile(file: File): string | null {
  const kind = kindOf(file);
  if (!kind) return `${file.name} is not an image or video.`;

  const { media, setMedia } = useStudio.getState();
  if (media) revokeIfBlob(media.url);
  setMedia({
    url: URL.createObjectURL(file),
    kind,
    name: file.name,
    fit: "cover",
    scale: 1,
    offsetX: 0,
    offsetY: 0,
  });
  if (kind === "video") readVideoDuration(useStudio.getState().media?.url);
  return null;
}

/** Remove the screen media and release its object URL. */
export function clearMedia(): void {
  const { media, setMedia } = useStudio.getState();
  if (media) revokeIfBlob(media.url);
  setMedia(null);
}
