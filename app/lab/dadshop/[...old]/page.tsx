import { redirect } from "next/navigation";
import { BASE_PATH } from "@/lib/dad-shop/types";

/** The old pages (find, list, week, p/…) are all on the home page now, so saved links and home-screen icons land there. */
export default function OldPage(): never {
  redirect(BASE_PATH);
}
