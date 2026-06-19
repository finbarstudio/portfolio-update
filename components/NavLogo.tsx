"use client";

/**
 * NavLogo — the persistent finbar✶studio wordmark in the nav.
 *
 * Visibility (CSS, via the .is-home modifier):
 *   - desktop home: hidden (HomeIntro's animated lockup shows instead)
 *   - mobile home + every other page: shown (static logo in the nav)
 *
 * Click behaviour:
 *   - on home: smooth-scroll to the top of the hero text (#hero)
 *   - elsewhere: navigate home, setting a one-shot flag so HomeIntro scrolls to
 *     the hero on arrival
 */

import Link from "next/link";
import BrandWordmark from "./BrandWordmark";
import { scrollToHero } from "@/lib/scroll";

export const GOTO_HERO_KEY = "finbar-goto-hero";

export default function NavLogo({ onHome = false }: { onHome?: boolean }) {
  return (
    <Link
      href="/"
      className={`nav-logo ${onHome ? "is-home" : ""}`}
      aria-label="finbarstudio — home"
      onClick={(e) => {
        if (onHome) {
          e.preventDefault();
          scrollToHero();
          return;
        }
        try { sessionStorage.setItem(GOTO_HERO_KEY, "1"); } catch { /* ignore */ }
      }}
    >
      <BrandWordmark />
    </Link>
  );
}
