import { cn } from "./cn";

const PINT_URL = "https://donate.stripe.com/cNi6oH8vP2f6eHlaoQ8N200";

/**
 * The tip link. A quiet amber tint marks it out from the controls. `floating`
 * is the pill that sits in a corner of the viewport, clear of the frame; it
 * is page furniture, not part of the canvas, so it never appears in an export.
 */
export function PintLink({ floating = false }: { floating?: boolean }) {
  return (
    <a
      href={PINT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "border border-[#e8b452]/30 text-center text-[#e8b452]/90 transition-colors hover:border-[#e8b452]/55 hover:text-[#e8b452]",
        floating
          ? "whitespace-nowrap rounded-full bg-[#201c14]/85 px-4 py-2 backdrop-blur-md hover:bg-[#2a2418]/90"
          : "block rounded-ms-control bg-[#e8b452]/[0.07] px-3 py-2.5 hover:bg-[#e8b452]/[0.14]",
      )}
    >
      Buy me a pint
    </a>
  );
}
