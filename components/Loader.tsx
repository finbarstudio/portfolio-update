"use client";

/**
 * Loader — subtle, on-theme preloader.
 *
 * Thin ring on --color-line with a single pink arc (--color-pink) that
 * rotates. Renders centred inside its parent. Use as a preloader behind
 * images and video while the asset is fetching.
 */

type Props = {
  /** Pixel size of the ring. Default 28. */
  size?: number;
  /** Hide the ring; just reserve the slot. */
  invisible?: boolean;
  className?: string;
};

export default function Loader({ size = 28, invisible = false, className }: Props) {
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        opacity: invisible ? 0 : 1,
      }}
    >
      <span
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "1.5px solid var(--color-line)",
          borderTopColor: "var(--color-pink)",
          animation: "loader-spin 0.85s linear infinite",
          display: "block",
        }}
      />
    </div>
  );
}
