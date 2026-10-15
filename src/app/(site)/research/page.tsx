import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResearchDirectory } from "@/components/research/research-directory";

export const metadata: Metadata = {
  title: "Research",
  description: "Proposed, ongoing and completed research projects of the RIGIS research group.",
  alternates: { canonical: "/research/" },
};

export default async function ResearchPage() {
  const { projects, areas, profiles } = await getPublicDataset();
  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Research"
            title="Research projects"
            description="Projects submitted by RIGIS members and approved for publication. Filter by research area or status, or search for a topic."
            align="split"
          />
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <Suspense>
          <ResearchDirectory projects={projects} areas={areas} profiles={profiles} />
        </Suspense>
      </div>
    </>
  );
}
