"use client";

import { Environment } from "@react-three/drei/core/Environment";
import { Lightformer } from "@react-three/drei/core/Lightformer";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  type AmbientLight,
  EquirectangularReflectionMapping,
  MathUtils,
  Quaternion,
  type SpotLight,
  Vector3,
} from "three";
import { EXRLoader } from "three/addons/loaders/EXRLoader.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { media } from "@/lib/media";
import { getHdri, type HdriFormat, type HdriUse } from "@/lib/mockup-studio/scene/hdris";
import { lampPosition } from "@/lib/mockup-studio/scene/lamps";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { Light } from "@/lib/mockup-studio/scene/types";
import type { ViewportRuntime } from "./runtime";

const SPOT_ANGLE = MathUtils.degToRad(30);
const SPOT_PENUMBRA = 0.5;
/**
 * Ambient 0..100 mostly drives the studio reflections, which is where metal and glass get their look. Only a little
 * goes into flat ambient light, because flat light greys out the shadows and makes the device look pasted on.
 */
const ENVIRONMENT_MAX = 1.2;
const FLAT_AMBIENT_MAX = 0.12;

/**
 * Procedural studio for the metal and glass to reflect: softboxes placed like a three-point product setup (a large
 * key box front-right and above, a tall cool fill strip on the left, two rim strips behind) inside a dim grey room.
 * The boxes are big and only a few times brighter than the room, so highlights are broad and never clip to white.
 * No network files. The component takes no props and never re-renders, so the bake runs once.
 */
function StudioEnvironment() {
  return (
    <Environment resolution={512} background={false}>
      <Lightformer form="box" scale={40} intensity={0.32} color="#a2a6ae" />
      <Lightformer
        form="rect"
        scale={[14, 9, 1]}
        intensity={1.7}
        position={[4, 6, 5]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        scale={[5, 12, 1]}
        intensity={0.9}
        color="#e6edff"
        position={[-7, 1, 3]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        scale={[3, 11, 1]}
        intensity={1.8}
        position={[5, 2, -6]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        scale={[3, 11, 1]}
        intensity={1.2}
        position={[-5, 3, -6]}
        target={[0, 0, 0]}
      />
      <Lightformer
        form="rect"
        scale={[14, 14, 1]}
        intensity={0.3}
        color="#8a8a94"
        position={[0, -6, 0]}
        target={[0, 0, 0]}
      />
    </Environment>
  );
}

// One shared element, so React skips it when `Lights` re-renders and the cube map is not baked again.
const environment = <StudioEnvironment />;

interface StudioLightProps {
  light: Light;
  runtime: ViewportRuntime;
}

function StudioLight({ light, runtime }: StudioLightProps) {
  const lampRef = useRef<SpotLight>(null);
  // Shadows only cost anything with a floor to fall on.
  const castShadow = useStudio((s) => s.background.floor !== "none");
  const [target] = useState(() => new Vector3());

  useFrame(() => {
    const lamp = lampRef.current;
    if (!lamp) return;
    lamp.intensity = light.intensity * (runtime.values["lights.level"] / 100);
    lamp.position.set(
      ...lampPosition(light, runtime.values["lights.rotation"]),
    );
    // The aim point is stored in device space, so it follows the device when it moves or turns.
    target.set(...light.target);
    runtime.device?.localToWorld(target);
    lamp.target.position.copy(target);
    lamp.target.updateMatrixWorld();
  });

  return (
    <spotLight
      ref={lampRef}
      color={light.color}
      angle={SPOT_ANGLE}
      penumbra={SPOT_PENUMBRA}
      decay={2}
      castShadow={castShadow}
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0004}
      shadow-normalBias={0.02}
      shadow-radius={4}
    />
  );
}

/**
 * An environment photo: behind the device, lighting it in place of the studio so it picks up the colours of the
 * place it appears to be in, or both. Lighting only keeps the chosen backdrop colour, with the photo in the
 * reflections.
 */
const UP = new Vector3(0, 1, 0);
const turned = new Quaternion();

function HdriBackdrop({
  url,
  format,
  use,
  runtime,
}: {
  url: string;
  format: HdriFormat;
  use: HdriUse;
  runtime: ViewportRuntime;
}) {
  const texture = useLoader(format === "exr" ? EXRLoader : HDRLoader, url);
  const scene = useThree((s) => s.scene);
  const blur = useStudio((s) => s.background.hdriBlur);
  const brightness = useStudio((s) => s.background.hdriBrightness);
  const rotation = useStudio((s) => s.background.hdriRotation);
  const lighting = use !== "backdrop";
  const shown = use !== "lighting";

  useEffect(() => {
    texture.mapping = EquirectangularReflectionMapping;
  }, [texture]);

  useEffect(() => {
    if (!shown) return;
    scene.background = texture;
    return () => {
      scene.background = null;
    };
  }, [shown, texture, scene]);

  useEffect(() => {
    scene.backgroundBlurriness = (blur / 100) * 0.5;
    scene.backgroundIntensity = brightness / 100;
  }, [scene, blur, brightness]);

  // The Turn control, then whatever the ground is doing, so the place stays level with the floor.
  useFrame(() => {
    turned
      .setFromAxisAngle(UP, MathUtils.degToRad(rotation))
      .premultiply(runtime.ground);
    scene.backgroundRotation.setFromQuaternion(turned);
  });

  useEffect(() => {
    if (!lighting) return;
    const studio = scene.environment;
    scene.environment = texture;
    return () => {
      scene.environment = studio;
    };
  }, [lighting, texture, scene]);

  return null;
}

export function Lights({ runtime }: { runtime: ViewportRuntime }) {
  const use = useStudio((s) => s.background.hdriUse);
  // A transparent canvas has nothing behind the device, but an environment can still light it.
  const hdri = useStudio((s) =>
    s.background.transparent && s.background.hdriUse !== "lighting"
      ? null
      : (s.background.hdriFile ?? getHdri(s.background.hdri)),
  );
  const hdriTurn = useStudio((s) => s.background.hdriRotation);
  const lights = useStudio((s) => s.lights);
  const scene = useThree((s) => s.scene);
  const ambientRef = useRef<AmbientLight>(null);

  useFrame(() => {
    const ambient = runtime.values["lights.ambient"] / 100;
    if (ambientRef.current)
      ambientRef.current.intensity = ambient * FLAT_AMBIENT_MAX;
    scene.environmentIntensity = ambient * ENVIRONMENT_MAX;
    // The studio turns with the lights, so the reflections sweep too. An environment photo that lights the device
    // also turns with its own Turn control, so what shows in the reflections matches what is behind the device.
    const photoTurn = hdri && use !== "backdrop" ? hdriTurn : 0;
    turned.setFromAxisAngle(
      UP,
      MathUtils.degToRad(runtime.values["lights.rotation"] + photoTurn),
    );
    // A real place stays level with the ground; the studio's own softboxes stay with the camera.
    if (photoTurn !== 0 || (hdri && use !== "backdrop"))
      turned.premultiply(runtime.ground);
    scene.environmentRotation.setFromQuaternion(turned);
  });

  return (
    <>
      <ambientLight ref={ambientRef} />
      {environment}
      {hdri ? (
        <Suspense fallback={null}>
          <HdriBackdrop
            key={hdri.url}
            // Built-in photos live under the app's base path; uploaded ones are object URLs.
            url={
              hdri.url.startsWith("blob:") ? hdri.url : media(hdri.url)
            }
            format={hdri.format}
            use={use}
            runtime={runtime}
          />
        </Suspense>
      ) : null}
      {lights.map((light) => (
        <StudioLight key={light.id} light={light} runtime={runtime} />
      ))}
    </>
  );
}
