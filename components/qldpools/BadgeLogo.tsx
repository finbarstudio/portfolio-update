"use client";

import { useId } from "react";

/**
 * BadgeLogo — the glossy blue oval QLD Pool Installs badge (recreated as SVG
 * from the raster badge Finbar supplied, so it stays crisp at any size).
 * Inline SVG on purpose: it inherits the document's Outfit face for the text.
 * Gradient ids are namespaced per instance (useId) — the nav renders two
 * copies (mobile + desktop), and duplicate ids make url(#…) resolve into the
 * display:none copy, which paints nothing.
 */
export default function BadgeLogo({ className = "" }: { className?: string }) {
  const uid = useId();
  const rim = `${uid}rim`, face = `${uid}face`, gloss = `${uid}gloss`;
  return (
    <svg
      viewBox="0 0 330 220"
      width={330}
      height={220}
      className={className}
      role="img"
      aria-label="QLD Pool Installs"
    >
      <defs>
        {/* Rim: bright top-left falling to deep blue bottom-right */}
        <linearGradient id={rim} x1="0.25" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="#8ecbf2" />
          <stop offset="0.45" stopColor="#2f8bd6" />
          <stop offset="1" stopColor="#0a4f9b" />
        </linearGradient>
        {/* Inner face: soft radial, brightest just above centre */}
        <radialGradient id={face} cx="0.5" cy="0.32" r="0.85">
          <stop offset="0" stopColor="#a8d6f5" />
          <stop offset="0.55" stopColor="#5fa9e4" />
          <stop offset="1" stopColor="#2f7fc6" />
        </radialGradient>
        {/* Top gloss sweep on the rim */}
        <linearGradient id={gloss} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Outer edge + rim */}
      <ellipse cx="165" cy="110" rx="163" ry="108" fill={`url(#${rim})`} stroke="#0c5ba6" strokeWidth="3" />
      {/* Bottom-right inner shadow on the rim */}
      <ellipse cx="160" cy="104" rx="150" ry="99" fill="none" stroke="#0b4d8f" strokeWidth="10" opacity="0.35" />
      {/* Pale separating ring */}
      <ellipse cx="165" cy="110" rx="137" ry="90" fill="none" stroke="#eef6fc" strokeWidth="3" />
      {/* Inner face */}
      <ellipse cx="165" cy="110" rx="134" ry="87" fill={`url(#${face})`} />
      {/* Gloss highlight across the top of the face */}
      <path d="M 45 78 A 134 87 0 0 1 285 78 A 150 70 0 0 0 45 78 Z" fill={`url(#${gloss})`} />

      {/* Wordmark */}
      <text
        x="165"
        y="118"
        textAnchor="middle"
        fontFamily="var(--font-qpi), system-ui, sans-serif"
        fontWeight="800"
        fontSize="78"
        fill="#1786d3"
        stroke="#ffffff"
        strokeWidth="2.4"
        paintOrder="stroke"
        letterSpacing="2"
      >
        QLD
      </text>
      <text
        x="165"
        y="158"
        textAnchor="middle"
        fontFamily="var(--font-qpi), system-ui, sans-serif"
        fontWeight="700"
        fontSize="30"
        fill="#ffffff"
        letterSpacing="1.5"
      >
        POOL INSTALLS
      </text>
    </svg>
  );
}
