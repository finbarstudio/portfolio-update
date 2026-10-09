/**
 * Device registry. To add a device: drop its GLB in
 * public/models/<id>/model.glb and add an entry here.
 */

/** A hinged lid, driven by the `object.lid` param. Coordinates are in the GLB's own space. */
export interface DeviceLid {
  /** A point on the hinge line, which runs along X. */
  hinge: [number, number, number];
  /** Degrees the open lid turns about the hinge to shut. */
  closedAngle: number;
  /** Meshes reaching above this height belong to the lid. Ignored when `parts` is set. */
  above: number;
  /** Pick the lid's meshes by mesh or material name instead of by height, for a model built shut. */
  parts?: RegExp;
  /** Set when the model is built with the lid shut; it then opens by `closedAngle`. */
  builtShut?: boolean;
}

export const DEVICE_CATEGORIES = [
  "Phones and tablets",
  "Computers and displays",
  "Wearables",
  "Retro",
  "Signage",
] as const;

export type DeviceCategory = (typeof DEVICE_CATEGORIES)[number];

export interface DeviceColor {
  name: string;
  hex: string | null;
}

export interface ScreenPlane {
  center: [number, number, number];
  width: number;
  height: number;
  /** Corner radius, same units. */
  radius: number;
  /** Degrees, for a display that does not sit square to the model's axes. */
  rotation?: [number, number, number];
}

export interface DeviceDef {
  id: string;
  name: string;
  /** Path under /public. */
  url: string;
  /** Folder the device is listed under. */
  category: DeviceCategory;
  /**
   * The mesh that shows the screen content, by exact name, or a pattern
   * matched against mesh and material names (every match becomes a screen,
   * for objects with several faces). Leave undefined to auto-detect the
   * first mesh whose name matches /screen|display/i.
   */
  screenMesh?: string | RegExp;
  /** The real panel's pixel size, when there is one, shown as the size to make media at. */
  screenPixels?: [number, number];
  /** Keep only meshes whose centre lies in this X range of the GLB's own space, to pick one object out of a row. */
  withinX?: [number, number];
  /**
   * For models whose screen is baked into the body texture: a rounded
   * rectangle generated over the display and used as the screen instead of a
   * mesh. Coordinates are in the GLB's own space, facing +Z.
   */
  screenPlane?: ScreenPlane;
  /**
   * Which materials the body colour picker tints, matched against material
   * names. Leave undefined to tint every opaque, non-black, non-glowing
   * material.
   */
  bodyMaterials?: RegExp;
  /**
   * Finishes the product is sold in. `hex` is an on-screen approximation
   * (Apple does not publish colour values); null means the model's own
   * materials, which is the finish it was built in.
   */
  colors: DeviceColor[];
  lid?: DeviceLid;
  /** Keep only the meshes whose own name or material name matches, for showing one part of a multi-object model. */
  only?: RegExp;
  /** Remove the meshes whose own name or material name matches. */
  hide?: RegExp;
  /**
   * For models whose shading maps (metal, roughness, occlusion, normal) do
   * not line up with their colour map and paint blocks of wrong shade: keep
   * only the colour map and use this roughness everywhere.
   */
  matte?: number;
  /** Screen width / height, used to fit media. */
  screenAspect: number;
  /** Extra rotation in degrees if the model does not face +Z out of the box. */
  rotation?: [number, number, number];
  /** Set when the GLB's screen UVs are vertically flipped. */
  flipScreenV?: boolean;
}

export const DEVICES: DeviceDef[] = [
  {
    id: "iphone-17-pro",
    category: "Phones and tablets",
    screenPixels: [1206, 2622],
    name: "iPhone 17 Pro",
    url: "/media/lab/mockup/models/phones/iphone-17-pro/model.glb",
    screenMesh: /^ChangeThis$/,
    bodyMaterials:
      /^(Base_frame|Back_panel|Logo|USB_frame|Button|Button_frame|Edges|Antena_5G)$/,
    colors: [
      { name: "Burgundy", hex: null },
      { name: "Black", hex: "#2a2a2c" },
      { name: "Silver", hex: "#e3e4e5" },
      { name: "Glacier", hex: "#c5d6e2" },
    ],
    screenAspect: 1206 / 2622,
  },
  {
    id: "macbook-pro-16",
    category: "Computers and displays",
    screenPixels: [3456, 2234],
    name: "MacBook Pro 16",
    url: "/media/lab/mockup/models/computers/macbook-pro-16/model.glb",
    screenMesh: "Object_123",
    lid: { hinge: [0, 0.1, -12.3], closedAngle: 109, above: 2 },
    colors: [
      { name: "Silver", hex: null },
      { name: "Space Black", hex: "#3a3a3d" },
    ],
    screenAspect: 3456 / 2234,
  },
  {
    id: "ipad-mini-6",
    category: "Phones and tablets",
    screenPixels: [1488, 2266],
    name: "iPad mini 6",
    url: "/media/lab/mockup/models/phones/ipad-mini-6/model.glb",
    bodyMaterials: /^BaseColor/,
    colors: [
      { name: "Original", hex: null },
      { name: "Space Gray", hex: "#6e6e73" },
      { name: "Pink", hex: "#f2cfca" },
      { name: "Purple", hex: "#b9b1e0" },
      { name: "Starlight", hex: "#efe6d6" },
    ],
    screenAspect: 1488 / 2266,
    // The model's screen faces -Z.
    rotation: [0, 180, 0],
  },
  {
    id: "ipad-pro-13",
    category: "Phones and tablets",
    screenPixels: [2064, 2752],
    name: "iPad Pro 13",
    url: "/media/lab/mockup/models/phones/ipad-pro-13/model.glb",
    screenMesh: /^Change This$/,
    colors: [{ name: "Space Black", hex: null }],
    screenAspect: 2064 / 2752,
  },
  {
    id: "macbook-pro-black",
    category: "Computers and displays",
    screenPixels: [3456, 2234],
    name: "MacBook Pro, Space Black",
    url: "/media/lab/mockup/models/computers/macbook-pro-black/model.glb",
    screenMesh: /^ChangeThis$/,
    // Built shut: the lid's parts are named, and it opens about the back edge.
    lid: {
      hinge: [0, 0.003, -0.117],
      closedAngle: 108,
      above: 0,
      parts: /^mesh_cap/,
      builtShut: true,
    },
    colors: [{ name: "Space Black", hex: null }],
    screenAspect: 3456 / 2234,
  },
  {
    id: "mac-pro",
    category: "Computers and displays",
    screenPixels: [6016, 3384],
    name: "Mac Pro + Display",
    url: "/media/lab/mockup/models/computers/mac-pro/model.glb",
    colors: [{ name: "Silver", hex: null }],
    matte: 0.55,
    // The display is baked into the monitor's texture and leans back slightly.
    screenPlane: {
      center: [0.0005, 0.3065, -0.1925],
      width: 0.559,
      height: 0.315,
      radius: 0.004,
      rotation: [-2.3, 0, 0],
    },
    screenAspect: 6016 / 3384,
  },
  {
    id: "pro-display",
    category: "Computers and displays",
    screenPixels: [5120, 2880],
    name: "Studio Display",
    url: "/media/lab/mockup/models/computers/studio-display/model.glb",
    screenMesh: /^ChangeThis$/,
    colors: [{ name: "Silver", hex: null }],
    screenAspect: 5120 / 2880,
  },
  {
    id: "apple-watch",
    category: "Wearables",
    screenPixels: [410, 502],
    name: "Apple Watch",
    url: "/media/lab/mockup/models/wearables/apple-watch/model.glb",
    colors: [
      { name: "Natural Titanium", hex: null },
      { name: "Black Titanium", hex: "#4a4a4d" },
    ],
    // The model is posed leaning back by this much; stand it upright.
    rotation: [10.4, 0, 0],
    screenPlane: {
      center: [-0.0615, 0.0455, 0.0332],
      width: 0.0352,
      height: 0.0432,
      radius: 0.0095,
      rotation: [-10.4, 0, 0],
    },
    screenAspect: 410 / 502,
  },
  {
    id: "sign-1",
    category: "Signage",
    name: "Poster Frame",
    url: "/media/lab/mockup/models/signage/advertising-signs/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    withinX: [-0.5, 1.7],
    screenMesh: /^your_design/,
    screenAspect: 1.17 / 1.64,
  },
  {
    id: "sign-2",
    category: "Signage",
    name: "Lightbox, Wall",
    url: "/media/lab/mockup/models/signage/advertising-signs/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    withinX: [1.9, 4.2],
    screenMesh: /^your_design/,
    screenAspect: 1.17 / 1.64,
  },
  {
    id: "sign-3",
    category: "Signage",
    name: "Lightbox, Freestanding",
    url: "/media/lab/mockup/models/signage/advertising-signs/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    withinX: [4.8, 6.9],
    screenMesh: /^your_design/,
    screenAspect: 1.17 / 1.64,
  },
  {
    id: "sign-4",
    category: "Signage",
    name: "Lightbox, Street",
    url: "/media/lab/mockup/models/signage/advertising-signs/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    withinX: [7.4, 9.9],
    screenMesh: /^your_design/,
    screenAspect: 1.17 / 1.64,
  },
  {
    id: "three-sided-sign",
    category: "Signage",
    name: "Three-Sided Billboard",
    url: "/media/lab/mockup/models/signage/three-sided-sign/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    // The three flat panels; the same media shows on each.
    screenMesh: /^material(_\d)?$/,
    rotation: [0, 180, 0],
    screenAspect: 1000 / 4500,
  },
  {
    id: "billboard",
    category: "Signage",
    name: "Poster Stand",
    url: "/media/lab/mockup/models/signage/billboard/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    // The poster is baked into the texture, so the screen is generated over it.
    screenPlane: {
      center: [0, 1.379, 0.2],
      width: 1.025,
      height: 1.568,
      radius: 0,
    },
    screenAspect: 1.025 / 1.568,
  },
  {
    id: "metal-billboard",
    category: "Signage",
    name: "Highway Billboard",
    url: "/media/lab/mockup/models/signage/metal-billboard/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    // The face looks along +X and is baked into the texture, so the screen is generated over it. The model's own
    // lamp-glow cards would sit in front of it, so they go.
    rotation: [0, -90, 0],
    hide: /^Object_17$/,
    screenPlane: {
      center: [0.6, 9.45, 0],
      width: 10.8,
      height: 4.4,
      radius: 0,
      rotation: [0, 90, 0],
    },
    screenAspect: 10.8 / 4.4,
  },
  {
    id: "v-billboard",
    category: "Signage",
    name: "Two-Sided Billboard",
    url: "/media/lab/mockup/models/signage/v-billboard/model.glb",
    colors: [
      { name: "Original", hex: null },
      { name: "Black", hex: "#1c1c1e" },
      { name: "White", hex: "#f1f1f1" },
      { name: "Red", hex: "#b91c1c" },
      { name: "Blue", hex: "#1e40af" },
    ],
    // Both faces, back to back; the same media shows on each. The model stands at 45 degrees.
    screenMesh: /ads4/,
    rotation: [0, -45, 0],
    screenAspect: 26.98 / 10.43,
  },
  {
    id: "framed-poster",
    category: "Signage",
    name: "Framed Poster",
    // Built for this studio: a frame, a mat board and the poster face. Only the frame takes a colour.
    url: "/media/lab/mockup/models/signage/framed-poster/model.glb",
    screenMesh: "poster_screen",
    bodyMaterials: /^frame$/,
    colors: [
      { name: "Black", hex: null },
      { name: "White", hex: "#f1f1f1" },
      { name: "Oak", hex: "#b08a5a" },
      { name: "Walnut", hex: "#5a3d2b" },
    ],
    screenPixels: [5000, 7000],
    screenAspect: 5 / 7,
  },
];

export const DEFAULT_DEVICE_ID = DEVICES[0].id;

export function getDevice(id: string): DeviceDef {
  return DEVICES.find((device) => device.id === id) ?? DEVICES[0];
}
