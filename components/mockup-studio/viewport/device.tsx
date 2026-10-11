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
import { OPEN_SOUND, SILENCE, speakerShape } from "@/lib/mockup-studio/scene/sound";
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
  shapeSound,
  soundUnlocked,
} from "./screen-audio";
import { type ScreenSurface, updateScreenSurface } from "./screen-material";

interface DeviceProps {
  runtime: ViewportRuntime;
}

/** Seconds the video may run ahead of or behind the playhead before it is pulled back into step. */
const VIDEO_DRIFT = 0.3;
/** Paused, the video is held within about a frame of the playhead. */
const VIDEO_HOLD = 0.02;

/**
 * Keep the screen video on the timeline's clock: it plays only while the animation plays, sits on the frame under
 * the playhead when paused or scrubbed, and loops if it is shorter than the animation. Export seeks it the same way.
 */
function followTimeline(
  video: HTMLVideoElement,
  playheadMs: number,
  playing: boolean,
): void {
  const { duration } = video;
  if (!Number.isFinite(duration) || duration <= 0) return;
  const target = (playheadMs / 1000) % duration;
  // Measured round the loop, so the last frame and the first count as neighbours.
  const off = Math.abs(video.currentTime - target);
  const drift = Math.min(off, duration - off);
  if (playing) {
    if (drift > VIDEO_DRIFT) video.currentTime = target;
    if (video.paused) video.play().catch(() => undefined);
    return;
  }
  if (!video.paused) video.pause();
  if (drift > VIDEO_HOLD && !video.seeking) video.currentTime = target;
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
      // Sound needs a click or key press first; once the page has had one, a new video can be heard straight away.
      if (soundUnlocked()) connectSound(video);
      uniforms.uMediaAspect.value = video.videoWidth / video.videoHeight;
      uniforms.uMap.value = texture;
      uniforms.uHasMap.value = 1;
      uniforms.uVideo.value = 1;
    };
    video.addEventListener("loadeddata", onData);
    video.src = mediaUrl;
    // The frame loop starts and stops it with the timeline; see followTimeline.
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

  useFrame(() => {
    if (prepared.lid) setLid(prepared.lid, runtime.values["object.lid"] / 100);

    if (runtime.video) {
      const { sound, speakerSound, playing, playhead } = useStudio.getState();
      if (runtime.exportMs === null) {
        followTimeline(runtime.video, playhead, playing);
        // A paused video draws no new frames on its own, so a scrub has to ask for one.
        if (!playing && runtime.videoTexture)
          runtime.videoTexture.needsUpdate = true;
      }
      // Heard only while the animation plays, and never during an export, which steps the video frame by frame.
      const audible = sound && playing && runtime.exportMs === null;
      shapeSound(
        runtime.video,
        audible
          ? speakerSound
            ? speakerShape(def, runtime.values)
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
