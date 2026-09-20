"use client";

import { useEffect, useRef } from "react";

/**
 * The car's name as a metal badge.
 *
 * It starts as the flat artwork, a plain <img>, which is also what stays if
 * WebGL is missing or the visitor asked for reduced motion. Once three.js has
 * loaded, a canvas fades in over it: the same artwork on a single plane, made
 * fully metallic, with a relief map so light rolls over the letters as raised
 * metal, and a studio environment for the chrome to reflect. The badge tips a
 * few degrees towards the pointer, so the reflections slide across it the way
 * they do when you walk past a car.
 *
 * One flat plane, not extruded geometry. At this size the relief map reads the
 * same as real depth, costs two triangles, and keeps Finbar's artwork exactly
 * as drawn, coloured rim included.
 *
 * THE SHEEN IS THE POINT. The badge is fully metallic, so what you see is the
 * room sliding across it, and that moving reflection is what reads as metal. A
 * pure metal is only ever as bright as the room it reflects, and a studio room
 * is mostly mid-grey, so the exposure and the reflection strength are pushed up
 * to keep it bright. The artwork lights itself only a touch (emissive, 0.1):
 * enough to lift the shadows, because any more than that paints over the
 * reflections with flat colour and the sheen disappears. That was tried.
 *
 * TWO FINISHES. `silver` leaves the metal neutral, so the artwork's white body
 * comes out chrome and its rim keeps its own colour. `brass` tints the metal,
 * so the whole badge goes warm. Set it as `heroMark.finish` in the content
 * file; adding `?finish=brass` or `?finish=silver` to the address overrides it,
 * for putting the two side by side.
 *
 * It draws only when something changes (the pointer moved, the tilt is still
 * settling) and stops otherwise, so a still page costs nothing.
 *
 * three.js is imported inside the effect, never at the top of the file, so its
 * weight is not in the page's first load and never loads at all for a visitor
 * who will not see it.
 */
export type Finish = "silver" | "brass";

/** What each finish does to the metal. `tint` multiplies the artwork's colour. */
const FINISH: Record<Finish, { tint: number; roughness: number; env: number }> = {
  silver: { tint: 0xffffff, roughness: 0.2, env: 1.75 },
  brass: { tint: 0xe0b35a, roughness: 0.26, env: 1.9 },
};

export default function DinoBadge({
  title,
  active,
}: {
  title: { image: string; normal: string; finish: Finish; alt: string; width: number; height: number };
  /** False while the hero is covered by the page, so it stops drawing. */
  active: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(active);

  useEffect(() => {
    live.current = active;
  }, [active]);

  useEffect(() => {
    const host = wrap.current;
    const cv = canvas.current;
    if (!host || !cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let dead = false;
    // Everything that needs releasing is pushed here the moment it exists, so
    // an unmount at any point, even mid-download, releases exactly what was made.
    const bin: (() => void)[] = [];
    const release = () => {
      while (bin.length) bin.pop()?.();
    };

    (async () => {
      const THREE = await import("three");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (dead) return; // nothing made yet

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return; // no WebGL: the flat artwork stays
      }
      bin.push(() => {
        renderer.dispose();
        // Browsers cap live WebGL contexts. Without this, a few hot reloads in
        // development use them up and the badge silently stops appearing.
        renderer.forceContextLoss();
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      // ACES gives metal its contrast: deep darks next to hot highlights. It also
      // pulls whites down, which the raised exposure is there to answer.
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.5;

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const room = new RoomEnvironment();
      const env = pmrem.fromScene(room, 0.04).texture;
      scene.environment = env;
      bin.push(() => {
        env.dispose();
        room.dispose();
        pmrem.dispose();
      });

      // The canvas is a little larger than the artwork (PAD) so a tilted badge
      // has room and its corners are never cut off.
      const PAD = 1.14;
      const aspect = title.width / title.height;
      const camera = new THREE.PerspectiveCamera(18, aspect, 0.1, 50);
      const planeH = 1;
      const distance = (planeH * PAD) / 2 / Math.tan((camera.fov * Math.PI) / 360);
      camera.position.set(0, 0, distance);

      const loader = new THREE.TextureLoader();
      loader.setCrossOrigin("anonymous");
      let map, normalMap;
      try {
        [map, normalMap] = await Promise.all([loader.loadAsync(title.image), loader.loadAsync(title.normal)]);
      } catch {
        return release(); // a texture would not load: the flat artwork stays
      }
      bin.push(() => {
        map.dispose();
        normalMap.dispose();
      });
      if (dead) return release();
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = normalMap.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const asked = new URLSearchParams(window.location.search).get("finish");
      const finish = FINISH[asked === "brass" || asked === "silver" ? asked : title.finish];

      const material = new THREE.MeshStandardMaterial({
        map,
        color: finish.tint,
        normalMap,
        normalScale: new THREE.Vector2(1.15, 1.15),
        metalness: 1,
        roughness: finish.roughness,
        envMapIntensity: finish.env,
        emissive: finish.tint,
        emissiveMap: map,
        emissiveIntensity: 0.1,
        transparent: true,
      });
      const geometry = new THREE.PlaneGeometry(planeH * aspect, planeH);
      bin.push(() => {
        geometry.dispose();
        material.dispose();
      });
      const badge = new THREE.Mesh(geometry, material);
      scene.add(badge);

      // A small hard light gives the bevels a travelling glint the soft room cannot.
      const glint = new THREE.DirectionalLight(0xffffff, 2.2);
      glint.position.set(-1.5, 2, 3);
      scene.add(glint);

      const size = () => {
        // offsetWidth, not getBoundingClientRect: the scroll rotates the host a
        // quarter turn, which swaps the sides of its bounding box. offsetWidth
        // is the unrotated layout size, which is the one to draw at.
        const w = host.offsetWidth;
        renderer.setSize(w * PAD, (w / aspect) * PAD, false);
      };
      size();

      let tx = 0;
      let ty = 0;
      let rx = 0;
      let ry = 0;
      let raf = 0;
      const REST_Y = -0.1; // turned a touch off square, so it never reads as flat

      const draw = () => {
        raf = 0;
        rx += (tx - rx) * 0.07;
        ry += (ty - ry) * 0.07;
        badge.rotation.set(rx, REST_Y + ry, 0);
        glint.position.set(-1.5 + ry * 14, 2 - rx * 14, 3);
        renderer.render(scene, camera);
        const settling = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.0004;
        if (settling && live.current) raf = requestAnimationFrame(draw);
      };
      const wake = () => {
        if (!raf && live.current) raf = requestAnimationFrame(draw);
      };

      const onMove = (e: PointerEvent) => {
        ty = (e.clientX / window.innerWidth - 0.5) * 0.34;
        tx = (e.clientY / window.innerHeight - 0.5) * 0.22;
        wake();
      };
      const onResize = () => {
        size();
        wake();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("resize", onResize);

      badge.rotation.y = REST_Y;
      renderer.render(scene, camera);
      host.dataset.ready = "1";

      bin.push(() => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("resize", onResize);
        cancelAnimationFrame(raf);
        delete host.dataset.ready;
      });
    })();

    return () => {
      dead = true;
      release();
    };
  }, [title.image, title.normal, title.finish, title.width, title.height]);

  return (
    <div ref={wrap} className="mt-hero-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={title.image}
        alt={title.alt}
        width={title.width}
        height={title.height}
        className="mt-hero-title-flat"
        decoding="async"
        // Must match the texture request below. On the live site the media is
        // on another domain: without this, this plain request fills the cache
        // with a copy that has no CORS headers, three.js then asks for the same
        // URL WITH CORS, is handed the cached copy, and is refused.
        crossOrigin="anonymous"
      />
      <canvas ref={canvas} className="mt-hero-title-metal" aria-hidden="true" />
    </div>
  );
}
