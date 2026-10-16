"use client";

/**
 * The portfolio's print view: the page at portfolio.finbar.studio/?print, which
 * scripts/portfolio-pdf.mjs prints to the downloadable PDF. In it every clip
 * shows a still instead of playing (a frame chosen per clip in
 * content/portfolio-print.json, cut by the same script), and the two live 3D
 * pieces show a still of themselves. Nothing loads that a PDF cannot hold.
 */

import { useEffect, useState, useSyncExternalStore } from "react";
import { corsMedia, media } from "@/lib/media";

const never = () => () => {};

/** True on the print view (?print in the address). False on the server, so the first render matches. */
export function usePrintView() {
  return useSyncExternalStore(never, () => new URLSearchParams(window.location.search).has("print"), () => false);
}

/** Where the print still of a clip lives: portfolio/lows/macbook.webm -> portfolio/print/lows-macbook.webp (the script names them the same way). */
export function printStill(src: string) {
  const path = src.replace(/^.*?\/images\//, "").replace(/\?.*$/, "");
  return media(`/media/images/portfolio/print/${stillName(path)}`);
}

export function stillName(path: string) {
  return `${path.replace(/^portfolio\//, "").replace(/\.(webm|mp4)$/, "").replace(/\//g, "-")}.webp`;
}

/**
 * The print view's copy of an image, as a JPEG (at most `max` px wide). Chrome
 * keeps a JPEG as it is inside a PDF but stores any other image (WebP, PNG)
 * uncompressed, which made the PDF about 36 MB. An image with transparent
 * corners (a logo) is left as it is, since a JPEG cannot hold transparency.
 * Null until it is ready; pass null to skip.
 */
export function usePrintJpeg(src: string | null, max = 1700) {
  const [jpeg, setJpeg] = useState<{ src: string; out: string } | null>(null);
  useEffect(() => {
    if (!src) return;
    let live = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const k = Math.min(1, max / img.naturalWidth);
      const c = document.createElement("canvas");
      c.width = Math.round(img.naturalWidth * k);
      c.height = Math.round(img.naturalHeight * k);
      const g = c.getContext("2d", { willReadFrequently: true });
      let out = src;
      if (g) {
        g.drawImage(img, 0, 0, c.width, c.height);
        const corners = [[0, 0], [c.width - 1, 0], [0, c.height - 1], [c.width - 1, c.height - 1]];
        const clear = corners.some(([x, y]) => g.getImageData(x, y, 1, 1).data[3] < 255);
        if (!clear) out = c.toDataURL("image/jpeg", 0.84);
      }
      if (live) setJpeg({ src, out });
    };
    img.onerror = () => live && setJpeg({ src, out: src });
    img.src = corsMedia(src);
    return () => {
      live = false;
    };
  }, [src, max]);
  return src && jpeg?.src === src ? jpeg.out : null;
}

/** Stills of the live pieces (the two 3D ones and the car grid), screenshots of them at desktop size. */
export const PRINT_POSTER = {
  globe: media("/media/images/portfolio/print/globe.webp"),
  phones: media("/media/images/portfolio/print/phones.webp"),
  // the Rennen Plus car grid: drawn from one sprite, which a PDF would hold once for every car
  cars: media("/media/images/portfolio/print/cars.webp"),
};
