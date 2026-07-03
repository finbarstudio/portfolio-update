import { NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

// Dev-only: the /toombul?edit=1 collage editor POSTs the arranged positions
// here and we write them back to content/toombul-collage.json. Disabled in
// production (the layout is baked into the committed JSON).

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Pos = { key: string; x: number; y: number; w: number; rot: number };

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  if (!Array.isArray(body) || !body.every(isPos)) {
    return NextResponse.json({ ok: false, error: "bad shape" }, { status: 400 });
  }
  const file = path.join(process.cwd(), "content", "toombul-collage.json");
  await fs.writeFile(file, JSON.stringify(body, null, 2) + "\n", "utf8");
  return NextResponse.json({ ok: true });
}

function isPos(v: unknown): v is Pos {
  const o = v as Pos;
  return (
    !!o && typeof o.key === "string" &&
    ["x", "y", "w", "rot"].every((k) => typeof (o as Record<string, unknown>)[k] === "number")
  );
}
