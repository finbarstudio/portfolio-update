import type { Metadata } from "next";
import EmailCheck from "@/components/email-check/EmailCheck";
import "./email.css";

/**
 * Lab 0006: email check. Paste an HTML email and get a list of what will go
 * wrong in which client, plus a preview. A tool, not a page of the lab: it
 * covers the screen with its own layout, so none of the lab's chrome shows.
 */
export const metadata: Metadata = {
  title: "Email check",
  robots: { index: false, follow: false },
};

export default function EmailCheckPage() {
  return <EmailCheck />;
}
