/**
 * Environment photos that can stand behind the device and light it. The built-in ones are Poly Haven's, which are
 * CC0, at 1k: enough for lighting and a soft backdrop. Add your own from the Background panel, or make one permanent
 * by putting its .hdr or .exr file in public/hdri and adding an entry here.
 */

export type HdriFormat = "hdr" | "exr";

export type HdriGroup = "Outdoors" | "Studio";

export interface Hdri {
  id: string;
  name: string;
  /** Path under /public, or an object URL for an uploaded file. */
  url: string;
  format: HdriFormat;
  group?: HdriGroup;
}

/** How an environment is used: shown behind the device, used to light it, or both. */
export type HdriUse = "both" | "backdrop" | "lighting";

const builtIn = (id: string, name: string, group: HdriGroup): Hdri => ({
  id,
  name,
  url: `/media/lab/mockup/hdri/${id}.hdr`,
  format: "hdr",
  group,
});

export const HDRIS: Hdri[] = [
  builtIn("kloofendal-48d-partly-cloudy-puresky", "Open sky", "Outdoors"),
  builtIn("autumn-field-puresky", "Autumn field", "Outdoors"),
  builtIn("urban-alley-01", "City alley", "Outdoors"),
  builtIn("venice-sunset", "Sunset waterfront", "Outdoors"),
  builtIn("rooftop-night", "Rooftop at night", "Outdoors"),
  builtIn("studio-small-09", "Small studio", "Studio"),
  builtIn("photo-studio-01", "Photo studio", "Studio"),
  builtIn("brown-photostudio-02", "Warm studio", "Studio"),
  builtIn("blue-photo-studio", "Blue studio", "Studio"),
];

export const HDRI_GROUPS: HdriGroup[] = ["Outdoors", "Studio"];

export function getHdri(id: string | null): Hdri | null {
  return HDRIS.find((hdri) => hdri.id === id) ?? null;
}

/** The format of an environment file, from its name. Null when it is neither .hdr nor .exr. */
export function hdriFormat(filename: string): HdriFormat | null {
  if (/\.hdr$/i.test(filename)) return "hdr";
  if (/\.exr$/i.test(filename)) return "exr";
  return null;
}
