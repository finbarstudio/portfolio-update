/**
 * Who made each 3D model, taken from the credit the file itself carries
 * (Sketchfab writes author, title, licence and source page into every model
 * it serves). Keyed by the model's path, since several devices can share one
 * file. A model with no entry carries no credit in its file: find its source
 * and add it here rather than guessing.
 */

export interface ModelCredit {
  title: string;
  author: string;
  /** The licence's short name, as shown to the user. */
  license: string;
  /** The model's own page. */
  source: string;
}

const CREDITS: Record<string, ModelCredit> = {
  "/media/lab/mockup/models/computers/mac-pro/model.glb": {
    title: "Apple MacPro (low poly)",
    author: "Andrey 3D",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/apple-macpro-low-poly-fee210eb736347889a79b37d16703897",
  },
  "/media/lab/mockup/models/computers/macbook-pro-16/model.glb": {
    title: "macbook pro M3 16 inch 2024",
    author: "jackbaeten",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/macbook-pro-m3-16-inch-2024-8e34fc2b303144f78490007d91ff57c4",
  },
  "/media/lab/mockup/models/phones/ipad-mini-6/model.glb": {
    title: "IPad Mini 6 2021",
    author: "DatSketch",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/ipad-mini-6-2021-f363c2b1c74a462588db184bd4fb024e",
  },
  "/media/lab/mockup/models/signage/advertising-signs/model.glb": {
    title: "Advertising signs",
    author: "quarrozethan",
    license: "Sketchfab Standard licence",
    source:
      "https://sketchfab.com/3d-models/advertising-signs-822b9cf884a74cb6b1c90b613d35fc5e",
  },
  "/media/lab/mockup/models/signage/billboard/model.glb": {
    title: "Billboard",
    author: "Larry3d",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/billboard-0ce071edcdce406fa5ecd06bb4abf0a3",
  },
  "/media/lab/mockup/models/signage/metal-billboard/model.glb": {
    title: "Metal_billboard_advertising_single_sided_free",
    author: "AuwaBRO",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/metal-billboard-advertising-single-sided-free-6e2848adc1e143678ce703aff4fab4a9",
  },
  "/media/lab/mockup/models/signage/v-billboard/model.glb": {
    title: "Advertising Billboard",
    author: "4mecharmi",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/advertising-billboard-aa863fb7517b465ca55f4ef397c1d4f6",
  },
  "/media/lab/mockup/models/signage/three-sided-sign/model.glb": {
    title: "Three-Sided Outdoor Advertising Structure",
    author: "Alina K",
    license: "CC BY 4.0",
    source:
      "https://sketchfab.com/3d-models/three-sided-outdoor-advertising-structure-83a15da1d4c1497080834f870b4e9a27",
  },
};

export function creditFor(modelUrl: string): ModelCredit | null {
  return CREDITS[modelUrl] ?? null;
}

/** One line: the model's title, who made it and its licence. */
export function creditLine(credit: ModelCredit): string {
  return `"${credit.title}" by ${credit.author}, ${credit.license}`;
}
