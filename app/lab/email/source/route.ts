import { NextResponse } from "next/server";
import { isPreviewUrl } from "@/lib/email-extract";

/**
 * Fetches a sending platform's "view online" page for the email check tool,
 * which cannot read it from the browser (no CORS). Only hosts in
 * PREVIEW_HOSTS are allowed, so this is not a general proxy. The page comes
 * back as text; the extraction happens in the browser.
 */
const MAX_BYTES = 2 * 1024 * 1024;

export async function GET(request: Request): Promise<Response> {
  const target = isPreviewUrl(new URL(request.url).searchParams.get("url") ?? "");
  if (!target) return NextResponse.json({ error: "Only ActiveCampaign preview links can be fetched." }, { status: 400 });

  try {
    const res = await fetch(target, {
      headers: { "user-agent": "Mozilla/5.0 (compatible; finbar.studio email check)", accept: "text/html" },
      signal: AbortSignal.timeout(15_000),
      redirect: "follow",
    });
    if (!res.ok) return NextResponse.json({ error: `The page answered ${res.status}.` }, { status: 502 });
    const length = Number(res.headers.get("content-length") ?? 0);
    if (length > MAX_BYTES) return NextResponse.json({ error: "The page is too large." }, { status: 502 });
    const html = await res.text();
    if (html.length > MAX_BYTES) return NextResponse.json({ error: "The page is too large." }, { status: 502 });
    return new NextResponse(html, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "The page could not be fetched." }, { status: 502 });
  }
}
