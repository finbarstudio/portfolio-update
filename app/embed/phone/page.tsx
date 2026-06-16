import { decodeEmbedConfig } from "@/lib/sandbox/embed-config";
import EmbedPhone from "./EmbedPhone";

// Next 16: `searchParams` is a Promise and must be awaited.
export default async function EmbedPhonePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const config = decodeEmbedConfig(sp);
  return <EmbedPhone config={config} />;
}
