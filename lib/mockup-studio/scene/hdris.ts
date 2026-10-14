/**
 * Environment photos that can stand behind the device and light it. The built-in ones are Poly Haven's, which are
 * CC0, at 1k: enough for lighting and a soft backdrop. Add your own from the Background panel, or make one permanent
 * by putting its .hdr or .exr file in public/hdri and adding an entry here.
 */

export type HdriFormat = "hdr" | "exr";

export type HdriGroup =
  | "Studio"
  | "Indoors"
  | "City"
  | "Outdoors"
  | "Sunset"
  | "Night";

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
  builtIn("urban-alley-01", "City alley", "City"),
  builtIn("venice-sunset", "Sunset waterfront", "Sunset"),
  builtIn("rooftop-night", "Rooftop at night", "Night"),
  builtIn("studio-small-09", "Small studio", "Studio"),
  builtIn("photo-studio-01", "Photo studio", "Studio"),
  builtIn("brown-photostudio-02", "Warm studio", "Studio"),
  builtIn("blue-photo-studio", "Blue studio", "Studio"),
  builtIn("studio-small-08", "Studio Small 08", "Studio"),
  builtIn("studio-small-03", "Studio Small 03", "Studio"),
  builtIn("studio-small-02", "Studio Small 02", "Studio"),
  builtIn("photo-studio-loft-hall", "Photo Studio Loft Hall", "Studio"),
  builtIn("studio-country-hall", "Studio Country Hall", "Studio"),
  builtIn("brown-photostudio-01", "Brown Photostudio 01", "Studio"),
  builtIn("fireplace", "Fireplace", "Indoors"),
  builtIn("cayley-interior", "Cayley Interior", "Indoors"),
  builtIn("lebombo", "Lebombo", "Indoors"),
  builtIn("empty-warehouse-01", "Empty Warehouse 01", "Indoors"),
  builtIn("artist-workshop", "Artist Workshop", "Indoors"),
  builtIn("abandoned-parking", "Abandoned Parking", "Indoors"),
  builtIn("canary-wharf", "Canary Wharf", "City"),
  builtIn("wide-street-01", "Wide Street 01", "City"),
  builtIn("wide-street-02", "Wide Street 02", "City"),
  builtIn("shanghai-bund", "Shanghai Bund", "City"),
  builtIn("preller-drive", "Preller Drive", "City"),
  builtIn("buikslotermeerplein", "Buikslotermeerplein", "City"),
  builtIn("hansaplatz", "Hansaplatz", "City"),
  builtIn("potsdamer-platz", "Potsdamer Platz", "City"),
  builtIn("lilienstein", "Lilienstein", "Outdoors"),
  builtIn("kloppenheim-06-puresky", "Kloppenheim 06, open sky", "Outdoors"),
  builtIn("meadow-2", "Meadow 2", "Outdoors"),
  builtIn("noon-grass", "Noon Grass", "Outdoors"),
  builtIn(
    "citrus-orchard-road-puresky",
    "Citrus Orchard Road, open sky",
    "Outdoors",
  ),
  builtIn("je-gray-02", "J&E Gray 02", "Outdoors"),
  builtIn("spruit-sunrise", "Spruit Sunrise", "Outdoors"),
  builtIn("the-sky-is-on-fire", "The Sky Is On Fire", "Sunset"),
  builtIn("belfast-sunset-puresky", "Belfast Sunset, open sky", "Sunset"),
  builtIn("kiara-1-dawn", "Kiara 1 Dawn", "Sunset"),
  builtIn("industrial-sunset-puresky", "Industrial Sunset, open sky", "Sunset"),
  builtIn("sunset-jhbcentral", "Joburg Central Sunset", "Sunset"),
  builtIn("umhlanga-sunrise", "Umhlanga Sunrise", "Sunset"),
  builtIn("moonless-golf", "Moonless Golf", "Night"),
  builtIn("satara-night", "Satara Night", "Night"),
  builtIn("dikhololo-night", "Dikhololo Night", "Night"),
  builtIn("rogland-clear-night", "Rogland Clear Night", "Night"),
  builtIn("moonlit-golf", "Moonlit Golf", "Night"),
];

export const HDRI_GROUPS: HdriGroup[] = [
  "Studio",
  "Indoors",
  "City",
  "Outdoors",
  "Sunset",
  "Night",
];

export function getHdri(id: string | null): Hdri | null {
  return HDRIS.find((hdri) => hdri.id === id) ?? null;
}

/** The format of an environment file, from its name. Null when it is neither .hdr nor .exr. */
export function hdriFormat(filename: string): HdriFormat | null {
  if (/\.hdr$/i.test(filename)) return "hdr";
  if (/\.exr$/i.test(filename)) return "exr";
  return null;
}
