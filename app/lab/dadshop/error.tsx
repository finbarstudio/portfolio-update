"use client";

/** Something broke while loading a page. Calm words and a way to try again. */
export default function DadShopError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="ds-page">
      <div className="ds-empty">
        <p className="ds-empty-title">That didn&apos;t load.</p>
        <p>It&apos;s probably the signal, or the shop is having a moment. Your list is safe.</p>
        <button type="button" className="ds-btn ds-btn--primary" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
