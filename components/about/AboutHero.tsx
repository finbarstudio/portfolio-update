"use client";

/**
 * AboutHero — the "Nice to meet you" statement with the full headshot centred
 * over it.
 *
 *   1. The statement fades up on load.
 *   2. After a longer beat the full photo (not cropped, not isolated) fades in
 *      over the middle of the type.
 *   3. Hovering the block clears the photo so the statement can be read, then
 *      it fades back on leave.
 *
 * Reduced motion: statement shown immediately; the photo still fades but only
 * via opacity.
 */

import { useEffect, useState } from "react";
import InlineIcon from "@/components/InlineIcon";

type Token = { word?: string; icon?: string; pink?: boolean };
const TOKENS: Token[] = [
  { word: "Nice" }, { word: "to" }, { word: "meet" }, { word: "you" },
  { icon: "👪" },
  { word: "I’m" }, { word: "Finbar", pink: true },
  { icon: "⦿" },
  { word: "one" }, { word: "day" }, { word: "I" }, { word: "woke" }, { word: "up" },
  { icon: "❉" },
  { word: "and" }, { word: "found" }, { word: "my" }, { word: "feet" },
  { icon: "🮲🮳" },
  { word: "in" }, { word: "design" },
  { icon: "✎" },
  { word: "and" }, { word: "I" }, { word: "haven’t" }, { word: "moved" }, { word: "since" },
  { icon: "♡" },
];

export default function AboutHero() {
  const [shown, setShown] = useState(false);
  const [photoIn, setPhotoIn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShown(true), 80);
    // Longer beat before the photo arrives.
    const t2 = setTimeout(() => setPhotoIn(true), 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <section
      className="ah relative min-h-[78svh] flex items-center justify-center py-16 md:py-24 overflow-hidden"
      aria-label="Introduction"
    >
      <h1
        className={`ah-statement home-disc relative z-10 text-center max-w-[24ch] ${shown ? "is-in" : ""}`}
        aria-label="Nice to meet you, I'm Finbar. One day I woke up and found my feet in design and I haven't moved since."
      >
        {TOKENS.map((t, i) => (
          <span key={i}>
            {t.icon ? (
              <span className="inline-block">
                <InlineIcon char={t.icon} className="home-disc-icon" />
              </span>
            ) : (
              <span className={`inline-block whitespace-nowrap ${t.pink ? "home-disc-pink" : ""}`}>
                {t.word}
              </span>
            )}
            {i < TOKENS.length - 1 ? " " : ""}
          </span>
        ))}
      </h1>

      {/* Full photo, centred over the type; clears on hover so you can read. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/about/finbar-full.webp"
        alt=""
        aria-hidden="true"
        className={`ah-photo absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none ${photoIn ? "is-in" : ""}`}
        style={{ width: "clamp(300px, 40vw, 540px)", borderRadius: "4px" }}
      />
    </section>
  );
}
