import type { ReactNode } from "react";

interface IconButtonProps {
  /** Used for both aria-label and the tooltip. Put the shortcut in `title`. */
  label: string;
  title?: string;
  pressed?: boolean;
  disabled?: boolean;
  className?: string;
  onClick(): void;
  children: ReactNode;
}

export function IconButton({
  label,
  title,
  pressed,
  disabled,
  className = "",
  onClick,
  children,
}: IconButtonProps) {
  return (
    <button
      aria-label={label}
      aria-pressed={pressed}
      className={`grid size-7 shrink-0 place-items-center rounded-ms-control text-ms-ink-muted transition-colors hover:bg-ms-hover hover:text-ms-ink disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-ms-accent aria-pressed:text-[#111] ${className}`}
      disabled={disabled}
      onClick={onClick}
      title={title ?? label}
      type="button"
    >
      {children}
    </button>
  );
}
