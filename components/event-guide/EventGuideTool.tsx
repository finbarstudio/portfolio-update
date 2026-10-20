"use client";

import { useEffect } from "react";
import { media, corsMedia } from "@/lib/media";
import markup from "./engine/markup.js";

/**
 * The Event Guide Generator (lab.finbar.studio/event-guide): Share to Buy's Home
 * Show exhibitor and location tables, exported as InDesign files or PDFs.
 *
 * The tool itself is plain browser JavaScript kept in Share to Buy/Projects/Event
 * Guide Generator and copied into ./engine by its tools/sync-to-lab.sh. Never edit
 * ./engine here. This component only puts the markup on the page, loads the fonts
 * from the media bucket, loads the engine and starts it.
 */
const FONTS: [family: string, weight: string, file: string][] = [
  ["Share to Buy", "400", "/media/lab/pathway/share-to-buy-regular.woff2"],
  ["Share to Buy", "700", "/media/lab/pathway/share-to-buy-bold.woff2"],
  ["Caveat", "700", "/media/lab/event-guide/caveat-bold.woff2"],
];

type EngineWindow = Window & { EGG_MANUAL_START?: boolean; EGG?: { start: () => void } };

export default function EventGuideTool() {
  useEffect(() => {
    let cancelled = false;
    const w = window as unknown as EngineWindow;
    w.EGG_MANUAL_START = true;
    (async () => {
      // the engine measures text, so the fonts must be in before it starts
      await Promise.all(
        FONTS.map(async ([family, weight, file]) => {
          const face = new FontFace(family, `url("${corsMedia(media(file))}")`, { weight });
          await face.load();
          document.fonts.add(face);
        }),
      );
      // in this order: each script hangs its part off the global EGG
      await import("./engine/core.js");
      await import("./engine/generators/exhibitors.js");
      await import("./engine/generators/locations.js");
      await import("./engine/examples.js");
      await import("./engine/export/zip.js");
      await import("./engine/export/idml-template.js");
      await import("./engine/export/assets.js");
      await import("./engine/export/indesign.js");
      if (!cancelled) w.EGG?.start();
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="egg-lab">
      <div id="egg" className="app hide-bleed tables-only" dangerouslySetInnerHTML={{ __html: markup }} />
    </div>
  );
}
