#!/usr/bin/env python3
"""
fetch_worldcup.py — populate content/worldcup.json from football-data.org (v4).

The portfolio is a static build, so run this to refresh the snapshot (locally or in
CI before `next build`), then commit/deploy. Set your API key in the environment:

    export FOOTBALL_DATA_KEY=xxxxxxxx
    python scripts/fetch_worldcup.py

It pulls England's group standings, the scorer race and their recent/next matches,
downloads each involved nation's flag SVG into public/flags/, and writes the JSON
the page expects. The projected XI + formation are editorial and left untouched.
Free tier is ~10 requests/min; this makes 3 API calls.
"""

import json
import os
import urllib.request
from datetime import datetime
from pathlib import Path

KEY = os.environ.get("FOOTBALL_DATA_KEY")
TEAM = "England"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "content" / "worldcup.json"
FLAGS = ROOT / "public" / "flags"


def api(path: str):
    req = urllib.request.Request("https://api.football-data.org/v4" + path, headers={"X-Auth-Token": KEY})
    return json.load(urllib.request.urlopen(req, timeout=30))


def gd(n: int) -> str:
    return f"+{n}" if n > 0 else str(n)


def short_date(iso: str) -> str:
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).strftime("%-d %b")


def main() -> None:
    if not KEY:
        raise SystemExit("Set FOOTBALL_DATA_KEY in the environment first.")

    crests: dict[str, str] = {}  # tla -> crest (flag) url

    # --- Standings: find England's group ---------------------------------
    standings = api("/competitions/WC/standings")
    group = next(
        (g for g in standings["standings"]
         if any(r["team"]["name"] == TEAM for r in g["table"])),
        None,
    )
    if not group:
        raise SystemExit("England not found in standings yet.")

    table = []
    eng_row = None
    for r in group["table"]:
        t = r["team"]
        crests[t["tla"]] = t["crest"]
        is_eng = t["name"] == TEAM
        row = {
            "team": t["name"], "code": t["tla"],
            "p": r["playedGames"], "w": r["won"], "d": r["draw"], "l": r["lost"],
            "gd": gd(r["goalDifference"]), "pts": r["points"],
        }
        if is_eng:
            row["england"] = True
            eng_row = r
        table.append(row)

    # --- Scorer race: top contenders + England's best --------------------
    scorers = api("/competitions/WC/scorers?limit=30").get("scorers", [])
    race = []
    for s in scorers:
        t = s["team"]
        crests.setdefault(t["tla"], t["crest"])
    top = scorers[:3]
    eng_scorer = next((s for s in scorers if s["team"]["name"] == TEAM), None)
    chosen = top + ([eng_scorer] if eng_scorer and eng_scorer not in top else [])
    for s in chosen:
        race.append({
            "name": s["player"]["name"], "code": s["team"]["tla"],
            "goals": s.get("goals") or 0,
            **({"england": True} if s["team"]["name"] == TEAM else {}),
        })

    # --- Matches: recent (finished) + next (scheduled) -------------------
    matches = api("/competitions/WC/matches")["matches"]
    eng_matches = [m for m in matches if TEAM in (m["homeTeam"]["name"], m["awayTeam"]["name"])]
    fixtures, nxt = [], None
    for m in eng_matches:
        home, away = m["homeTeam"], m["awayTeam"]
        opp = away if home["name"] == TEAM else home
        crests.setdefault(opp["tla"], opp["crest"])
        if m["status"] == "FINISHED":
            ft = m["score"]["fullTime"]
            eg, og = (ft["home"], ft["away"]) if home["name"] == TEAM else (ft["away"], ft["home"])
            fixtures.append({
                "date": short_date(m["utcDate"]), "opponent": opp["name"], "code": opp["tla"],
                "score": f"{eg}–{og}", "result": "W" if eg > og else "L" if eg < og else "D",
                "status": "played",
            })
        elif m["status"] in ("TIMED", "SCHEDULED"):
            fixtures.append({
                "date": short_date(m["utcDate"]), "opponent": opp["name"], "code": opp["tla"],
                "kickoff": m["utcDate"], "status": "upcoming",
            })
            if nxt is None:
                nxt = {"opponent": opp["name"], "code": opp["tla"],
                       "venue": m.get("venue") or "TBC", "kickoff": m["utcDate"]}

    # --- Download flags (national crests) --------------------------------
    FLAGS.mkdir(parents=True, exist_ok=True)
    for tla, url in crests.items():
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            (FLAGS / f"{tla.lower()}.svg").write_bytes(urllib.request.urlopen(req, timeout=20).read())
        except Exception as e:  # noqa: BLE001
            print(f"  flag {tla} failed: {e}")

    # --- Merge + write (keep editorial lineup/formation) -----------------
    data = json.loads(OUT.read_text())
    data.update({
        "competition": "FIFA World Cup 2026",
        "group": group["group"],
        "position": eng_row["position"],
        "played": eng_row["playedGames"], "won": eng_row["won"],
        "drawn": eng_row["draw"], "lost": eng_row["lost"],
        "points": eng_row["points"], "goalDiff": gd(eng_row["goalDifference"]),
        "scorerRace": race, "table": table,
        # Last few finished + the upcoming fixtures, in chronological order.
        "fixtures": [f for f in fixtures if f["status"] == "played"][-3:]
                    + [f for f in fixtures if f["status"] == "upcoming"][:2],
    })
    data.pop("recent", None)
    if nxt:
        data["next"] = nxt
    data.pop("_note", None)

    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUT}  (group {group['group']}, {len(table)} teams, {len(race)} scorers, {len(fixtures)} fixtures, flags: {len(crests)})")


if __name__ == "__main__":
    main()
