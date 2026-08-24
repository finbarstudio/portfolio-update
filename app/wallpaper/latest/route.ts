import { NextResponse } from "next/server";

/**
 * /wallpaper/latest — tiny proxy for the Himawari-9 "latest image" timestamp.
 *
 * The wallpaper page needs to know which 10-minute slot to pull tiles for.
 * The tiles themselves load straight from NICT in plain <img> tags (no CORS
 * involved), but reading latest.json from the browser IS a CORS fetch, so
 * that one hop goes through us. Cached ~4 minutes: half the satellite's
 * cadence, so a new frame is picked up promptly without hammering NICT.
 *
 * If NICT is unreachable, fall back to the wall clock: full-disk imagery is
 * published roughly 15–20 minutes behind real time, so "now minus 20 min,
 * floored to 10" is always a slot that exists.
 */

export const dynamic = "force-dynamic";

const LATEST_URL = "https://himawari8.nict.go.jp/img/D531106/latest.json";

function fallbackDate(): string {
  const t = new Date(Date.now() - 20 * 60 * 1000);
  t.setUTCMinutes(Math.floor(t.getUTCMinutes() / 10) * 10, 0, 0);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${t.getUTCFullYear()}-${p(t.getUTCMonth() + 1)}-${p(t.getUTCDate())} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}:00`;
}

export async function GET() {
  let date = fallbackDate();
  try {
    const res = await fetch(LATEST_URL, {
      next: { revalidate: 240 },
      signal: AbortSignal.timeout(5000),
    });
    if (res.ok) {
      const json = (await res.json()) as { date?: string };
      if (json.date) date = json.date;
    }
  } catch {
    // NICT unreachable — the wall-clock fallback stands.
  }
  return NextResponse.json(
    { date },
    { headers: { "Cache-Control": "public, s-maxage=240, max-age=60" } },
  );
}
