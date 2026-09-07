import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Catalogue from "@/components/web/Catalogue";

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
  if (!Number.isInteger(page) || page < 1) notFound();
  return <Catalogue page={page} />;
}
