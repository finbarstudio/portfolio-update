import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Catalogue from "@/components/web/Catalogue";
import { WEB_SITES, PER_PAGE } from "@/content/web-sites";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ n: string }>;
}): Promise<Metadata> {
  const { n } = await params;
  return { title: `Page ${n}` };
}

export default async function WebPageN({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const page = Number(n);
  const total = Math.max(1, Math.ceil(WEB_SITES.length / PER_PAGE));
  // Page 1 lives at `/`; anything past the last page is a 404, not an empty grid.
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();
  return <Catalogue page={page} />;
}
