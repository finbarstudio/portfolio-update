import Link from "next/link";
import { BASE_PATH } from "@/lib/dad-shop/types";

export default function NotFound() {
  return (
    <div className="ds-page">
      <div className="ds-empty">
        <p className="ds-empty-title">Couldn&apos;t find that.</p>
        <p>It may have been taken off the shelves.</p>
        <Link className="ds-btn ds-btn--primary" href={`${BASE_PATH}/find`}>
          Search for something else
        </Link>
      </div>
    </div>
  );
}
