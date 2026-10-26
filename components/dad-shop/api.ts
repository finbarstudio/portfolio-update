import { BASE_PATH } from "@/lib/dad-shop/types";

/** Browser-side fetch for the shop's own API. */

export class ApiError extends Error {
  readonly status: number;
  /** True when trying again later could work (no signal, server hiccup). */
  readonly retryable: boolean;

  constructor(message: string, status: number, retryable: boolean) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.retryable = retryable;
  }
}

interface Options {
  method?: "GET" | "POST";
  body?: unknown;
  timeoutMs?: number;
}

export async function api<T>(path: string, options: Options = {}): Promise<T> {
  const { method = "GET", body, timeoutMs = 12_000 } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let res: Response;
  try {
    res = await fetch(`${BASE_PATH}/api${path}`, {
      method,
      headers: body === undefined ? undefined : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: "no-store",
    });
  } catch {
    throw new ApiError("No signal, or the shop took too long to answer.", 0, true);
  } finally {
    clearTimeout(timer);
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // a non-JSON answer (an error page from the edge): handled below
  }
  if (!res.ok) {
    const message =
      typeof data === "object" && data !== null && "error" in data && typeof data.error === "string"
        ? data.error
        : "Something went wrong.";
    const retryable = res.status >= 500 || res.status === 408 || res.status === 429;
    throw new ApiError(message, res.status, retryable);
  }
  if (data === null) throw new ApiError("The shop sent back something unexpected.", res.status, true);
  return data as T;
}
