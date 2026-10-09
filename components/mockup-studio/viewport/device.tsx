"use client";

import { useGLTF } from "@react-three/drei/core/Gltf";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  type Color,
  type Group,
  LinearMipmapLinearFilter,
  MathUtils,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  VideoTexture,
} from "three";
import { media } from "@/lib/media";
import { type DeviceDef, getDevice } from "@/lib/mockup-studio/scene/devices";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import {
  applyBodyColor,
  disposeDevice,
  prepareDevice,
  setLid,
} from "./device-model";
import type { ViewportRuntime } from "./runtime";
import { type ScreenSurface, updateScreenSurface } from "./screen-material";

interface DeviceProps {
  runtime: ViewportRuntime;
}

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

  useFrame(() => {
    if (prepared.lid) setLid(prepared.lid, runtime.values["object.lid"] / 100);

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
