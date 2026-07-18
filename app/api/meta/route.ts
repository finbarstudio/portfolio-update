import { NextRequest, NextResponse } from "next/server";
import { META_PIXEL_ID } from "@/lib/meta-const";

/**
 * /api/meta — same-origin relay to Meta's Conversions API (server events).
 *
 * The browser pixel is fragile: ad blockers, Safari/Firefox tracking
 * prevention, and some in-app WebViews block connect.facebook.net outright.
 * This route is same-origin so nothing blocks it; it forwards each event to
 * graph.facebook.com with the visitor's IP, UA and _fbp/_fbc cookies so Meta
 * can match it, and shares the client's event_id so Meta deduplicates against
 * the browser copy when both arrive.
 *
 * Gated on META_CONVERSIONS_API_TOKEN (Events Manager → Settings →
 * Conversions API → Generate access token → Vercel env → redeploy). Without
 * it the route accepts and drops events (204) so the client code never errors.
 * Optional META_TEST_EVENT_CODE (Events Manager → Test Events) makes server
 * events show up in the Test Events tab while testing.
 *
 * GET returns a small config diagnostic (no secrets).
 */

const TOKEN = process.env.META_CONVERSIONS_API_TOKEN;
const TEST_CODE = process.env.META_TEST_EVENT_CODE;
const GRAPH = `https://graph.facebook.com/v23.0/${META_PIXEL_ID}/events`;

// Only event names our own client code sends — this is a relay, not an open proxy.
const ALLOWED_EVENTS = new Set(["PageView", "ViewContent", "Schedule", "Lead", "Contact"]);

// Shape guards for client-supplied matching params (they improve Event Match
// Quality; the client generates them first-party — see lib/meta.ts).
const FB_CLICK_RE = /^fb\.\d\.\d+\..+$/; // documented _fbp/_fbc format (fb.<subdomainIndex>.<ts>.<v>)
const SHA256_RE = /^[a-f0-9]{64}$/; // em/ph arrive pre-hashed, hex
const EID_RE = /^[\w-]{8,64}$/;

export async function POST(req: NextRequest) {
  let body: {
    event_name?: string;
    event_id?: string;
    event_source_url?: string;
    fbp?: string;
    fbc?: string;
    external_id?: string;
    em?: string;
    ph?: string;
  };
  try {
    body = await req.json();
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const { event_name, event_id, event_source_url } = body;
  if (!event_name || !ALLOWED_EVENTS.has(event_name) || !event_id) {
    return new NextResponse(null, { status: 400 });
  }
  if (!TOKEN) return new NextResponse(null, { status: 204 }); // armed, not live

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || undefined;
  const ua = req.headers.get("user-agent") ?? undefined;
  // Cookies win (the pixel's own values); body carries the first-party
  // fallbacks minted when the pixel was blocked.
  const fbp = req.cookies.get("_fbp")?.value ?? (FB_CLICK_RE.test(body.fbp ?? "") ? body.fbp : undefined);
  const fbc = req.cookies.get("_fbc")?.value ?? (FB_CLICK_RE.test(body.fbc ?? "") ? body.fbc : undefined);
  const external_id = EID_RE.test(body.external_id ?? "") ? body.external_id : undefined;
  const em = SHA256_RE.test(body.em ?? "") ? body.em : undefined;
  const ph = SHA256_RE.test(body.ph ?? "") ? body.ph : undefined;

  const payload: Record<string, unknown> = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: "website",
        user_data: {
          ...(ip && { client_ip_address: ip }),
          ...(ua && { client_user_agent: ua }),
          ...(fbp && { fbp }),
          ...(fbc && { fbc }),
          ...(external_id && { external_id }),
          ...(em && { em: [em] }),
          ...(ph && { ph: [ph] }),
        },
      },
    ],
    ...(TEST_CODE && { test_event_code: TEST_CODE }),
  };

  try {
    const res = await fetch(`${GRAPH}?access_token=${TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // Surface Meta-side rejections in Vercel logs; the visitor never waits on this.
    if (!res.ok) {
      console.error("meta capi rejected:", res.status, (await res.text()).slice(0, 300));
      return new NextResponse(null, { status: 502 });
    }
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("meta capi unreachable:", e);
    return new NextResponse(null, { status: 502 });
  }
}

export async function GET() {
  return NextResponse.json({
    pixelId: META_PIXEL_ID,
    conversionsApi: TOKEN ? "configured" : "awaiting META_CONVERSIONS_API_TOKEN",
    testEventCode: TEST_CODE ? "set" : "unset",
  });
}
