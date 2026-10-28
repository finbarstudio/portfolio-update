import { BASE_PATH } from "@/lib/food-shop/paths";

/** POSTs JSON to one of the food shop's routes. Resolves to the error text on failure, null on success. */
export async function post(path: string, body: unknown): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_PATH}/api/${path}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) return null;
    if (res.status === 401) {
      window.location.href = `${BASE_PATH}/login`;
      return "Please log in again.";
    }
    const data = (await res.json().catch(() => null)) as { error?: string } | null;
    return data?.error ?? "Something went wrong. Please try again.";
  } catch {
    return "Couldn't reach the shop. Check your connection and try again.";
  }
}
