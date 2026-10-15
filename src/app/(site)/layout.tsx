import { DemoBanner } from "@/components/layout/demo-banner";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { isDemoMode } from "@/lib/data";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {isDemoMode && <DemoBanner />}
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
