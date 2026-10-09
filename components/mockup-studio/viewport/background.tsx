"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useState } from "react";
import {
  AddEquation,
  CustomBlending,
  OneFactor,
  OneMinusSrcAlphaFactor,
  ShaderMaterial,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Uniform,
  Vector2,
} from "three";
import { useStudio } from "@/lib/mockup-studio/scene/store";
import type { BackgroundLayer } from "@/lib/mockup-studio/scene/types";

/**
 * Background image layers are drawn straight in clip space, ignoring the camera and the object, so they stay put
 * behind the device. They live in the scene (not in CSS) so they end up in exports.
 */

const VERTEX = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uMap;
uniform float uOpacity;
uniform float uFrameAspect;
uniform float uImageAspect;
uniform float uContain;

varying vec2 vUv;

void main() {
  float frameOverImage = uFrameAspect / uImageAspect;
  vec2 span = vec2(min(1.0, frameOverImage), min(1.0, 1.0 / frameOverImage));
  if (uContain > 0.5) {
    span = vec2(max(1.0, frameOverImage), max(1.0, 1.0 / frameOverImage));
  }
  vec2 m = 0.5 + (vUv - 0.5) * span;
  vec4 texel = texture2D(uMap, clamp(m, 0.0, 1.0));
  float inside = step(0.0, m.x) * step(m.x, 1.0) * step(0.0, m.y) * step(m.y, 1.0);
  float alpha = texel.a * inside * uOpacity;
  // Premultiplied, to match the blending below.
  gl_FragColor = vec4(texel.rgb * alpha, alpha);
}
`;

interface LayerUniforms {
  uMap: Uniform<Texture | null>;
  uOpacity: Uniform<number>;
  uFrameAspect: Uniform<number>;
  uImageAspect: Uniform<number>;
  uContain: Uniform<number>;
}

interface LayerSurface {
  material: ShaderMaterial;
  uniforms: LayerUniforms;
}

function createLayerSurface(): LayerSurface {
  const uniforms: LayerUniforms = {
    uMap: new Uniform<Texture | null>(null),
    uOpacity: new Uniform(1),
    uFrameAspect: new Uniform(1),
    uImageAspect: new Uniform(1),
    uContain: new Uniform(0),
  };
  const material = new ShaderMaterial({
    uniforms: { ...uniforms },
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
    // Not `transparent`, so the layer sits in the opaque list (and in front of the clear colour) in renderOrder, ahead
    // of the device. Custom blending still applies: premultiplied "over".
    transparent: false,
    blending: CustomBlending,
    blendEquation: AddEquation,
    blendSrc: OneFactor,
    blendDst: OneMinusSrcAlphaFactor,
    blendSrcAlpha: OneFactor,
    blendDstAlpha: OneMinusSrcAlphaFactor,
  });
  return { material, uniforms };
}

interface LayerPlaneProps {
  layer: BackgroundLayer;
  /** Position in the stack, 0 = bottom. */
  order: number;
}

function LayerPlane({ layer, order }: LayerPlaneProps) {
  const gl = useThree((s) => s.gl);
  const [surface] = useState(createLayerSurface);
  const [bufferSize] = useState(() => new Vector2());

  useEffect(() => {
    const { uniforms } = surface;
    let cancelled = false;
    let loaded: Texture | null = null;
    new TextureLoader().load(layer.url, (texture) => {
      if (cancelled) {
        texture.dispose();
        return;
      }
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = gl.capabilities.getMaxAnisotropy();
      uniforms.uImageAspect.value =
        (texture.image.naturalWidth || 1) / (texture.image.naturalHeight || 1);
      uniforms.uMap.value = texture;
      loaded = texture;
    });
    return () => {
      cancelled = true;
      loaded?.dispose();
      uniforms.uMap.value = null;
    };
  }, [surface, layer.url, gl]);

  useEffect(() => {
    surface.uniforms.uOpacity.value = layer.opacity / 100;
    surface.uniforms.uContain.value = layer.fit === "contain" ? 1 : 0;
  }, [surface, layer.opacity, layer.fit]);

  useEffect(() => () => surface.material.dispose(), [surface]);

  // The frame aspect is read from the drawing buffer so exports at another size stay correct. Nothing is drawn until
  // the texture has loaded.
  useFrame((state) => {
    const { uniforms } = surface;
    state.gl.getDrawingBufferSize(bufferSize);
    uniforms.uFrameAspect.value = bufferSize.x / bufferSize.y;
    surface.material.visible = uniforms.uMap.value !== null;
  });

  return (
    <mesh renderOrder={-1000 + order} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={surface.material} attach="material" />
    </mesh>
  );
}

export function BackgroundLayers() {
  const transparent = useStudio((s) => s.background.transparent);
  const layers = useStudio((s) => s.background.layers);
  if (transparent) return null;
  return layers.map((layer, index) => (
    <LayerPlane key={layer.id} layer={layer} order={index} />
  ));
}
