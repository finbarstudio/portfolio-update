/**
 * The catalog goes out in this many parts (api/app/catalog?part=0..N-1), split by position in id order. A Vercel
 * function response is capped at 4.5MB and the whole catalog is ~15MB, so each part stays well under the cap.
 */
export const CATALOG_PARTS = 8;
