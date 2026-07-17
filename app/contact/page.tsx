import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";

/**
 * /contact — a directable, INDEXED landing page for the contact surface (the
 * popup's content as a real URL, for SEO and for handing to clients). Lives
 * outside the (site) route group on purpose: it wants the nav and the © line
 * only — no footer, no Book-a-call pin (this page IS the booking surface).
 */
export const metadata: Metadata = {
  title: "Contact",   // the root template appends "| Finbar Studio"
  description:
    "Hiring or have a project? Reach Finbar Studio direct, send a note, or book a call. Brisbane-based web design and development studio.",
  alternates: { canonical: "https://www.finbar.studio/contact" },
};

export default function Contact() {
  return <ContactPage />;
}
