import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { PeopleDirectory } from "@/components/people/people-directory";

export const metadata: Metadata = {
  title: "People",
  description: "Lecturers, researchers and postgraduate students of the RIGIS research group.",
  alternates: { canonical: "/people/" },
};

export default async function PeoplePage() {
  const { profiles } = await getPublicDataset();
  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="People"
            title="Researchers and members"
            description="The academics, researchers and students who make up RIGIS. Profiles are maintained by members themselves and published after review."
            align="split"
          />
        </div>
      </header>
      <div className="container-page py-12 lg:py-16">
        <Suspense>
          <PeopleDirectory profiles={profiles} />
        </Suspense>
      </div>
    </>
  );
}
