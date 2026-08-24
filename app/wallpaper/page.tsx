import type { Metadata, Viewport } from "next";
import WallpaperClient from "./WallpaperClient";

/**
 * /wallpaper — the Earth, live, as a web page.
 *
 * Made to be pointed at by Plash (macOS website-as-wallpaper) or any pinned
 * fullscreen browser: Himawari-9's real full-disk photograph, Australia in
 * frame, refreshed every 10 minutes as the satellite publishes. Unlisted and
 * noindexed; framing tunable via ?scale / ?ox / ?oy (see WallpaperClient).
 */

export const metadata: Metadata = {
  title: { absolute: "Earth, live" },
  description:
    "Live Himawari-9 full-disk satellite photograph of Earth, centred on Australia, updating every 10 minutes.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function WallpaperPage() {
  return <WallpaperClient />;
}
