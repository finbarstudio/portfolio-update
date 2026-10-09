import {
  Box3,
  BufferAttribute,
  BufferGeometry,
  type Color,
  Group,
  type Material,
  MathUtils,
  Mesh,
  type MeshPhysicalMaterial,
  MeshStandardMaterial,
  type Object3D,
  Raycaster,
  RectAreaLight,
  Vector3,
} from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import type { DeviceDef, ScreenPlane } from "@/lib/mockup-studio/scene/devices";
import type { ScreenBox } from "@/lib/mockup-studio/scene/framing";
import { createScreenSurface, type ScreenSurface } from "./screen-material";

export interface PreparedDevice {
  /** Normalised model: largest dimension 1 world unit, centred on the origin, screen facing +Z. */
  root: Group;
  /** Null when the model has no screen mesh. */
  screen: ScreenSurface | null;
  /** Geometries cloned for this instance. The cached glTF itself is never modified. */
  ownedGeometries: BufferGeometry[];
  ownedMaterials: Material[];
  /** Body materials the colour picker tints, cloned for this instance. */
  body: BodyMaterial[];
  /** Present when the device has a hinged lid. */
  lid: LidRig | null;
  /** Light given off by the screen, when there is one. */
  screenLight: RectAreaLight | null;
  /** Width, height and depth after normalising, in world units. */
  extents: Vector3;
  /** Where the screen sits in those units, measured from the device's centre. Null without a screen. */
  screenBox: ScreenBox | null;
}

// Area lights need their lookup textures registered once before any material uses them.
RectAreaLightUniformsLib.init();

/**
 * A light the size and shape of the screen, facing the way the screen faces, so the display lights whatever is in
 * front of it. It rides on the screen mesh, so it follows a laptop lid.
 */
function createScreenLight(screenMesh: Mesh, parent: Object3D): RectAreaLight {
  screenMesh.updateWorldMatrix(true, false);
  const position = screenMesh.geometry.getAttribute("position");
  const box = new Box3();
  const point = new Vector3();
  for (let i = 0; i < position.count; i++) {
    box.expandByPoint(
      point
        .fromBufferAttribute(position, i)
        .applyMatrix4(screenMesh.matrixWorld),
    );
  }
  const size = box.getSize(new Vector3());
  const center = box.getCenter(new Vector3());
  const normalAttribute = screenMesh.geometry.getAttribute("normal");
  const normal = normalAttribute
    ? new Vector3()
        .fromBufferAttribute(normalAttribute, 0)
        .transformDirection(screenMesh.matrixWorld)
    : new Vector3(0, 0, 1);

  // The screen runs across X; a tilted lid spreads its height over Y and Z.
  const light = new RectAreaLight(
    0xffffff,
    0,
    size.x,
    Math.hypot(size.y, size.z),
  );
  parent.add(light);
  light.position.copy(center).addScaledVector(normal, size.x * 0.002);
  light.lookAt(center.clone().add(normal));
  screenMesh.attach(light);
  return light;
}

export interface LidRig {
  pivot: Group;
  /** Radians the pivot turns to shut the lid. */
  closedAngle: number;
  /** The model was built with the lid shut, so the pivot turns the other way to open it. */
  builtShut: boolean;
}

function matches(mesh: Mesh, pattern: RegExp): boolean {
  const material = Array.isArray(mesh.material)
    ? mesh.material[0]
    : mesh.material;
  return pattern.test(mesh.name) || pattern.test(material?.name ?? "");
}

/**
 * Remove meshes: those matching `hide`, those not matching `only`, and those whose centre lies outside `withinX`
 * (measured in the model's own space, for picking one object out of a row).
 */
function filterMeshes(model: Object3D, def: DeviceDef): void {
  const { only, hide, withinX } = def;
  model.updateMatrixWorld(true);
  const box = new Box3();
  const center = new Vector3();
  const unwanted: Object3D[] = [];
  model.traverse((object) => {
    if (!isMesh(object)) return;
    const outside =
      withinX !== undefined &&
      (box.setFromObject(object).getCenter(center).x < withinX[0] ||
        center.x > withinX[1]);
    if (
      outside ||
      (only && !matches(object, only)) ||
      (hide && matches(object, hide))
    )
      unwanted.push(object);
  });
  for (const object of unwanted) object.removeFromParent();
}

/** Give every mesh a private material that keeps only the colour map: no metal, roughness, occlusion or normal maps. */
function makeMatte(model: Object3D, roughness: number): Material[] {
  const clones = new Map<Material, MeshStandardMaterial>();
  model.traverse((object) => {
    if (!isMesh(object)) return;
    const source = object.material;
    if (!(source instanceof MeshStandardMaterial)) return;
    let clone = clones.get(source);
    if (!clone) {
      clone = source.clone();
      clone.metalnessMap = null;
      clone.roughnessMap = null;
      clone.aoMap = null;
      clone.normalMap = null;
      clone.metalness = 0;
      clone.roughness = roughness;
      clones.set(source, clone);
    }
    object.material = clone;
  });
  return [...clones.values()];
}

/** Hang every mesh of the lid off a pivot on the hinge line, keeping it where it is. Runs in the model's own space. */
function rigLid(model: Object3D, def: DeviceDef): LidRig | null {
  if (!def.lid) return null;
  const { hinge, closedAngle, above, parts: named, builtShut } = def.lid;
  model.updateMatrixWorld(true);
  const box = new Box3();
  const parts: Mesh[] = [];
  model.traverse((object) => {
    if (!isMesh(object)) return;
    if (
      named ? matches(object, named) : box.setFromObject(object).max.y > above
    )
      parts.push(object);
  });
  const pivot = new Group();
  pivot.position.set(...hinge);
  model.add(pivot);
  pivot.updateMatrixWorld(true);
  for (const part of parts) pivot.attach(part);
  return {
    pivot,
    closedAngle: MathUtils.degToRad(closedAngle),
    builtShut: builtShut === true,
  };
}

/** `open` is 0..1: 1 is fully open, 0 is shut, whichever of the two the model was built in. */
export function setLid(rig: LidRig, open: number): void {
  rig.pivot.rotation.x = rig.builtShut
    ? -rig.closedAngle * open
    : rig.closedAngle * (1 - open);
}

interface BodyMaterial {
  material: MeshStandardMaterial;
  original: Color;
  /** Brightness relative to the brightest body part, so darker trim stays darker under a tint. */
  weight: number;
}

function luminance(color: Color): number {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b;
}

function isBodyMaterial(
  material: MeshStandardMaterial,
  def: DeviceDef,
): boolean {
  if (def.bodyMaterials) return def.bodyMaterials.test(material.name);
  const transmission = (material as MeshPhysicalMaterial).transmission ?? 0;
  if (material.transparent || material.opacity < 1 || transmission > 0)
    return false;
  if (material.emissiveMap || luminance(material.emissive) > 0.01) return false;
  return material.map !== null || luminance(material.color) > 0.08;
}

/** Swap every body material for a private clone so tinting never touches the cached glTF. */
function collectBody(
  model: Object3D,
  def: DeviceDef,
  screenMeshes: Mesh[],
): BodyMaterial[] {
  const clones = new Map<MeshStandardMaterial, MeshStandardMaterial>();
  model.traverse((object) => {
    if (!isMesh(object) || screenMeshes.includes(object)) return;
    const source = object.material;
    if (!(source instanceof MeshStandardMaterial)) return;
    if (!isBodyMaterial(source, def)) return;
    let clone = clones.get(source);
    if (!clone) {
      clone = source.clone();
      clones.set(source, clone);
    }
    object.material = clone;
  });
  const materials = [...clones.values()];
  const brightest = Math.max(
    ...materials.map((material) => luminance(material.color)),
    0.0001,
  );
  return materials.map((material) => ({
    material,
    original: material.color.clone(),
    weight: Math.max(0.4, luminance(material.color) / brightest),
  }));
}

/** Tint the body, or restore the model's own colours with `null`. */
export function applyBodyColor(
  prepared: PreparedDevice,
  color: string | null,
): void {
  for (const part of prepared.body) {
    if (color) part.material.color.set(color).multiplyScalar(part.weight);
    else part.material.color.copy(part.original);
  }
}

const SCREEN_NAME = /screen|display/i;
/** Grid density of a generated screen. Enough to follow a curved tube; each point costs one ray at load. */
const SCREEN_PLANE_SEGMENTS = 14;

function isMesh(object: Object3D): object is Mesh {
  return (object as Mesh).isMesh === true;
}

/** The meshes that show the screen content. A pattern can match several, for objects with more than one face. */
function findScreenMeshes(
  root: Object3D,
  wanted: string | RegExp | undefined,
): Mesh[] {
  const meshes: Mesh[] = [];
  root.traverse((object) => {
    if (isMesh(object)) meshes.push(object);
  });
  if (wanted instanceof RegExp)
    return meshes.filter((mesh) => matches(mesh, wanted));
  const exact = wanted
    ? meshes.find((mesh) => mesh.name === wanted)
    : undefined;
  const found = exact ?? meshes.find((mesh) => SCREEN_NAME.test(mesh.name));
  return found ? [found] : [];
}

/** A rounded rectangle standing in for a screen that is baked into the model's texture. */
function createScreenPlane(plane: ScreenPlane): Mesh {
  const halfW = plane.width / 2;
  const halfH = plane.height / 2;
  const r = Math.min(plane.radius, halfW, halfH);
  const cols = SCREEN_PLANE_SEGMENTS;
  const rows = SCREEN_PLANE_SEGMENTS;
  const positions = new Float32Array((cols + 1) * (rows + 1) * 3);
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i <= cols; i++) {
      let x = -halfW + (plane.width * i) / cols;
      let y = -halfH + (plane.height * j) / rows;
      // Pull grid points that fall outside a rounded corner back onto its arc.
      const cx = Math.sign(x) * (halfW - r);
      const cy = Math.sign(y) * (halfH - r);
      if (Math.abs(x) > halfW - r && Math.abs(y) > halfH - r) {
        const distance = Math.hypot(x - cx, y - cy);
        if (distance > r) {
          x = cx + ((x - cx) / distance) * r;
          y = cy + ((y - cy) / distance) * r;
        }
      }
      positions.set([x, y, 0], (j * (cols + 1) + i) * 3);
    }
  }
  const indices: number[] = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = j * (cols + 1) + i;
      const b = a + 1;
      const c = a + cols + 1;
      const d = c + 1;
      indices.push(a, b, d, a, d, c);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  const mesh = new Mesh(geometry);
  mesh.position.set(...plane.center);
  const [rx, ry, rz] = plane.rotation ?? [0, 0, 0];
  mesh.rotation.set(
    MathUtils.degToRad(rx),
    MathUtils.degToRad(ry),
    MathUtils.degToRad(rz),
  );
  return mesh;
}

/**
 * Press a generated screen onto the model: each of its points is dropped along the screen's facing direction onto
 * whatever surface lies under it, so the screen follows the real glass (curved tubes included) instead of hovering
 * at a guessed depth. Points that find no surface take the typical depth of those that did.
 */
function conformToSurface(plane: Mesh, model: Object3D, width: number): void {
  const targets: Mesh[] = [];
  model.traverse((object) => {
    if (isMesh(object) && object !== plane) targets.push(object);
  });
  const reach = width * 0.3;
  const lift = width * 0.004;
  const facing = new Vector3(0, 0, 1).transformDirection(plane.matrixWorld);
  const toLocal = plane.matrixWorld.clone().invert();
  const raycaster = new Raycaster();
  raycaster.far = reach * 2;
  const position = plane.geometry.getAttribute("position");
  const point = new Vector3();
  const depths: (number | null)[] = [];
  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i).applyMatrix4(plane.matrixWorld);
    raycaster.set(
      point.addScaledVector(facing, reach),
      facing.clone().negate(),
    );
    const [hit] = raycaster.intersectObjects(targets, false);
    depths.push(
      hit
        ? hit.point.addScaledVector(facing, lift).applyMatrix4(toLocal).z
        : null,
    );
  }
  const found = depths
    .filter((depth): depth is number => depth !== null)
    .sort((a, b) => a - b);
  if (found.length === 0) return;
  const typical = found[Math.floor(found.length / 2)];
  for (let i = 0; i < position.count; i++)
    position.setZ(i, depths[i] ?? typical);
  position.needsUpdate = true;
  plane.geometry.computeVertexNormals();
}

/**
 * Clone the screen geometry and give it a `screenUv` attribute: where each vertex sits across the screen (0..1, origin
 * top-left), measured in the upright device frame. Deriving it from positions rather than the model's UVs means the
 * content spans exactly the screen and comes out upright however the model's UV islands are laid out.
 */
function withScreenCoords(mesh: Mesh, flipV: boolean): BufferGeometry {
  const geometry = mesh.geometry.clone();
  const position = geometry.getAttribute("position");
  const point = new Vector3();

  // Left-to-right runs along the face's own horizontal, so a face turned away from the camera (one side of a
  // three-sided sign, say) still reads the right way round.
  if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
  const normals = geometry.getAttribute("normal");
  const facing = new Vector3();
  for (let i = 0; i < normals.count; i++)
    facing.add(point.fromBufferAttribute(normals, i));
  if (facing.length() / normals.count < 0.3) facing.set(0, 0, 1);
  else facing.transformDirection(mesh.matrixWorld);
  const right = new Vector3(0, 1, 0).cross(facing);
  if (right.lengthSq() < 1e-6) right.set(1, 0, 0);
  right.normalize();

  const xs = new Float32Array(position.count);
  const ys = new Float32Array(position.count);
  let minX = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (let i = 0; i < position.count; i++) {
    point.fromBufferAttribute(position, i).applyMatrix4(mesh.matrixWorld);
    xs[i] = point.dot(right);
    ys[i] = point.y;
    minX = Math.min(minX, xs[i]);
    maxX = Math.max(maxX, xs[i]);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  const width = maxX - minX || 1;
  const height = maxY - minY || 1;
  const coords = new Float32Array(position.count * 2);
  for (let i = 0; i < position.count; i++) {
    const v = (maxY - ys[i]) / height;
    coords[i * 2] = (xs[i] - minX) / width;
    coords[i * 2 + 1] = flipV ? 1 - v : v;
  }
  geometry.setAttribute("screenUv", new BufferAttribute(coords, 2));
  return geometry;
}

export function prepareDevice(
  source: Object3D,
  def: DeviceDef,
): PreparedDevice {
  const model = source.clone(true);
  const ownedMaterials: Material[] = [];
  if (def.only || def.hide || def.withinX) filterMeshes(model, def);
  if (def.matte !== undefined)
    ownedMaterials.push(...makeMatte(model, def.matte));
  const lid = rigLid(model, def);
  // Everything below (screen coordinates, the screen light, the device's size) is measured with the lid open.
  if (lid) setLid(lid, 1);
  const [rx, ry, rz] = def.rotation ?? [0, 0, 0];
  const oriented = new Group();
  oriented.rotation.set(
    MathUtils.degToRad(rx),
    MathUtils.degToRad(ry),
    MathUtils.degToRad(rz),
  );
  oriented.add(model);

  const ownedGeometries: BufferGeometry[] = [];
  let screen: ScreenSurface | null = null;
  let screenLight: RectAreaLight | null = null;
  let screenMeshes: Mesh[];
  if (def.screenPlane) {
    const plane = createScreenPlane(def.screenPlane);
    ownedGeometries.push(plane.geometry);
    model.add(plane);
    oriented.updateMatrixWorld(true);
    conformToSurface(plane, model, def.screenPlane.width);
    screenMeshes = [plane];
  } else {
    screenMeshes = findScreenMeshes(model, def.screenMesh);
  }
  oriented.updateMatrixWorld(true);
  if (screenMeshes.length) {
    // Every face shares one material, so they all show the same content with the same effects.
    screen = createScreenSurface();
    for (const screenMesh of screenMeshes) {
      const geometry = withScreenCoords(screenMesh, def.flipScreenV === true);
      ownedGeometries.push(geometry);
      screenMesh.geometry = geometry;
      screenMesh.material = screen.material;
      const glass = new Mesh(geometry, screen.glass);
      glass.renderOrder = 1;
      screenMesh.add(glass);
    }
    screenLight = createScreenLight(screenMeshes[0], oriented);
  }

  const body = collectBody(model, def, screenMeshes);

  const box = new Box3().setFromObject(oriented, true);
  const size = box.getSize(new Vector3());
  const scale = 1 / (Math.max(size.x, size.y, size.z) || 1);
  const root = new Group();
  root.scale.setScalar(scale);
  root.position.copy(box.getCenter(new Vector3())).multiplyScalar(-scale);
  root.add(oriented);

  // The screen's place on the finished, normalised device: every screen face together, seen from the device's centre.
  let screenBox: ScreenBox | null = null;
  if (screenMeshes.length) {
    root.updateMatrixWorld(true);
    const bounds = new Box3();
    for (const mesh of screenMeshes) bounds.expandByObject(mesh, true);
    const middle = bounds.getCenter(new Vector3());
    const span = bounds.getSize(new Vector3());
    screenBox = {
      center: [middle.x, middle.y, middle.z],
      size: [span.x, span.y],
    };
  }

  return {
    root,
    screen,
    ownedGeometries,
    ownedMaterials,
    body,
    lid,
    screenLight,
    screenBox,
    extents: size.clone().multiplyScalar(scale),
  };
}

export function disposeDevice(prepared: PreparedDevice): void {
  for (const geometry of prepared.ownedGeometries) geometry.dispose();
  for (const material of prepared.ownedMaterials) material.dispose();
  prepared.screen?.material.dispose();
  prepared.screen?.glass.dispose();
  for (const part of prepared.body) part.material.dispose();
}
