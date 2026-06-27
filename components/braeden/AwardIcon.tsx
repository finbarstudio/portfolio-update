import type { ReactNode } from "react";

/**
 * AwardIcon — tiny monoline marks for the hero award row, drawn to sit beside
 * Braeden's thin-stroke logo. One per credential: a pennant for the founding
 * year, then a trophy / rosette / house for the awards. Stroke = currentColor,
 * so the row tints them in the brand red. Kept simple so they stay crisp at ~15px.
 */
export type AwardIconName = "flag" | "trophy" | "rosette" | "house";

const PATHS: Record<AwardIconName, ReactNode> = {
  flag: (
    <>
      <path d="M6 21V3" />
      <path d="M6 4h11l-2.6 3.5L17 11H6" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
      <path d="M7 5.5H4.5V7a3 3 0 0 0 3 3" />
      <path d="M17 5.5h2.5V7a3 3 0 0 1-3 3" />
      <path d="M12 13v3" />
      <path d="M9 19.5h6" />
    </>
  ),
  rosette: (
    <>
      <circle cx="12" cy="9" r="4.5" />
      <path d="M9.2 12.8 7.5 20l4.5-2.6L16.5 20l-1.7-7.2" />
    </>
  ),
  house: (
    <>
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6 10.5V19h12v-8.5" />
    </>
  ),
};

export default function AwardIcon({ name }: { name: AwardIconName }) {
  return (
    <svg
      className="brd-award-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
