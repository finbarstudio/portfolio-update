"use client";

import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import type { BloomEffect, DepthOfFieldEffect } from "postprocessing";
import { useRef, useState } from "react";
import { Vector3 } from "three";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import { FilmEffect, LensEffect, ShoulderToneMapEffect } from "./post-effects";
import type { ViewportRuntime } from "./runtime";

/**
 * Post chain, in order: bloom, tone curve, then lens (fisheye, zoom blur, aberration) and film (vignette, grain).
 * The composer starts a new pass wherever two effects cannot share one, so the lens samples the tone-mapped frame.
 * Values are written straight into the effects' uniforms every frame; nothing here renders through React.
 */
/** World units either side of the focus point that stay acceptably sharp at a middling setting. */
const DOF_SHARP_BAND = 0.5;
/** The band never gets thinner than this, about two phone thicknesses, so the panel in focus stays sharp. */
const DOF_MIN_BAND = 0.16;
const DOF_MAX_BLUR = 7;
/** Blur size when Soft Blur is all the way up. */
const SOFT_MAX_BLUR = 14;

export function Effects({ runtime }: { runtime: ViewportRuntime }) {
  const [tone] = useState(() => new ShoulderToneMapEffect());
  const [lens] = useState(() => new LensEffect());
  const [film] = useState(() => new FilmEffect());
  const bloomRef = useRef<BloomEffect>(null);
  const dofRef = useRef<DepthOfFieldEffect>(null);
  const [focus] = useState(() => new Vector3());

  useFrame(({ camera }) => {
    const v = runtime.values;

    const dof = dofRef.current;
    if (dof) {
      // Focus sits on the screen, since that is what the shot is showing off. A stronger setting both narrows the
      // band that stays sharp and enlarges the blur outside it.
      const strength = v["camera.dof"] / 100;
      const soften = v["effects.soften"] / 100;
      const target = runtime.focusTarget;
      // The frame driver moves the camera's near and far planes every frame as it dollies; the depth decode inside
      // the effect has to follow, or its idea of distance drifts and the whole picture blurs.
      dof.cocMaterial.adoptCameraSettings(camera);
      // Like a real lens, the blur outside the sharp band grows as the camera comes in close. The band itself never
      // shrinks below the thickness of a phone, so the screen, which the focus sits on, stays crisp at any distance.
      const closeness = Math.max(0.5, Math.min(3, v["camera.zoom"] / 60));
      if (soften > 0) {
        // Soft blur throws the whole picture out of focus: with the focal plane at the lens nothing is sharp, so
        // the blur is even everywhere and its size alone follows the setting.
        dof.cocMaterial.focusDistance = 0;
        dof.cocMaterial.focusRange = 0.01;
        dof.bokehScale = soften * SOFT_MAX_BLUR;
      } else {
        dof.cocMaterial.focusDistance = target
          ? camera.position.distanceTo(target.getWorldPosition(focus))
          : camera.position.length();
        dof.cocMaterial.focusRange = Math.max(
          DOF_MIN_BAND,
          DOF_SHARP_BAND * (1.6 - strength),
        );
        dof.bokehScale = strength * DOF_MAX_BLUR * (0.6 + 0.6 * closeness);
      }
    }

    const { effectCenters } = useStudio.getState();

    lens.fisheye.value = (v["camera.fisheye"] / 100) * 0.9;
    lens.blur.value = (v["effects.blur"] / 100) * 0.25;
    // Centres arrive in frame uv with the origin top-left; GL wants it bottom-left.
    lens.blurCenter.value.set(effectCenters.blur[0], 1 - effectCenters.blur[1]);
    lens.aberration.value = (v["effects.aberration"] / 100) * 0.035;
    lens.aberrationCenter.value.set(
      effectCenters.aberration[0],
      1 - effectCenters.aberration[1],
    );

    film.vignette.value = v["effects.vignette"] / 100;
    film.grain.value = v["effects.grain"] / 100;
    film.time.value = runtime.timeMs / 1000;

    // Bright pixels bloom, and after the screen shader's pre-compensation that is mostly the screen.
    if (bloomRef.current)
      bloomRef.current.intensity = (v["screen.glow"] / 100) * 2.5;
  });

  return (
    <EffectComposer multisampling={4}>
      <DepthOfField
        ref={dofRef}
        focusDistance={2}
        focusRange={DOF_SHARP_BAND}
        bokehScale={0}
      />
      <Bloom
        ref={bloomRef}
        mipmapBlur
        luminanceThreshold={0.6}
        luminanceSmoothing={0.35}
        radius={0.8}
        intensity={0}
      />
      <primitive object={tone} dispose={null} />
      <primitive object={lens} dispose={null} />
      <primitive object={film} dispose={null} />
    </EffectComposer>
  );
}
