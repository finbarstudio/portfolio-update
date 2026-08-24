"use client";

import { usePathname } from "next/navigation";

/**
 * CookieNotice — a small, informational cookie/tracking notice. The Meta pixel
 * fires regardless (Finbar chose an informational notice, not consent-gating);
 * this just tells visitors and links the policy, per the "notice" requirement.
 * Dismissed once, remembered on the device (localStorage). Mounted-guarded so
 * it never flashes during SSR/hydration, and sits bottom-left to clear the
 * bottom-right "Get a quote" pin.
 */

import { useEffect, useState } from "react";
import { MdOpenInNew } from "./MaterialIcon";

const KEY = "cookie-notice-dismissed";

export default function CookieNotice() {
  // The homepage stays clean, and /wallpaper is literally a wallpaper (Plash
  // renders it with no one to click) — the notice shows everywhere else.
  const pathname = usePathname();
  const onHome = pathname === "/" || pathname.startsWith("/wallpaper");

  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) !== "1") setShow(true);
    } catch {
      /* storage blocked — just don't show */
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
    setShow(false);
  };

  if (onHome) return null;
  return (
    <div className="cookie-notice" role="region" aria-label="Cookie notice">
      <p className="cookie-notice-text">
        This site uses the Meta pixel to measure ads. See the{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer" className="cookie-notice-link u-underline">
          privacy policy{" "}<MdOpenInNew size={13} className="cookie-notice-newtab" />
        </a>{" "}for what&rsquo;s collected and how to opt out.
      </p>
      <button type="button" className="cookie-notice-btn" onClick={dismiss}>Got it</button>
    </div>
  );
}
