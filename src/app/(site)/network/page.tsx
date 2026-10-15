import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { NetworkExplorer } from "@/components/network/network-explorer";

export const metadata: Metadata = {
  title: "Research Network",
  description: "Interactive map of RIGIS researchers, research projects and research areas, built from approved records.",
  alternates: { canonical: "/network/" },
};

export default async function NetworkPage() {
  const data = await getPublicDataset();
  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Research network"
            title="How our research connects"
            description="Researchers are linked to the projects they work on, and projects to their research areas. Every connection comes from an approved project record — none are inferred or added by hand."
            align="split"
          />
        </div>
      </header>
      <div className="container-page py-10 lg:py-14">
        <Suspense>
          <NetworkExplorer data={data} />
        </Suspense>
      </div>
    </>
  );
}
