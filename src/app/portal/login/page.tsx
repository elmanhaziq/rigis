import type { Metadata } from "next";
import { PortalUnavailable } from "@/components/portal/portal-unavailable";

export const metadata: Metadata = { title: "Member sign in", robots: { index: false } };

export default function LoginPage() {
  return <PortalUnavailable title="Member sign in" />;
}
