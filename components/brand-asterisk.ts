/**
 * The brand asterisk as a traceable polygon — an eight-spoked star burst in a
 * 0–100 viewBox (≈ the U+1F7BE mark). Used by the preloader, which strokes its
 * outline, then fills it. Outer points on the 8 compass axes, inner notches
 * between, so it reads as a chunky asterisk.
 */
export const ASTERISK_POINTS = [
  "50.00,3.00", "56.89,33.37", "83.23,16.77", "66.63,43.11",
  "97.00,50.00", "66.63,56.89", "83.23,83.23", "56.89,66.63",
  "50.00,97.00", "43.11,66.63", "16.77,83.23", "33.37,56.89",
  "3.00,50.00", "33.37,43.11", "16.77,16.77", "43.11,33.37",
].join(" ");
