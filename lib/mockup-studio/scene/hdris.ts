/**
 * Environment photos that can stand behind the device and light it. The
 * built-in list is empty: add your own from the Background panel, or make one
 * permanent by putting its .hdr or .exr file in public/hdri and adding an
 * entry here.
 */

export type HdriFormat = "hdr" | "exr";

export interface Hdri {
  id: string;
  name: string;
  /** Path under /public, or an object URL for an uploaded file. */
  url: string;
  format: HdriFormat;
}

export const HDRIS: Hdri[] = [];

export function getHdri(id: string | null): Hdri | null {
  return HDRIS.find((hdri) => hdri.id === id) ?? null;
}

/** The format of an environment file, from its name. Null when it is neither .hdr nor .exr. */
export function hdriFormat(filename: string): HdriFormat | null {
  if (/\.hdr$/i.test(filename)) return "hdr";
  if (/\.exr$/i.test(filename)) return "exr";
  return null;
}
