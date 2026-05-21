import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { readFileSync } from "fs";
const file = readFileSync(process.argv[2]);
const loader = new GLTFLoader();
loader.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength), "", (gltf) => {
  gltf.scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      const matName = Array.isArray(obj.material) ? obj.material.map(m => m.name).join("|") : obj.material?.name;
      console.log(`  MESH name="${obj.name}"  parent="${obj.parent?.name ?? ''}"  mat="${matName}"`);
    } else if (obj instanceof THREE.Group) {
      console.log(`GROUP name="${obj.name}"  parent="${obj.parent?.name ?? ''}"`);
    }
  });
}, (err) => console.error("ERR", err));
