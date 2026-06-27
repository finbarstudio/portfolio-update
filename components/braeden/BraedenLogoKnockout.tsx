import { LOGO_PATH } from "./BraedenLogoFull";

/**
 * Negative / knockout Braeden mark — a solid colour block (currentColor) with the
 * logo cut OUT of it, so whatever sits behind shows through the logo shape. Used
 * as the page→footer transition slab: the white page reads through the knocked-out
 * logo while the block carries the footer colour. The viewBox adds padding around
 * the mark so the block reads as a slab, not just the letterforms.
 */
export default function BraedenLogoKnockout({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="-180 -130 2760 1070"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Braeden Constructions"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <mask id="brd-foot-knockout" maskUnits="userSpaceOnUse" x="-180" y="-130" width="2760" height="1070">
          <rect x="-180" y="-130" width="2760" height="1070" fill="white" />
          <g transform="translate(0,1152) scale(0.1,-0.1)" fill="black">
            <path d={LOGO_PATH} />
          </g>
        </mask>
      </defs>
      <rect x="-180" y="-130" width="2760" height="1070" fill="currentColor" mask="url(#brd-foot-knockout)" />
    </svg>
  );
}
