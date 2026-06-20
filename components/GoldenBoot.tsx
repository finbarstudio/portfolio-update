"use client";

/**
 * GoldenBoot — World Cup top scorers, live from /api/wc-scorers (FotMob),
 * refreshed every 2 min. England scorers highlighted. Falls back to the static
 * scorer race in worldcup.json if the feed is unavailable. Markup matches the
 * static version (rank · crest · name … goals).
 */

import { useEffect, useState } from "react";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

type Scorer = { name: string; code: string; goals: number; england?: boolean };
const STATIC = wc.scorerRace as Scorer[];

export default function GoldenBoot() {
  const [rows, setRows] = useState<Scorer[]>(STATIC);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/wc-scorers", { cache: "no-store" });
        const j = (await r.json()) as { ok: boolean; scorers: Scorer[] };
        if (alive && j.ok && j.scorers.length) setRows(j.scorers);
      } catch { /* keep current */ }
    };
    load();
    const id = setInterval(load, 120000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <ul className="wc-scorers">
      {rows.map((s, i) => (
        <li key={`${s.name}-${i}`} className={`wc-scorer-row ${s.england ? "is-england" : ""}`}>
          <span className="wc-pos">{i + 1}</span>
          <span className="wc-flag"><CountryFlag code={s.code} /></span>
          <span className="wc-scorer-name">{s.name}</span>
          <span className="wc-scorer-goals text-pink">{s.goals}</span>
          <span className="wc-scorer-unit mono-label">{s.goals === 1 ? "goal" : "goals"}</span>
        </li>
      ))}
    </ul>
  );
}
