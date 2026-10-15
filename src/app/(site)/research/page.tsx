import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { researchersForArea } from "@/lib/data/relationships";
import { PageMasthead } from "@/components/layout/page-masthead";
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
  const activeAreas = areas.filter((a) => researchersForArea(data, a.id).length > 0).length;

  return (
    <>
      <PageMasthead
        section="Research"
        title="Research areas and projects"
        dek="Where RIGIS concentrates its work, who is connected to each area and why, and the projects behind it."
        facts={[
          { value: areas.length, label: "Research areas" },
          { value: activeAreas, label: activeAreas === 1 ? "Area with researchers" : "Areas with researchers" },
          { value: projects.length, label: projects.length === 1 ? "Approved project" : "Approved projects" },
        ]}
      />

      <section aria-labelledby="areas-heading" className="bg-card">
        <div className="container-page py-14 lg:py-20">
          <h2 id="areas-heading" className="sr-only">Research areas</h2>
          <AreaExplorer data={data} syncUrl showDirectoryLink={false} headingLevel="h3" />
        </div>
      </section>

      <section aria-labelledby="projects-heading" className="border-t border-border">
        <div className="container-page py-14 lg:py-20">
          {projects.length === 0 ? (
            <div className="grid gap-6 lg:grid-cols-12">
              <h2 id="projects-heading" className="font-heading text-[2rem] font-normal lg:col-span-4">
                Projects
              </h2>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="dek">No projects have been published yet.</p>
                <p className="mt-4 max-w-[60ch] leading-relaxed text-muted-foreground">
                  Projects appear here once members submit them and a group leader approves them. Until then, the clearest
                  picture of the group&rsquo;s work is its researchers&rsquo; publications and the papers they write together.
                </p>
                <div className="mt-6 flex flex-col gap-1 sm:flex-row sm:gap-8">
                  <Link href="/network/" className="inline-flex min-h-11 items-center gap-2 font-semibold text-purple-700 hover:underline">
                    See who works with whom <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link href="/people/" className="inline-flex min-h-11 items-center gap-2 font-semibold text-purple-700 hover:underline">
                    Browse researchers <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <>
              <h2 id="projects-heading" className="mb-8 font-heading text-[2rem] font-normal">Projects</h2>
              <Suspense>
                <ResearchDirectory projects={projects} areas={areas} profiles={profiles} />
              </Suspense>
            </>
          )}
        </div>
      </section>
    </>
  );
}
