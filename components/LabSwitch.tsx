"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * The lab switch, first in the nav (top left): a small digital toggle with the
 * flask in its knob. Flipping it runs one continuous move: the knob slides
 * across, a black panel sweeps the screen left to right from wherever the page
 * is scrolled, and the moment the screen is fully black the browser loads
 * lab.finbar.studio, which opens on the same fully black frame and fades its
 * content in. So the page change happens under cover and reads as one motion.
 *
 * The panel is portalled to <body>: the nav bar is transformed when it hides,
 * and a fixed element inside a transformed parent would ride with it.
 * On localhost it goes to lab.localhost on the same port (the proxy maps it).
 */

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.4 3h5.2M10.3 3v5.4L5.5 17.5A2.35 2.35 0 0 0 7.7 20.7h8.6a2.35 2.35 0 0 0 2.2-3.2L13.7 8.4V3" />
      <path d="M7.6 14.5h8.8" />
    </svg>
  );
}

const isLocal = (h: string) => h === "localhost" || h.endsWith(".localhost") || h === "127.0.0.1";

/** Where the switch goes. On localhost it stays on the same port: lab.localhost
 *  for the lab (proxy.ts maps it), plain localhost for the studio. */
function targetUrl(to: "lab" | "studio"): string {
  const { protocol, hostname, port } = window.location;
  const p = port ? `:${port}` : "";
  if (isLocal(hostname)) return to === "lab" ? `${protocol}//lab.localhost${p}/` : `${protocol}//localhost${p}/`;
  return to === "lab" ? "https://lab.finbar.studio/" : "https://www.finbar.studio/";
}

/**
 * `to="lab"` (the studio nav): starts off, flips on, a black panel sweeps in
 * from the left. `to="studio"` (the lab header): starts on (you're in the lab),
 * flips off, and the studio's white sweeps in from the right, back the way you
 * came. Either way the next page loads under full cover.
 */
export default function LabSwitch({ to = "lab", className = "" }: { to?: "lab" | "studio"; className?: string }) {
  const [leaving, setLeaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const on = to === "lab" ? leaving : !leaving;

  useEffect(() => {
    setMounted(true);
    // Coming back with the browser's back button can restore this page from
    // the back/forward cache mid-wipe: reset it so the page is usable.
    const reset = (e: PageTransitionEvent) => { if (e.persisted) setLeaving(false); };
    window.addEventListener("pageshow", reset);
    return () => window.removeEventListener("pageshow", reset);
  }, []);

  const go = () => {
    if (leaving) return;
    setLeaving(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.location.assign(targetUrl(to));
    }
  };

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={to === "lab" ? "Lab, experiments (switches to lab.finbar.studio)" : "Leave the lab (back to finbar.studio)"}
        className={`lab-switch ${className}`}
        data-on={on ? "1" : "0"}
        onClick={go}
      >
        <span className="lab-switch-track" aria-hidden="true">
          <span className="lab-switch-knob">
            <FlaskIcon />
          </span>
        </span>
        <span className="nav-tip" aria-hidden="true">{to === "lab" ? "Lab" : "finbar.studio"}</span>
      </button>
      {mounted &&
        createPortal(
          <div
            className="lab-wipe"
            data-to={to}
            data-on={leaving ? "1" : "0"}
            aria-hidden="true"
            onTransitionEnd={(e) => {
              if (leaving && e.propertyName === "clip-path") window.location.assign(targetUrl(to));
            }}
          />,
          document.body,
        )}
    </>
  );
}
