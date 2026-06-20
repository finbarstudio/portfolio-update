/**
 * FootballIcon — a minimal soccer-ball mark (circle + centre pentagon + seams),
 * drawn in currentColor so it adapts to context (the nav bubble, headings, etc.).
 */
export default function FootballIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      width="100%"
      height="100%"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <polygon points="12,7.4 15.5,9.9 14.2,14.1 9.8,14.1 8.5,9.9" fill="currentColor" stroke="none" />
      <path d="M12 7.4V3M15.5 9.9L20.7 8.3M14.2 14.1L17.6 18.6M9.8 14.1L6.4 18.6M8.5 9.9L3.3 8.3" />
    </svg>
  );
}
