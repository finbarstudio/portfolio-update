import LayoutShell from "@/components/LayoutShell";

/**
 * Layout for the portfolio site routes — wraps them in the persistent shell
 * (sidebar, mobile bar, grain, contact drawer). The Sandbox + embeds live
 * outside this group, so they never get this chrome (no path/host detection
 * needed, no hydration mismatch under the subdomain rewrite).
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <LayoutShell>{children}</LayoutShell>;
}
