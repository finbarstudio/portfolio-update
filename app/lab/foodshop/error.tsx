"use client";

export default function FoodShopError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="fs-empty" role="alert">
      <p>
        <b>Something went wrong</b>
      </p>
      <p>That page didn&apos;t load. It&apos;s not something you did.</p>
      <button type="button" className="fs-btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
