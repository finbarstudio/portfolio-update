import type Lenis from "lenis";

// The single Lenis smooth-scroll instance lives on window (created in
// components/SmoothScroll.tsx) so the menu tag and the intro preloader can
// steer it from anywhere.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export {};
