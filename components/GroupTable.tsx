"use client";

/**
 * GroupTable — England's World Cup group standings. Fetches the live table from
 * /api/wc-table (FotMob) on mount and refreshes every 60s; falls back to the
 * static table in worldcup.json if the feed is unavailable. Markup matches the
 * rest of the page: England's group teams keep their pink crest, anything else
 * uses the FotMob badge (tinted).
 */

import { useEffect, useState } from "react";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

type LiveRow = { name: string; id: number; played: number; wins: number; draws: number; losses: number; gd: number; pts: number };
type Row = { name: string; code?: string; badge?: string; p: number; w: number; d: number; l: number; gd: string; pts: number; england: boolean };

const NAME_TO_CODE: Record<string, string> = { England: "ENG", Ghana: "GHA", Panama: "PAN", Croatia: "CRO" };
const badge = (id: number) => `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
const gdStr = (n: number) => (n > 0 ? `+${n}` : `${n}`);

const STATIC: Row[] = (wc.table as { team: string; code: string; p: number; w: number; d: number; l: number; gd: string; pts: number; england?: boolean }[])
  .map((t) => ({ name: t.team, code: t.code, p: t.p, w: t.w, d: t.d, l: t.l, gd: t.gd, pts: t.pts, england: !!t.england }));

export default function GroupTable() {
  const [rows, setRows] = useState<Row[]>(STATIC);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/wc-table", { cache: "no-store" });
        const j = (await r.json()) as { ok: boolean; rows: LiveRow[] };
        if (alive && j.ok && j.rows.length) {
          setRows(j.rows.map((x) => ({
            name: x.name,
            code: NAME_TO_CODE[x.name],
            badge: badge(x.id),
            p: x.played, w: x.wins, d: x.draws, l: x.losses,
            gd: gdStr(x.gd), pts: x.pts,
            england: x.name === "England",
          })));
        }
      } catch { /* keep current */ }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return (
    <table className="wc-table">
      <thead>
        <tr>
          <th className="wc-th-team">Team</th>
          <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((t, i) => (
          <tr key={t.name} className={t.england ? "is-england" : ""}>
            <td className="wc-td-team">
              <span className="wc-pos">{i + 1}</span>
              <span className="wc-flag">
                {t.code ? (
                  <CountryFlag code={t.code} />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="wc-flag-img wc-brand-tint" src={t.badge} alt={t.name} width={21} height={14} />
                )}
              </span>
              {t.name}
            </td>
            <td>{t.p}</td><td>{t.w}</td><td>{t.d}</td><td>{t.l}</td>
            <td className="tabular-nums">{t.gd}</td>
            <td className="wc-td-pts text-pink">{t.pts}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
