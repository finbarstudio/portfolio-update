"use client";

import { useEffect } from "react";

/**
 * Turns on native smooth scrolling for in-page anchor jumps (tap a map pin →
 * glide to its card) only while the /imogen page is mounted. Restores the
 * previous value on unmount so it never leaks onto the main site.
 */
export default function SmoothScrollScope() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const html = document.documentElement;
    const prev = html.style.scrollBehavior;
    html.style.scrollBehavior = "smooth";
    return () => {
      html.style.scrollBehavior = prev;
    };
  }, []);
  return null;
}
