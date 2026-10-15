import type { Metadata } from "next";
import { PortalUnavailable } from "@/components/portal/portal-unavailable";

export const metadata: Metadata = { title: "Request membership", robots: { index: false } };

export default function RegisterPage() {
  return <PortalUnavailable title="Request membership" />;
}
