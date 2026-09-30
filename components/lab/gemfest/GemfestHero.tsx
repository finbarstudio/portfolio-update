"use client";

import { useEffect, useRef } from "react";
import { media } from "@/lib/media";
import { initGemfestHero } from "@/components/lab/gemfest/hero";
import { LOGO_CLIP_PATH } from "@/components/lab/gemfest/logo-clip";

const LOGO = media("/media/lab/gemfest/logo.svg");
const VIDEO = media("/media/lab/gemfest/hero-web.mp4");
const GRAIN = media("/media/lab/gemfest/noise.webp");

/**
 * GemfestHero — the GemFest hero sequence and nothing else: the icon
 * constellation, scrolling into the logo-shaped window, into the video playing
 * inside it. Then it ends. The markup mirrors the standalone site's hero; the
 * logic lives in ./hero.ts and is scoped to this container by the effect.
 *
 * GemFest keeps its original white ground (the rest of the lab is black). The
 * sequence is held at opacity 0 (lb-fade-only) until LabRoot marks the page
 * ready, then fades in.
 */
export default function GemfestHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return initGemfestHero(root);
  }, []);

  return (
    <div
      ref={rootRef}
      className="lab-gemfest lb-fade-only"
      style={{ background: "#fff" }}
    >
      {/* logo geometry as a clipPath: the video window is clipped with THIS
          (iOS won't reliably mask-image live video; clipping is geometry and
          works) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="gfLogoClip" clipPathUnits="objectBoundingBox">
            <path d={LOGO_CLIP_PATH} />
          </clipPath>
        </defs>
      </svg>

      <div className="gf-preloader" data-gf="preloader">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={LOGO} alt="GemFest" className="gf-preloader__logo" data-gf="preLogo" />
      </div>

      <section className="gf-hero" data-gf="hero">
        <div className="gf-sticky" data-gf="sticky">
          {/* video seen through the logo-shaped window; mirrored copies fill the sides */}
          <div className="gf-video-mask" data-gf="mask">
            <div className="clip-window" data-gf="clipWin">
              <div className="clip-inner" data-gf="clipInner">
                <div className="gf-strip" data-gf="strip">
                  {/* enlarged mirror layer behind */}
                  <div className="strip-mirror">
                    <div className="vreflect vreflect--left">
                      <div className="vreflect vreflect--right">
                        <video
                          className="gf-video"
                          data-gf="vSlave"
                          src={VIDEO}
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                  {/* sharp central video in front, grows on scroll */}
                  <div className="strip-center" data-gf="stripCenter">
                    <video
                      className="gf-video"
                      data-gf="vMain"
                      src={VIDEO}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      aria-label="GemFest festival footage"
                    />
                  </div>
                  {/* progressive blur: light near centre, heavier to viewport edge */}
                  <div className="pblur pblur--1" aria-hidden="true" />
                  <div className="pblur pblur--2" aria-hidden="true" />
                  <div className="pblur pblur--3" aria-hidden="true" />
                  <div className="pblur pblur--4" aria-hidden="true" />
                  {/* vignette lives inside the window: video-only */}
                  <div className="vignette" aria-hidden="true" />
                </div>
              </div>
            </div>
          </div>

          {/* the WebGL canvas (icon field) is inserted here by hero.ts, before the grain */}

          {/* subtle noise grain */}
          <div
            className="gf-grain"
            data-gf="grain"
            aria-hidden="true"
            style={{ backgroundImage: `url(${GRAIN})` }}
          />
        </div>
      </section>
    </div>
  );
}
