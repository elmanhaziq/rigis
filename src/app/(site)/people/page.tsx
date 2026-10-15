import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { publicationsForProfile } from "@/lib/data/selectors";
import { collaboratorsFor, sharedPublications } from "@/lib/data/relationships";
import { PageMasthead } from "@/components/layout/page-masthead";
import { PeopleDirectory } from "@/components/people/people-directory";

export const metadata: Metadata = {
  title: "People",
  description: "Lecturers, researchers and postgraduate students of the RIGIS research group.",
  alternates: { canonical: "/people/" },
};

export default async function PeoplePage() {
  const data = await getPublicDataset();
  const { profiles } = data;
  const meta = Object.fromEntries(
    profiles.map((p) => {
      const pubs = publicationsForProfile(data, p.id).length;
      const co = collaboratorsFor(data, p.id).length;
      return [p.id, `${pubs} publications · ${co} co-author${co === 1 ? "" : "s"} in RIGIS`];
    }),
  );
  return (
    <>
      <PageMasthead
        section="People"
        title="The researchers of RIGIS"
        dek="Academics, researchers and students working on intelligent systems. Profiles are maintained by the members themselves and published after review."
        facts={[
          { value: profiles.length, label: profiles.length === 1 ? "Researcher" : "Researchers" },
          { value: data.publications.length, label: "Publications listed" },
          { value: sharedPublications(data).length, label: "Written together" },
        ]}
      />
      <div className="container-page py-14 lg:py-20">
        <Suspense>
          <PeopleDirectory profiles={profiles} meta={meta} />
        </Suspense>
      </div>
    </>
  );
}
