import { decodeEmbedConfig } from "@/lib/sandbox/embed-config";
import EmbedMac from "./EmbedMac";

// Next 16: `searchParams` is a Promise and must be awaited.
export default async function EmbedMacPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const config = decodeEmbedConfig(sp);
  return <EmbedMac config={config} />;
}
