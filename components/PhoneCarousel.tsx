"use client";

/**
 * PhoneCarousel — the TMYR 7-phone hero (3 visible, cycling, hover→flat).
 *
 * This is now a thin adapter over the generalised engine in
 * `components/phone/PhoneScene.tsx`. Its public API and rendered output are
 * unchanged (hard rule #1): the videos map to `media`, `fit="stretch"` keeps the
 * original base UV transform on the screen mesh, hover drives the preset blend,
 * and the canvas still mounts via the staggered `useAppReady` queue. With 7
 * videos, `PhoneScene` resamples its slot tables to the original points exactly,
 * so this renders identically to the pre-refactor component.
 */

import dynamic from "next/dynamic";
import Loader from "./Loader";
import PhoneScene from "./phone/PhoneScene";
import type { PhoneMediaItem } from "./phone/phone-config";

type Props = {
  /** Path under /public, e.g. /models/iphone/iphone-15-pro-max.glb */
  model: string;
  /** Array of video URLs (webm preferred). */
  videos: string[];
  /** Optional poster shown until ready. */
  poster?: string;
  /** Override aspect ratio (ignored when fill is true). */
  aspectRatio?: string;
  /** Fill parent container height instead of using aspect ratio. */
  fill?: boolean;
  className?: string;
  /** Disable hover animation (e.g. parent already handles cursor). */
  hoverable?: boolean;
};

function PhoneCarouselInner({
  model,
  videos,
  poster,
  aspectRatio = "16/9",
  fill = false,
  className,
  hoverable = true,
}: Props) {
  const media: PhoneMediaItem[] = videos.map((src) => ({ kind: "video", src }));

  return (
    <PhoneScene
      model={model}
      media={media}
      fit="stretch"
      background="transparent"
      poster={poster}
      aspectRatio={aspectRatio}
      fill={fill}
      className={className}
      hoverable={hoverable}
    />
  );
}

// SSR-safe wrapper: r3f + WebGL only work in the browser.
const PhoneCarousel = dynamic(() => Promise.resolve(PhoneCarouselInner), {
  ssr: false,
  loading: () => (
    <div style={{ position: "relative", width: "100%", height: "100%", background: "transparent" }}>
      <Loader bare />
    </div>
  ),
});

export default PhoneCarousel;
