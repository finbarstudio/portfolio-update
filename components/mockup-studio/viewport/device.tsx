"use client";

import { useGLTF } from "@react-three/drei/core/Gltf";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  CanvasTexture,
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
import { drawFramed } from "@/lib/mockup-studio/scene/frames";
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
import { updateBounceFrame } from "./screen-bounce";
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

/** The picture the screen shows, before any framing: an image or a playing video, and its size in pixels. */
interface ScreenSource {
  kind: "image" | "video";
  texture: Texture;
  element: HTMLImageElement | HTMLVideoElement;
  width: number;
  height: number;
}

/** Longest side of the canvas a framed screen is composed on. */
const FRAME_LONG_EDGE = 2048;

/** Pixel size of the canvas for a framed screen: the screen's own shape, capped so video can be redrawn every frame. */
function frameCanvasSize(def: DeviceDef): [number, number] {
  const aspect = def.screenAspect;
  return aspect >= 1
    ? [FRAME_LONG_EDGE, Math.round(FRAME_LONG_EDGE / aspect)]
    : [Math.round(FRAME_LONG_EDGE * aspect), FRAME_LONG_EDGE];
}

/**
 * Loads the screen media and puts it on the screen, either as it is or composed into a window over a backdrop.
 * Loading and showing are separate steps, so changing the framing never reloads the file.
 */
function useScreenMedia(
  screen: ScreenSurface | null,
  runtime: ViewportRuntime,
  def: DeviceDef,
) {
  const mediaUrl = useStudio((s) => s.media?.url ?? null);
  const mediaKind = useStudio((s) => s.media?.kind ?? null);
  const frame = useStudio((s) => s.frame);
  const gl = useThree((s) => s.gl);
  const [source, setSource] = useState<ScreenSource | null>(null);

  useEffect(() => {
    if (!mediaUrl || !mediaKind) return;

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
        loaded = texture;
        setSource({
          kind: "image",
          texture,
          element: texture.image,
          width: texture.image.naturalWidth || 1,
          height: texture.image.naturalHeight || 1,
        });
      });
      return () => {
        cancelled = true;
        loaded?.dispose();
        setSource(null);
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
      setSource({
        kind: "video",
        texture,
        element: video,
        width: video.videoWidth,
        height: video.videoHeight,
      });
    };
    video.addEventListener("loadeddata", onData);
    video.src = mediaUrl;
    // The frame loop starts and stops it with the timeline; see followTimeline.
    runtime.video = video;
    return () => {
      video.removeEventListener("loadeddata", onData);
      disconnectSound(video);
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      if (runtime.video === video) runtime.video = null;
      setSource(null);
    };
  }, [mediaUrl, mediaKind, gl, runtime]);

  useEffect(() => {
    if (!screen || !source) return;
    const { uniforms } = screen;
    const clear = () => {
      uniforms.uMap.value = null;
      uniforms.uHasMap.value = 0;
      runtime.refreshScreen = null;
      runtime.framed = false;
    };

    if (frame.style === "none") {
      uniforms.uMediaAspect.value = source.width / source.height;
      uniforms.uMap.value = source.texture;
      uniforms.uHasMap.value = 1;
      // Video frames reach the shader still sRGB encoded; images do not.
      uniforms.uVideo.value = source.kind === "video" ? 1 : 0;
      runtime.framed = false;
      runtime.refreshScreen =
        source.kind === "video"
          ? () => {
              source.texture.needsUpdate = true;
            }
          : null;
      return clear;
    }

    const [width, height] = frameCanvasSize(def);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = false;
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    let drawnAt = Number.NaN;
    const draw = () => {
      // A video is only redrawn when it has moved on to another frame.
      const at =
        source.element instanceof HTMLVideoElement
          ? source.element.currentTime
          : 0;
      if (at === drawnAt) return;
      drawnAt = at;
      drawFramed(
        ctx,
        width,
        height,
        source.element,
        source.width,
        source.height,
        frame,
      );
      texture.needsUpdate = true;
    };
    draw();
    // The composed picture is exactly the screen's shape, so it goes on edge to edge.
    uniforms.uMediaAspect.value = def.screenAspect;
    uniforms.uMap.value = texture;
    uniforms.uHasMap.value = 1;
    uniforms.uVideo.value = 0;
    runtime.framed = true;
    runtime.refreshScreen = source.kind === "video" ? draw : null;
    return () => {
      texture.dispose();
      clear();
    };
  }, [screen, source, frame, def, gl, runtime]);
}

/** How a picture already composed to the screen's shape is placed on it. */
const EDGE_TO_EDGE = {
  fit: "stretch",
  scale: 1,
  offsetX: 0,
  offsetY: 0,
} as const;

/** How strongly the picture shows in the body at Body Reflection 100. */
const BOUNCE_MAX = 10;
/** How much light the screen throws onto what faces it at Light Spill 100. */
const SPILL_MAX = 2.5;

interface DeviceModelProps extends DeviceProps {
  def: DeviceDef;
}

function DeviceModel({ def, runtime }: DeviceModelProps) {
  // Models are media: they come off the bucket through media(). Compressed ones are unpacked by drei's stock decoder.
  const gltf = useGLTF(media(def.url), true);
  const [prepared] = useState(() =>
    prepareDevice(gltf.scene, def, runtime.bounce),
  );
  const { screen } = prepared;

  const bodyColor = useStudio((s) => s.bodyColor);

  useScreenMedia(screen, runtime, def);

  useEffect(() => applyBodyColor(prepared, bodyColor), [prepared, bodyColor]);

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
        // A paused video draws no new frames on its own, so a scrub has to ask for one. A framed one is composed by
        // hand, so it asks every frame.
        if (!playing || runtime.framed) runtime.refreshScreen?.();
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

    if (prepared.screenFrame) {
      prepared.root.updateMatrixWorld(true);
      updateBounceFrame(runtime.bounce, prepared.screenFrame);
    }
    const v = runtime.values;
    runtime.bounce.uBounceAmount.value =
      (v["screen.bounce"] / 100) * BOUNCE_MAX;
    runtime.bounce.uBounceSoft.value = v["screen.bounceSoft"] / 100;
    runtime.bounce.uBounceWash.value = (v["screen.spill"] / 100) * SPILL_MAX;

    if (screen) {
      const { media, lights, background } = useStudio.getState();
      updateScreenSurface(
        screen,
        runtime.values,
        // A framed screen is already composed to fit, so the fit, scale and offset do not apply to it.
        media && runtime.framed ? { ...media, ...EDGE_TO_EDGE } : media,
        def.screenAspect,
        lights,
        !background.transparent &&
          background.hdriUse !== "backdrop" &&
          (background.hdriFile !== null || background.hdri !== null),
      );
    }
  }, -5);

  useEffect(() => {
    const { x, y, z } = prepared.extents;
    runtime.deviceExtents.copy(prepared.extents);
    runtime.focusTarget = prepared.screenAnchor;
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
