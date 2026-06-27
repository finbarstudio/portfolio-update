"use client";

/**
 * About — magazine treatment, real Braeden story (Mick Devlin, est. 1996, Noosa
 * hinterland; deal-direct, award record). Minimal type intro → a full-bleed
 * blur-up photo with a corner caption → the philosophy band → a mono recognition
 * ledger. No invented history (the old page was a stale A Rolley clone).
 */

import { useEffect, useState, type CSSProperties } from "react";
import { playOnIntro } from "../intro";
import { useReveal } from "../useReveal";
import BlurImage from "../BlurImage";
import Story from "../home/Story";
import { PROJECT_LQIP } from "../projects/lqip";

const d = (s: string): CSSProperties => ({ ["--reveal-delay"]: s } as CSSProperties);

function Intro() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(true);
    return playOnIntro(() => setShown(true));
  }, []);
  const rv = shown ? "1" : undefined;
  return (
    <section className="brd-projects-hero">
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>About</p>
      <h1 className="brd-projects-title brd-mask" data-revealed={rv} style={d("0.1s")}>
        Braeden is Mick Devlin.
      </h1>
      <p className="brd-projects-sub brd-mask" data-revealed={rv} style={d("0.22s")}>
        Mick started Braeden in 1996 and has spent three decades building custom homes across Noosa
        and the Sunshine Coast hinterland. On every build you deal directly with Mick, start to finish.
      </p>
    </section>
  );
}

function PhotoBand() {
  return (
    <section className="bx-hero bx-about-photo" data-tone="dark">
      <BlurImage
        src="/braeden/projects/river-haven.webp"
        lqip={PROJECT_LQIP["river-haven"] ?? ""}
        alt="River Haven, a Braeden Constructions home in Noosa"
        imgClassName="bx-ken"
        priority
      />
      <div className="bx-scrim-full" aria-hidden />
      <div className="bx-j">
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-bl">River Haven · Noosa</span>
        <span className="ff-mono bx-eyebrow bx-on-img bx-j-br">Custom home</span>
      </div>
    </section>
  );
}

const RECOGNITION: [string, string][] = [
  ["2010", "First Sunshine Coast builder to win the MBA National Master Builder of the Year + National House of the Year"],
  ["5×", "House of the Year, Sunshine Coast"],
  ["2025", "MBA Sunshine Coast — Best Individual Home + Best Residential Kitchen, for Riverside (Noosaville)"],
  ["QLD", "Modern Thai House, Noosa Heads — MBA Queensland House of the Year"],
];

function Recognition() {
  const { ref, shown } = useReveal<HTMLElement>();
  const rv = shown ? "1" : undefined;
  return (
    <section className="brd-band brd-about-rec" style={{ background: "var(--paper-2)" }} ref={ref}>
      <p className="eyebrow brd-mask" data-revealed={rv} style={d("0s")}>Recognition</p>
      <div className="brd-rec-ledger">
        {RECOGNITION.map(([k, v], i) => (
          <div key={k + i} className="brd-rec-row brd-mask" data-revealed={rv} style={d(`${0.1 + i * 0.06}s`)}>
            <span className="ff-mono brd-rec-key">{k}</span>
            <span className="brd-rec-val">{v}</span>
          </div>
        ))}
      </div>
      <p className="ff-mono brd-rec-foot brd-mask" data-revealed={rv} style={d("0.42s")}>
        QBCC 1017247 · MBA member #19831 · Master Builders Queensland
      </p>
    </section>
  );
}

export default function AboutContent() {
  return (
    <>
      <Intro />
      <PhotoBand />
      <Story />
      <Recognition />
    </>
  );
}
