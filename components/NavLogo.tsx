"use client";

/**
 * NavLogo — the persistent finbar✶studio wordmark shown on every page EXCEPT
 * home (home renders the animated HomeIntro lockup instead). It sits where the
 * home logo comes to rest — centred in the nav on desktop, top-right on mobile.
 *
 * Clicking it returns to home AND lands at the top of the hero text: it sets a
 * one-shot flag that HomeIntro reads on arrival to smooth-scroll to #hero.
 */

import Link from "next/link";
import BrandWordmark from "./BrandWordmark";

export const GOTO_HERO_KEY = "finbar-goto-hero";

export default function NavLogo() {
  return (
    <Link
      href="/"
      className="nav-logo"
      aria-label="finbarstudio — home"
      onClick={() => {
        try { sessionStorage.setItem(GOTO_HERO_KEY, "1"); } catch { /* ignore */ }
      }}
    >
      <BrandWordmark />
    </Link>
  );
}
