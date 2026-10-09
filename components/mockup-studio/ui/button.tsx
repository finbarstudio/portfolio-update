import type { ComponentProps } from "react";
import { cn } from "./cn";

export interface ButtonProps extends Omit<ComponentProps<"button">, "type"> {
  variant?: "default" | "ghost" | "primary";
  /** md = 28px, lg = 36px, auto = grows with its content. */
  size?: "md" | "lg" | "auto" | "icon" | "iconLg";
  justify?: "center" | "start" | "between";
  /** Makes this a toggle button (renders aria-pressed). */
  pressed?: boolean;
}

const VARIANTS = {
  default:
    "border border-ms-line bg-ms-raised text-ms-ink hover:bg-ms-hover aria-pressed:border-ms-accent aria-pressed:bg-ms-accent aria-pressed:text-[#111]",
  ghost:
    "text-ms-ink-muted hover:bg-ms-raised hover:text-ms-ink aria-pressed:bg-ms-accent aria-pressed:text-[#111]",
  primary: "bg-ms-accent font-semibold text-[#111] hover:bg-ms-accent/85",
} as const;

const SIZES = {
  md: "h-7 px-2.5",
  lg: "h-9 px-2.5",
  auto: "min-h-9 px-2.5 py-1.5",
  icon: "size-7",
  iconLg: "size-9",
} as const;

const JUSTIFY = {
  center: "justify-center",
  start: "justify-start text-left",
  between: "justify-between text-left",
} as const;

export function Button({
  variant = "default",
  size = "md",
  justify = "center",
  pressed,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={cn(
        "inline-flex shrink-0 select-none items-center gap-1.5 rounded-ms-control transition-colors disabled:pointer-events-none disabled:opacity-40",
        VARIANTS[variant],
        SIZES[size],
        JUSTIFY[justify],
        className,
      )}
      {...props}
    />
  );
}

export interface IconButtonProps extends ButtonProps {
  /** Accessible name and tooltip. */
  label: string;
}

export function IconButton({
  label,
  size = "icon",
  variant = "ghost",
  ...props
}: IconButtonProps) {
  return (
    <Button
      size={size}
      variant={variant}
      aria-label={label}
      title={label}
      {...props}
    />
  );
}
