import type { ReactNode } from "react";

/**
 * Shared assets + copy for the QPI hero gallery (app/qldpools/site/heroes).
 * Every hero option imports from here so the picking gallery stays consistent.
 */
export const HERO_SRC = "/qldpools/hero.jpg";
export const LOGO_WHITE = "/qldpools/logo-white.png";
export const LOGO_DARK = "/qldpools/logo.png";

export const TAGLINE = "Queensland's Premium Pool Builders";
export const SUB =
  "Fibreglass & concrete pool installations across Brisbane, Gold Coast & Sunshine Coast.";
export const PHONE = "0423 123 248";
export const PHONE_HREF = "tel:+61423123248";

export const ACCOLADES = [
  { primary: "QBCC & NSW Licensed", secondary: "Fully Insured" },
  { primary: "2500+ Pools", secondary: "Installed & Loved" },
  { primary: "20+ Years", secondary: "Industry Experience" },
] as const;

/** One hero option: a short name + the section node that fills a viewport frame. */
export type Hero = { name: string; node: ReactNode };
