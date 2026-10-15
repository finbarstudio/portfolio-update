/**
 * A band of colour across the top of the screen, like the one a phone's browser paints behind the status bar and the
 * Dynamic Island. A page recorded at the phone's full size has no such band; on a real phone the page starts below
 * it. With the band on, the media fits into the area under it, so the recording sits where it would on the phone.
 */

export interface StatusBar {
  on: boolean;
  /** Percent of the screen's height. */
  height: number;
  /** Take the colour from the top edge of the media, as Safari does for a page that sets no theme colour. */
  auto: boolean;
  /** Hex colour, used when `auto` is off. */
  color: string;
}

/** The iPhone 17 Pro's top safe area: 62 points, 186 of its 2622 pixels. */
export const DEFAULT_STATUS_BAR: StatusBar = {
  on: false,
  height: (186 / 2622) * 100,
  auto: true,
  color: "#ffffff",
};

/** Tallest band on offer, percent of the screen's height. */
export const MAX_STATUS_BAR = 25;

/** The share of the screen's height the band takes, 0 when it is off. */
export function statusBarFraction(bar: StatusBar): number {
  return bar.on ? Math.min(MAX_STATUS_BAR, Math.max(0, bar.height)) / 100 : 0;
}
