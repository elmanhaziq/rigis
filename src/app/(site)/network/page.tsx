import type { Metadata } from "next";
import { Suspense } from "react";
import { getPublicDataset } from "@/lib/data";
import { PageMasthead } from "@/components/layout/page-masthead";
import { sharedPublications } from "@/lib/data/relationships";
import { NetworkExperience } from "@/components/network/network-experience";

export const metadata: Metadata = {
  title: "Research Network",
  description: "Interactive map of RIGIS researchers, research projects and research areas, built from approved records.",
  alternates: { canonical: "/network/" },
};

export default async function NetworkPage() {
  const data = await getPublicDataset();
  return (
    <>
      <PageMasthead
        section="Research network"
        title="A map of who works with whom"
        dek="Researchers, the papers they write together, their projects and research areas. Links come from author lists and approved project records; a researcher joins an area through their own papers on that topic (matched by title) or, dashed, an interest they list themselves."
        facts={[
          { value: data.profiles.length, label: "Researchers" },
          { value: sharedPublications(data).length, label: "Papers written together" },
          { value: data.projects.length, label: "Approved projects" },
        ]}
      />
      <div className="container-page py-10 lg:py-14">
        <Suspense>
          <NetworkExperience data={data} />
        </Suspense>
      </div>
    </>
  );
}
