"use client";

/**
 * PrintButton — the deck's "Save as PDF" affordance. window.print() gives the
 * print dialog, where "Save as PDF" produces the deck with the print styles
 * (one slide per page). Hidden in the print output itself (.no-print).
 */
export default function PrintButton() {
  return (
    <button type="button" className="pr-print no-print" onClick={() => window.print()}>
      Print / save as PDF
    </button>
  );
}
