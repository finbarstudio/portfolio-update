"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const LAUREL_PATH =
  "M56.84,5.93c2.44,1.68,5.74,3.38,8.8,2.8-.79-3.4-4.91-5.07-8-5.17A11.68,11.68,0,0,0,54.26,4a29.38,29.38,0,0,0,2.58,2M73.92,9.36c.22,3.49.92,7.37,3.42,10,2.63-3,1.38-7.41-.62-10.43A15.59,15.59,0,0,0,74,5.81a26.29,26.29,0,0,0,0,3.55m6.89,8.12c-.82,3.36-1.23,7.68.41,10.86,3.61-2.29,3.46-6.72,2.48-10.4a15.72,15.72,0,0,0-1.79-3.88,23.08,23.08,0,0,0-1.1,3.42m4.53,9.83c-1.89,3.37-3.21,6.63-2.9,10.55,0,0,.06.42.07.47a4.91,4.91,0,0,0,1.33-.47c3.25-2,4.11-5.57,4.21-9.13a16.38,16.38,0,0,0-.63-4.45,25,25,0,0,0-2.08,3m1.72,11.08c-2.64,2.48-5.57,6.16-6.08,9.86,4.53.31,7-3.75,8.29-7.52A17.26,17.26,0,0,0,90,36a24.3,24.3,0,0,0-2.94,2.38M85.67,49.56c-3.32,1.55-7.2,4.15-8.79,7.58,4.26,1.7,7.83-1.39,10.23-4.63a17.23,17.23,0,0,0,2.11-4.28,23.29,23.29,0,0,0-3.55,1.33m-4.3,10.2c-3.92.56-8,1.83-10.79,4.8,2.88,2.38,6.28,1.5,9.31-.09a16.89,16.89,0,0,0,5.29-4.91,22.07,22.07,0,0,0-3.81.2M65.12,3.38c1.15,3,3.1,6.82,6.1,8.4,1.57-3.81-.87-7.22-3.64-9.66A15.64,15.64,0,0,0,64.08,0a26.4,26.4,0,0,0,1,3.38M74.5,68.44c-3.86-.61-8.64-.46-12.07,1.6C65.07,74,70,73.35,74,71.91a17.78,17.78,0,0,0,4.3-2.54,21.3,21.3,0,0,0-3.76-.93m-7-52.33a8.32,8.32,0,0,1,5.18.93,5.93,5.93,0,0,1,2.87,3.39c-3.79,1-8.16-1-11.07-3.45a10.26,10.26,0,0,1,3-.87m4.77,6.49c3.3.37,6.75,2.72,6.92,6.3-3.74.2-7.92-3.2-10.11-6.15a10.36,10.36,0,0,1,3.19-.15m2.85,7.51c3.39,1.43,5.59,3.92,5.35,7.75,0,0-.07.39-.08.44-3.72-.8-7-5.42-8.46-8.84a10.24,10.24,0,0,1,3.19.65m.72,8.13c3,2.37,4.68,5.65,3.11,9.39-3.58-1.7-5.53-7-6.11-10.89a10.68,10.68,0,0,1,3,1.5m-1.54,7.9c2.33,2.67,3.29,7,.79,9.85-3-2.5-3.75-8.23-3.37-12a11.48,11.48,0,0,1,2.58,2.18m-3.5,6.92a8.89,8.89,0,0,1,1,4.95A6.62,6.62,0,0,1,69.14,63c-2.32-3.44-1.74-8.84-.39-12.67a12,12,0,0,1,2,2.78M61,11.05c3-1.1,7-.68,8.76,2.27-3.25,1.91-8.21.85-11.46-.75A10.14,10.14,0,0,1,61,11.05M65.64,58.7c.88,3.65-.38,8-4.16,9.4-1.52-3.65.71-9.41,2.83-12.66a12.36,12.36,0,0,1,1.33,3.26m0-49.94a35,35,0,0,1-11.3,63.58l-.25-1.15A34.35,34.35,0,0,0,81.08,37.86,34.29,34.29,0,0,0,73.7,16.22a34.88,34.88,0,0,0-8-7.46M33.16,5.93c-2.44,1.68-5.74,3.38-8.8,2.8.79-3.4,4.91-5.07,8-5.17A11.68,11.68,0,0,1,35.74,4a29.38,29.38,0,0,1-2.58,2M16.08,9.36c-.22,3.49-.92,7.37-3.42,10-2.63-3-1.38-7.41.62-10.43A15.59,15.59,0,0,1,16,5.81a26.29,26.29,0,0,1,0,3.55M9.19,17.48c.82,3.36,1.23,7.68-.41,10.86-3.61-2.29-3.46-6.72-2.48-10.4a15.72,15.72,0,0,1,1.79-3.88,23.08,23.08,0,0,1,1.1,3.42M4.66,27.31c1.89,3.37,3.21,6.63,2.9,10.55,0,0-.06.42-.07.47a4.91,4.91,0,0,1-1.33-.47c-3.25-2-4.11-5.57-4.21-9.13a16.38,16.38,0,0,1,.63-4.45,25,25,0,0,1,2.08,3M2.94,38.39C5.58,40.87,8.51,44.55,9,48.25c-4.53.31-7-3.75-8.29-7.52A17.26,17.26,0,0,1,0,36a24.3,24.3,0,0,1,2.94,2.38M4.33,49.56c3.32,1.55,7.2,4.15,8.79,7.58-4.26,1.7-7.83-1.39-10.23-4.63A17.23,17.23,0,0,1,.78,48.23a23.29,23.29,0,0,1,3.55,1.33m4.3,10.2c3.92.56,8,1.83,10.79,4.8-2.88,2.38-6.28,1.5-9.31-.09a16.89,16.89,0,0,1-5.29-4.91,22.07,22.07,0,0,1,3.81.2M24.88,3.38c-1.15,3-3.1,6.82-6.1,8.4-1.57-3.81.87-7.22,3.64-9.66A15.64,15.64,0,0,1,25.92,0a26.4,26.4,0,0,1-1,3.38M15.5,68.44c3.86-.61,8.64-.46,12.07,1.6C24.93,74,20,73.35,16,71.91a17.78,17.78,0,0,1-4.3-2.54,21.3,21.3,0,0,1,3.76-.93m7-52.33a8.32,8.32,0,0,0-5.18.93,5.93,5.93,0,0,0-2.87,3.39c3.79,1,8.16-1,11.07-3.45a10.26,10.26,0,0,0-3-.87M17.75,22.6c-3.3.37-6.75,2.72-6.92,6.3,3.74.2,7.92-3.2,10.11-6.15a10.36,10.36,0,0,0-3.19-.15M14.9,30.11C11.51,31.54,9.31,34,9.55,37.86c0,0,.07.39.08.44,3.72-.8,7-5.42,8.46-8.84a10.24,10.24,0,0,0-3.19.65m-.72,8.13c-3,2.37-4.68,5.65-3.11,9.39,3.58-1.7,5.53-7,6.11-10.89a10.68,10.68,0,0,0-3,1.5m1.54,7.9c-2.33,2.67-3.29,7-.79,9.85,3.05-2.5,3.75-8.23,3.37-12a11.48,11.48,0,0,0-2.58,2.18m3.5,6.92a8.89,8.89,0,0,0-1,4.95A6.62,6.62,0,0,0,20.86,63c2.32-3.44,1.74-8.84.39-12.67a12,12,0,0,0-2,2.78m9.76-42c-3-1.1-7-.68-8.76,2.27,3.25,1.91,8.21.85,11.46-.75A10.14,10.14,0,0,0,29,11.05M24.36,58.7c-.88,3.65.38,8,4.16,9.4,1.52-3.65-.71-9.41-2.83-12.66a12.36,12.36,0,0,0-1.33,3.26m0-49.94a34.88,34.88,0,0,0-8,7.46,34.57,34.57,0,0,0,.28,43.05A33.91,33.91,0,0,0,35.87,71.19l-.25,1.15A35.13,35.13,0,0,1,8.19,37.86,34.69,34.69,0,0,1,24.32,8.76";

interface AwardBadgeProps {
  status: "Winner" | "Finalist";
  title: string;
  subtitle?: string;
  play?: boolean;
}

export default function AwardBadge({
  status,
  title,
  subtitle,
  play = false,
}: AwardBadgeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const numRef = useRef<HTMLDivElement>(null);
  const isWinner = status === "Winner";

  // Initial hidden states (set once on mount)
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(pathRef.current, {
        strokeDashoffset: 1,
        fillOpacity: 0,
      });
      gsap.set(numRef.current, { opacity: 0, scale: 0.6 });
      gsap.set(".award-line", { yPercent: 115 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Play on reveal
  useEffect(() => {
    if (!play) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Trace the laurel outline
      tl.to(pathRef.current, {
        strokeDashoffset: 0,
        duration: 1.1,
        ease: "power2.inOut",
      })
        // 2. Fill it in
        .to(
          pathRef.current,
          { fillOpacity: 1, duration: 0.5, ease: "power2.out" },
          "-=0.25"
        )
        // 3. Number pops in
        .to(
          numRef.current,
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.3"
        )
        // 4. Text lines mask-reveal, staggered
        .to(
          ".award-line",
          { yPercent: 0, duration: 0.7, stagger: 0.12, ease: "power4.out" },
          "-=0.2"
        );
    }, rootRef);

    return () => ctx.revert();
  }, [play]);

  return (
    <div ref={rootRef} className="flex flex-col items-center gap-5 text-center">
      {/* Laurel wreath with number 1 inside */}
      <div className="relative w-52 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 90 73.04"
          className="w-full h-auto"
        >
          <path
            ref={pathRef}
            d={LAUREL_PATH}
            pathLength={1}
            fill="white"
            fillOpacity={0}
            stroke="white"
            strokeWidth={0.6}
            strokeDasharray={1}
            strokeDashoffset={1}
          />
        </svg>

        {/* Number 1 — Funnel Display */}
        <div
          ref={numRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          <span
            className="text-white leading-none"
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontWeight: 300,
              fontSize: "2.6rem",
            }}
          >
            1
          </span>
        </div>
      </div>

      {/* Text — bigger, staggered mask reveal */}
      <div className="flex flex-col items-center gap-1.5">
        <div className="overflow-hidden">
          <span
            className={`award-line block tracking-[0.3em] uppercase font-light text-xs ${
              isWinner ? "text-[#1B93D2]" : "text-white/60"
            }`}
          >
            {status}
          </span>
        </div>
        <div className="overflow-hidden">
          <p
            className="award-line block text-white font-light leading-tight tracking-wide max-w-[280px]"
            style={{
              fontFamily: "'Funnel Display', sans-serif",
              fontSize: "1.35rem",
            }}
          >
            {title}
          </p>
        </div>
        {subtitle && (
          <div className="overflow-hidden">
            <p className="award-line block text-white/55 font-light tracking-wide text-sm">
              {subtitle}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
