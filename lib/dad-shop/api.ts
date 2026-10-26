import "server-only";

/** Small helpers shared by the route handlers. Every answer is uncacheable JSON. */

const HEADERS = { "cache-control": "no-store" };

/** The server's clock as ISO text. Pages pass it down so the browser renders the same "now". */
export function nowIso(): string {
  return new Date().toISOString();
}

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: HEADERS });
}

export function notConnected(): Response {
  return json({ error: "The shop isn't connected to its data yet." }, 503);
}

export function badRequest(error: string, status = 400): Response {
  return json({ error }, status);
}

/** Logs the real cause on the server; the phone only sees a calm message. */
export function failed(err: unknown): Response {
  console.error("[dad-shop] request failed:", err instanceof Error ? err.message : err);
  return json({ error: "Something went wrong. Please try again." }, 500);
}
