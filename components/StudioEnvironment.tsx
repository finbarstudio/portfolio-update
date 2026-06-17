"use client";

/**
 * StudioEnvironment — image-based lighting generated entirely on-device.
 *
 * Replaces drei's <Environment preset="city" />, which fetched an HDR from
 * raw.githack.com at runtime. That CDN is rate-limited/unreliable (it returns
 * 403s), and when the fetch failed the loader threw inside the scene's Suspense.
 * With no error boundary above it, that single failure unmounted the whole tool
 * route — so the Mac/Phone mockups broke identically on every browser, not just
 * mobile. RoomEnvironment + PMREM needs zero network, so the tools render the
 * same everywhere and can't be taken down by a flaky CDN.
 */

import { useEffect } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    const previous = scene.environment;
    scene.environment = envTexture;
    invalidate();

    return () => {
      scene.environment = previous;
      envTexture.dispose();
      pmrem.dispose();
    };
  }, [gl, scene, invalidate]);

  return null;
}
