import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { ResearchDirectory } from "@/components/research/research-directory";
import { AreaExplorer } from "@/components/research/area-explorer";

export const metadata: Metadata = {
  title: "Research",
  description: "RIGIS research areas, the researchers connected to them, and approved research projects.",
  alternates: { canonical: "/research/" },
};

export default async function ResearchPage() {
  const data = await getPublicDataset();
  const { projects, areas, profiles } = data;
  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Research"
            title="Our research"
            description="Explore the group's research areas and the people connected to them, then browse approved projects by area, status or topic."
            align="split"
          />
        </div>
      </header>
      <section aria-labelledby="areas-heading" className="border-b border-border bg-card">
        <div className="container-page py-14 lg:py-20">
          <h2 id="areas-heading" className="font-heading text-[1.75rem] font-bold sm:text-[2.25rem]">Research areas</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Select an area to see what it covers, who is connected to it and why, and its approved projects.
          </p>
          <div className="mt-10">
            <AreaExplorer data={data} syncUrl showDirectoryLink={false} />
          </div>
        </div>
      </section>
      <section aria-labelledby="projects-heading" className="container-page py-14 lg:py-20">
        <h2 id="projects-heading" className="mb-8 font-heading text-[1.75rem] font-bold sm:text-[2.25rem]">Projects</h2>
        <Suspense>
          <ResearchDirectory projects={projects} areas={areas} profiles={profiles} />
        </Suspense>
      </section>
    </>
  );
}
