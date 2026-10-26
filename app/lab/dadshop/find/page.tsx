import FindScreen from "@/components/dad-shop/FindScreen";

export const dynamic = "force-dynamic";

/** Find on the All view (the address holds every choice, so Back from a product lands here). */
export default function FindPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return <FindScreen searchParams={searchParams} defaultView="all" />;
}
