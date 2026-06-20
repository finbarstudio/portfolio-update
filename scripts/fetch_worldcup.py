#!/usr/bin/env python3
"""
fetch_worldcup.py — populate content/worldcup.json from FBref via soccerData.

The portfolio is a static build, so there's no live data at runtime: run this
locally (or in CI before `next build`) to refresh the snapshot, then commit/deploy.

    pip install soccerdata
    python scripts/fetch_worldcup.py

soccerData scrapes public FBref (no credentials needed). The exact season key and
table shapes for the in-progress 2026 World Cup may need a tweak once those pages
exist on FBref — adjust LEAGUE/SEASON and the parsing below to match. The JSON
shape this writes is what app/(site)/world-cup/page.tsx + StartingEleven expect.
"""

import json
from pathlib import Path

import soccerdata as sd

LEAGUE = "INT-World Cup"   # soccerData league id; confirm via sd.FBref.available_leagues()
SEASON = "2026"
TEAM = "England"
OUT = Path(__file__).resolve().parent.parent / "content" / "worldcup.json"


def main() -> None:
    fb = sd.FBref(leagues=LEAGUE, seasons=SEASON)

    # --- Group standings -------------------------------------------------
    standings = fb.read_team_season_stats(stat_type="standard")  # adjust as needed
    # Locate England's row; map to position / P-W-D-L / pts / GD.
    # (FBref column names vary by table — print(standings.columns) to inspect.)

    # --- Schedule / results ---------------------------------------------
    sched = fb.read_schedule()
    eng = sched[(sched["home_team"] == TEAM) | (sched["away_team"] == TEAM)]
    played = eng[eng["score"].notna()]
    upcoming = eng[eng["score"].isna()].sort_values("date")

    # --- Top scorer ------------------------------------------------------
    scorers = fb.read_player_season_stats(stat_type="standard")
    eng_scorers = scorers.xs(TEAM, level="team", drop_level=False)
    top = eng_scorers.sort_values(("Performance", "Gls"), ascending=False).iloc[0]

    # Assemble. Fill the structures from the frames above; the lineup is editorial
    # (FBref doesn't publish a projected XI), so it's kept/curated by hand.
    existing = json.loads(OUT.read_text())
    data = {
        **existing,
        # Example wiring — replace the right-hand sides with parsed values:
        # "position": int(row["Rk"]),
        # "points": int(row["Pts"]),
        # "topScorer": {"name": top.name[-1], "goals": int(top[("Performance", "Gls")])},
        # "recent": [...], "next": {...},
    }

    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
