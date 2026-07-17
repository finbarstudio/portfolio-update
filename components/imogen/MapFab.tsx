"use client";

import { useEffect, useState } from "react";

/**
 * Floating "jump to the map" button. Appears once you've scrolled past the top
 * of the page; the scoped SmoothScrollScope handles the smooth anchor scroll.
 */
export default function MapFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a href="#map" className={`im-map-fab ${show ? "is-visible" : ""}`} aria-label="Jump to the map">
      <span className="im-map-fab-icon" aria-hidden="true">🗺️</span>
      <span>Map</span>
    </a>
  );
}
