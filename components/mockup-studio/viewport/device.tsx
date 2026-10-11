"use client";

import { useGLTF } from "@react-three/drei/core/Gltf";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  type Color,
  type Group,
  LinearMipmapLinearFilter,
  MathUtils,
  Quaternion,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector3,
  VideoTexture,
} from "three";
import { media } from "@/lib/media";
import {
  type DeviceCategory,
  type DeviceDef,
  getDevice,
} from "@/lib/mockup-studio/scene/devices";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import {
  applyBodyColor,
  disposeDevice,
  prepareDevice,
  setLid,
} from "./device-model";
import type { ViewportRuntime } from "./runtime";
import {
  connectSound,
  disconnectSound,
  type SoundShape,
  shapeSound,
  soundUnlocked,
} from "./screen-audio";
import { type ScreenSurface, updateScreenSurface } from "./screen-material";

interface DeviceProps {
  runtime: ViewportRuntime;
}

const OPEN_SOUND: SoundShape = { level: 1, floor: 20, ceiling: 20000 };
const SILENCE: SoundShape = { level: 0, floor: 20, ceiling: 20000 };

/** Hz below which each kind of device gives no sound: the smaller the speaker, the thinner it is. */
const SPEAKER_FLOOR: Record<DeviceCategory, number> = {
  "Phones and tablets": 320,
  "Computers and displays": 140,
  Wearables: 520,
  Retro: 260,
  Signage: 110,
};

/** A lid at or past this many percent open no longer muffles anything. */
const LID_CLEAR = 35;

/**
 * The sound as it would leave the device. A shut lid sits over the speakers, so it dulls and quietens them; turning
 * the device away does the same to a lesser degree; and it gets louder as the camera comes close.
 */
function speakerShape(
  def: DeviceDef,
  runtime: ViewportRuntime,
  camera: Vector3,
  facing: Vector3,
): SoundShape {
  const v = runtime.values;
  const open = def.lid ? MathUtils.clamp(v["object.lid"] / LID_CLEAR, 0, 1) : 1;
  // 1 with the screen towards the camera, 0 with its back to it.
  facing.set(0, 0, 1);
  if (runtime.device)
    facing.applyQuaternion(runtime.device.getWorldQuaternion(QUATERNION));
  const away = MathUtils.smoothstep(
    -facing.dot(camera) / camera.length(),
    -0.2,
    0.6,
  );
  const near = MathUtils.clamp(Math.sqrt(v["camera.zoom"] / 60), 0.45, 1.25);
  return {
    level: Math.min(1, (0.18 + 0.82 * open) * (1 - 0.45 * away) * near * 0.85),
    floor: SPEAKER_FLOOR[def.category],
    ceiling: Math.min(600 + 17400 * open * open, 18000 - 15000 * away),
  };
}

const QUATERNION = new Quaternion();

/** Loads the screen media into the screen shader. Images and videos share one texture slot. */
function useScreenMedia(
  screen: ScreenSurface | null,
  runtime: ViewportRuntime,
) {
  const mediaUrl = useStudio((s) => s.media?.url ?? null);
  const mediaKind = useStudio((s) => s.media?.kind ?? null);
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    if (!screen || !mediaUrl || !mediaKind) return;
    const { uniforms } = screen;

    if (mediaKind === "image") {
      let cancelled = false;
      let loaded: Texture | null = null;
      new TextureLoader().load(mediaUrl, (texture) => {
        if (cancelled) {
          texture.dispose();
          return;
        }
        texture.colorSpace = SRGBColorSpace;
        // glTF-style addressing: v = 0 is the top of the image, matching screenUv.
        texture.flipY = false;
        texture.anisotropy = gl.capabilities.getMaxAnisotropy();
        uniforms.uMediaAspect.value =
          (texture.image.naturalWidth || 1) /
          (texture.image.naturalHeight || 1);
        uniforms.uMap.value = texture;
        uniforms.uHasMap.value = 1;
        uniforms.uVideo.value = 0;
        loaded = texture;
        sampleAverage(texture.image, runtime.screenColor);
      });
      return () => {
        cancelled = true;
        loaded?.dispose();
        uniforms.uMap.value = null;
        uniforms.uHasMap.value = 0;
      };
    }

    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "auto";
    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
    // Mipmaps and anisotropic filtering keep the picture crisp when the screen is small or seen at an angle; without
    // them video goes soft and shimmers.
    texture.generateMipmaps = true;
    texture.minFilter = LinearMipmapLinearFilter;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    const onData = () => {
      if (video.videoWidth === 0) return;
      // Sound needs a click or key press first; once the page has had one, a new video can be heard straight away.
      if (soundUnlocked()) connectSound(video);
      uniforms.uMediaAspect.value = video.videoWidth / video.videoHeight;
      uniforms.uMap.value = texture;
      uniforms.uHasMap.value = 1;
      uniforms.uVideo.value = 1;
    };
    video.addEventListener("loadeddata", onData);
    video.src = mediaUrl;
    video.play().catch(() => undefined);
    runtime.video = video;
    runtime.videoTexture = texture;
    return () => {
      video.removeEventListener("loadeddata", onData);
      disconnectSound(video);
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      if (runtime.video === video) {
        runtime.video = null;
        runtime.videoTexture = null;
      }
      uniforms.uMap.value = null;
      uniforms.uHasMap.value = 0;
      runtime.screenColor.setRGB(0, 0, 0);
    };
  }, [screen, mediaUrl, mediaKind, gl, runtime]);
}

/** How often the screen's light colour is re-read from a playing video, in frames. */
const VIDEO_SAMPLE_EVERY = 6;
/** Area-light intensity for a full-white screen at 100% spill. */
const SPILL_MAX = 5;

let sampler: CanvasRenderingContext2D | null = null;

/** Average colour of an image or video frame, written into `out` as linear colour. */
function sampleAverage(source: CanvasImageSource, out: Color): void {
  if (!sampler) {
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 8;
    sampler = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!sampler) return;
  sampler.clearRect(0, 0, 8, 8);
  sampler.drawImage(source, 0, 0, 8, 8);
  const { data } = sampler.getImageData(0, 0, 8, 8);
  let r = 0;
  let g = 0;
  let b = 0;
  for (let i = 0; i < data.length; i += 4) {
    // Transparent pixels show as black on the screen.
    const alpha = data[i + 3] / 255;
    r += data[i] * alpha;
    g += data[i + 1] * alpha;
    b += data[i + 2] * alpha;
  }
  const scale = 1 / (255 * 64);
  out.setRGB(r * scale, g * scale, b * scale, SRGBColorSpace);
}

interface DeviceModelProps extends DeviceProps {
  def: DeviceDef;
}

function DeviceModel({ def, runtime }: DeviceModelProps) {
  // Models are media: they come off the bucket through media(). Compressed ones are unpacked by drei's stock decoder.
  const gltf = useGLTF(media(def.url), true);
  const [prepared] = useState(() => prepareDevice(gltf.scene, def));
  const { screen } = prepared;

  const bodyColor = useStudio((s) => s.bodyColor);

  useScreenMedia(screen, runtime);

  useEffect(() => applyBodyColor(prepared, bodyColor), [prepared, bodyColor]);

  const frame = useRef(0);
  const [facing] = useState(() => new Vector3());

  // The first click or key press anywhere lets the video's sound through.
  useEffect(() => {
    const unlock = () => {
      if (runtime.video) connectSound(runtime.video);
    };
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [runtime]);

  useFrame(({ camera }) => {
    if (prepared.lid) setLid(prepared.lid, runtime.values["object.lid"] / 100);

    if (runtime.video) {
      const { sound, speakerSound, playing } = useStudio.getState();
      // Heard only while the animation plays, and never during an export, which steps the video frame by frame.
      const audible = sound && playing && runtime.exportMs === null;
      shapeSound(
        runtime.video,
        audible
          ? speakerSound
            ? speakerShape(def, runtime, camera.position, facing)
            : OPEN_SOUND
          : SILENCE,
      );
    }

    const light = prepared.screenLight;
    if (light) {
      const video = runtime.video;
      frame.current += 1;
      if (
        video &&
        video.readyState >= 2 &&
        (runtime.exportMs !== null || frame.current % VIDEO_SAMPLE_EVERY === 0)
      )
        sampleAverage(video, runtime.screenColor);
      const v = runtime.values;
      light.color.copy(runtime.screenColor);
      light.intensity =
        (v["screen.spill"] / 100) * (v["screen.opacity"] / 100) * SPILL_MAX;
    }

    if (screen)
      updateScreenSurface(
        screen,
        runtime.values,
        useStudio.getState().media,
        def.screenAspect,
      );
  }, -5);

  useEffect(() => {
    const { x, y, z } = prepared.extents;
    runtime.deviceExtents.copy(prepared.extents);
    runtime.focusTarget = prepared.screenLight;
    // So the device drops a shadow on the floor when there is one.
    prepared.root.traverse((object) => {
      if ("isMesh" in object && object.isMesh) object.castShadow = true;
    });
    useStudio.getState().setDeviceExtents([x, y, z], prepared.screenBox);
    return () => {
      runtime.focusTarget = null;
      disposeDevice(prepared);
    };
  }, [prepared, runtime]);

  return <primitive object={prepared.root} />;
}

export function Device({ runtime }: DeviceProps) {
  const deviceId = useStudio((s) => s.deviceId);
  const def = getDevice(deviceId);
  const outerRef = useRef<Group>(null);
  const innerRef = useRef<Group>(null);

  // Object transform, following lib/scene/params.ts: the outer group moves and tilts in world space, the inner group
  // holds the free rotation.
  useFrame(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const v = runtime.values;
    outer.position.set(v["object.x"] / 100, v["object.y"] / 100, 0);
    outer.rotation.set(MathUtils.degToRad(v["object.tilt"]), 0, 0);
    inner.rotation.set(
      MathUtils.degToRad(v["object.rotX"]),
      MathUtils.degToRad(v["object.rotY"]),
      MathUtils.degToRad(v["object.rotZ"]),
      "XYZ",
    );
  }, -5);

  useEffect(() => {
    runtime.device = innerRef.current;
    return () => {
      runtime.device = null;
    };
  }, [runtime]);

  return (
    <group ref={outerRef}>
      <group ref={innerRef}>
        <Suspense fallback={null}>
          <DeviceModel key={def.id} def={def} runtime={runtime} />
        </Suspense>
      </group>
    </group>
  );
}
