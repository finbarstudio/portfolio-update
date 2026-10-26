import Link from "next/link";
import { gbp, shortDate } from "@/lib/dad-shop/format";
import { BASE_PATH, type Deal } from "@/lib/dad-shop/types";

/** One dinner meal deal, as a card in the strip: tap it to build it. */
export default function MealDealCard({ deal, onList }: { deal: Deal; onList: number }) {
  const ends = shortDate(deal.endsOn);
  return (
    <li className="ds-dealcard">
      <Link href={`${BASE_PATH}/meal/${encodeURIComponent(deal.id)}`} className="ds-dealcard-link">
        <strong className="ds-dealcard-name">{deal.title}</strong>
        <span className="ds-dealcard-price">
          {gbp(deal.price)}
          {deal.typical != null && (
            <s className="ds-pb-was">
              <span className="ds-sr">Usually about </span>≈{gbp(deal.typical)}
            </s>
          )}
        </span>
        <span className="ds-muted">{deal.parts.map((p) => `${p.qty} ${p.label}`).join(" + ")}</span>
        <span className="ds-muted">
          {deal.products} products{ends ? ` · ends ${ends}` : ""}
        </span>
        {onList > 0 && <span className="ds-dealcard-in">{onList} on your list</span>}
      </Link>
    </li>
  );
}
