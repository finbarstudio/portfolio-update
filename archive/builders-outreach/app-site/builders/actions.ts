"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// On-screen password gate for /builders. The page server-renders the outreach
// content, so the check must happen server-side: a matching cookie is the key,
// set here only when the submitted password is right. Rotate via a
// BUILDERS_PASSWORD env var on the host if needed.
export async function unlock(
  _prev: { error: string } | null,
  formData: FormData
): Promise<{ error: string } | null> {
  const expected = process.env.BUILDERS_PASSWORD || "lovedev";
  const password = String(formData.get("password") ?? "");
  if (password !== expected) return { error: "Wrong password." };
  (await cookies()).set("builders_key", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // stays unlocked for 30 days per browser
  });
  redirect("/builders");
}
