import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * Sanity publish webhook → on-demand cache bust. Finbar points a webhook
 * (Manage → API → Webhooks) at /api/revalidate?secret=... on create/update/
 * delete of a post. We verify the secret, then revalidateTag("post") so the
 * built /journal pages refetch once, right after a publish — instead of
 * hitting Sanity per visitor. Gated on SANITY_REVALIDATE_SECRET.
 */

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  if (!SECRET) return NextResponse.json({ error: "not configured" }, { status: 503 });

  const provided = new URL(req.url).searchParams.get("secret") ?? "";
  const a = Buffer.from(provided);
  const b = Buffer.from(SECRET);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Next 16 requires a cache-life profile arg; expire:0 busts entries now.
  revalidateTag("post", { expire: 0 });
  return NextResponse.json({ revalidated: true, tag: "post" });
}

// Simple GET diagnostic (no secret leak): reports whether the hook is armed.
export function GET() {
  return NextResponse.json({ configured: Boolean(SECRET) });
}
