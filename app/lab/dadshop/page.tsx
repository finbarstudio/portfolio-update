import FindScreen from "@/components/dad-shop/FindScreen";

export const dynamic = "force-dynamic";

/** The home screen: Find, opening on For you. The shopping list is at /dadshop/list. */
export default function HomePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <FindScreen searchParams={searchParams} defaultView="foryou" />;
}
