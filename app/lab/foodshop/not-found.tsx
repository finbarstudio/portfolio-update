import { BASE_PATH } from "@/lib/food-shop/paths";

export default function NotFound() {
  return (
    <div className="fs-empty">
      <p>
        <b>Can&apos;t find that</b>
      </p>
      <p>
        There&apos;s nothing at this address. <a href={BASE_PATH}>Back to the shop</a>
      </p>
    </div>
  );
}
