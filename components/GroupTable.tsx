"use client";

/**
 * GroupTable — World Cup group standings with a tab per group. Fetches all
 * groups live from /api/wc-table (FotMob), defaulting to England's group, and
 * refreshes every 60s. Falls back to England's static group from worldcup.json
 * when the feed is unavailable (a single tab). Team crests use the FotMob badge
 * (tinted) live, the pink crest for the static fallback.
 */

import { useEffect, useRef, useState } from "react";
import CountryFlag from "@/components/CountryFlag";
import wc from "@/content/worldcup.json";

type Team = { name: string; id?: number; code?: string; p: number; w: number; d: number; l: number; gd: string; pts: number; england: boolean };
type Group = { letter: string; teams: Team[] };

const badge = (id: number) => `https://images.fotmob.com/image_resources/logo/teamlogo/${id}.png`;
const gdStr = (n: number) => (n > 0 ? `+${n}` : `${n}`);

// Fallback: England's group only (single tab), with pink crests.
const STATIC_GROUPS: Group[] = [{
  letter: (wc.group as string).replace(/group/i, "").trim() || "L",
  teams: (wc.table as { team: string; code: string; p: number; w: number; d: number; l: number; gd: string; pts: number; england?: boolean }[])
    .map((t) => ({ name: t.team, code: t.code, p: t.p, w: t.w, d: t.d, l: t.l, gd: t.gd, pts: t.pts, england: !!t.england })),
}];

export default function GroupTable() {
  const [groups, setGroups] = useState<Group[]>(STATIC_GROUPS);
  const [active, setActive] = useState(0);
  const touched = useRef(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const r = await fetch("/api/wc-table", { cache: "no-store" });
        const j = (await r.json()) as { ok: boolean; defaultIndex: number; groups: { letter: string; teams: { name: string; id: number; p: number; w: number; d: number; l: number; gd: number; pts: number }[] }[] };
        if (alive && j.ok && j.groups.length) {
          setGroups(j.groups.map((g) => ({
            letter: g.letter,
            teams: g.teams.map((t) => ({ name: t.name, id: t.id, p: t.p, w: t.w, d: t.d, l: t.l, gd: gdStr(t.gd), pts: t.pts, england: t.name === "England" })),
          })));
          if (!touched.current) setActive(j.defaultIndex);
        }
      } catch { /* keep current */ }
    };
    load();
    const id = setInterval(load, 60000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const group = groups[Math.min(active, groups.length - 1)];

  return (
    <div>
      {groups.length > 1 && (
        <div className="wc-grp-tabs" role="tablist" aria-label="Groups">
          {groups.map((g, i) => (
            <button
              key={g.letter}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`tag ${i === active ? "tag-pink" : "tag-default"}`}
              onClick={() => { touched.current = true; setActive(i); }}
            >
              {g.letter}
            </button>
          ))}
        </div>
      )}
      <table className="wc-table">
        <thead>
          <tr>
            <th className="wc-th-team">Group {group.letter}</th>
            <th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {group.teams.map((t, i) => (
            <tr key={t.name} className={t.england ? "is-england" : ""}>
              <td className="wc-td-team">
                <span className="wc-pos">{i + 1}</span>
                <span className="wc-flag">
                  {t.code ? (
                    <CountryFlag code={t.code} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="wc-flag-img wc-brand-tint" src={badge(t.id!)} alt={t.name} width={21} height={14} />
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
    </div>
  );
}
