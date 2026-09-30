"use client";

import { useEffect, useState } from "react";

/**
 * LabRoot — the lab's black opening state. The server HTML (and the first
 * client render) is a fully black page with nothing visible: every `.lb-fade`
 * child sits at opacity 0. Once mounted, `is-in` is added and the content
 * fades/rises in (lab.css), staggered by each child's `--i`. This matches the
 * main site's wipe-to-black, so the handoff between pages has no flash.
 *
 * Two frames of delay so the opacity-0 state is actually painted before the
 * transition starts (otherwise the browser skips the fade).
 */
export default function LabRoot({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let id2 = 0;
    const id1 = requestAnimationFrame(() => {
      id2 = requestAnimationFrame(() => setReady(true));
    });
    return () => {
      cancelAnimationFrame(id1);
      cancelAnimationFrame(id2);
    };
  }, []);

  return (
    <div className={`lb-root${ready ? " is-in" : ""}`} style={{ background: "#000" }}>
      {/* no-JS: never leave the page stuck on black */}
      <noscript>
        <style>{".lb-fade{opacity:1 !important;transform:none !important}"}</style>
      </noscript>
      {children}
    </div>
  );
}
