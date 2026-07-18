import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { projectId, dataset } from "./env";

// Builder needs a projectId; when unconfigured we return null and callers skip.
const builder = projectId ? imageUrlBuilder({ projectId, dataset }) : null;

export function urlForImage(source: SanityImageSource | undefined | null) {
  if (!builder || !source) return null;
  return builder.image(source).auto("format").fit("max");
}
