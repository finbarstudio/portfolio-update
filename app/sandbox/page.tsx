import type { Metadata } from "next";
import SandboxHome from "@/components/sandbox/SandboxHome";

// `absolute` so the landing title isn't wrapped by the root layout's
// "%s | Finbar Studio" template (the sandbox is its own site on its subdomain).
export const metadata: Metadata = {
  title: { absolute: "Sandbox · finbar✶studio — free creative tools" },
};

// Landing: a decode-head typography animation under a real pixel-grid filter —
// deliberate machinery developing the wordmark, not a loading spinner.
export default function SandboxHomePage() {
  return <SandboxHome />;
}
