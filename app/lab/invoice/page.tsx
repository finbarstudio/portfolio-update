import type { Metadata } from "next";
import InvoiceTool from "@/components/invoice/InvoiceTool";
import "./invoice.css";

/**
 * Lab 0000: the studio's invoice maker. A tool, not a page of the lab: it
 * covers the screen with its own layout, so none of the lab's chrome shows.
 */
export const metadata: Metadata = {
  title: "Invoice maker",
  robots: { index: false, follow: false },
};

export default function InvoicePage() {
  return <InvoiceTool />;
}
