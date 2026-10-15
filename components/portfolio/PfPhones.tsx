"use client";

/**
 * The Moment You Realise in the portfolio: the same live 3D iPhone carousel the
 * case study opens with, reading its model and reels from the project content
 * so the two never drift apart.
 *
 * The phones stand in one straight row, all the same size and close together,
 * sliding along past the frame's edges (PhoneScene's `strip` mode), and
 * there is no hover. On a desktop the frame runs to the page's left and
 * right edges at the usual height (portfolio.css), so the line has room; the
 * phones stay the same size. On a phone the page is 4:5 (see the piece's
 * `mobile` shape in content/portfolio.ts) and the camera sits a little closer. If iOS will not
 * start the reels on its own, a Play button shows and a tap starts them.
 */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader";
import { projects } from "@/content/projects";

// r3f and WebGL only run in the browser
const PhoneScene = dynamic(() => import("@/components/phone/PhoneScene"), {
  ssr: false,
  loading: () => <Loader bare />,
});

const phones = projects.find((p) => p.slug === "tmyr")?.heroPhones;
// camera: pulled back on a desktop so the row runs across the whole frame,
// a little closer on a phone's 4:5 page
const ZOOM = { wide: 0.8, phone: 1.15 };
// centre to centre, in world units (a phone is about 0.1 wide)
const SPACING = 0.125;

export default function PfPhones() {
  // the camera is set when the scene mounts, so wait until the width is known
  const [isPhone, setIsPhone] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const read = () => setIsPhone(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);

  if (!phones || isPhone === null) return null;
  return (
    <div className="pf-phones">
      <PhoneScene
        key={isPhone ? "phone" : "wide"}
        model={phones.model}
        media={phones.videos.map((src) => ({ kind: "video" as const, src }))}
        fit="stretch"
        background="transparent"
        poster={phones.poster}
        fill
        hoverable={false}
        strip={SPACING}
        zoom={isPhone ? ZOOM.phone : ZOOM.wide}
        tapToPlayClass="pf-play pf-mono"
      />
    </div>
  );
}
