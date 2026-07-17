"use client";

/**
 * MetaPixel — fires PageView on load and on every App Router navigation,
 * through BOTH channels (browser fbq + the /api/meta server relay) with a
 * shared event_id so Meta counts each once. See lib/meta.ts.
 *
 * The base snippet in the root layout's <head> does init ONLY — the tracks
 * all come from here, so every PageView carries an event_id and dedups
 * cleanly against its Conversions API twin.
 *
 * /free-redesign layers a Schedule conversion on top (see FreeRedesign) —
 * that's what Meta optimises ad delivery against; PageViews build the
 * retargeting audience.
 */

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { trackMeta } from "@/lib/meta";

export default function MetaPixel() {
  const pathname = usePathname();

  useEffect(() => {
    trackMeta("PageView");
  }, [pathname]);

  return null;
}
