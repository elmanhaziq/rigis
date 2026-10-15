import Link from "next/link";
import { ArrowRight, Network } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { sharedPublications } from "@/lib/data/relationships";
import { Button } from "@/components/ui/button";
import { StoryHero } from "@/components/homepage/story-hero";
import { IdentityScene } from "@/components/homepage/identity-scene";
import { CollaborationMap } from "@/components/homepage/collaboration-map";
import { CollaborateScene } from "@/components/homepage/collaborate-scene";
import { SceneNav } from "@/components/homepage/scene-nav";
import { AreaExplorer } from "@/components/research/area-explorer";
import { ResearcherExplorer } from "@/components/people/researcher-explorer";

function SceneHeader({
  eyebrow,
  title,
  description,
  id,
  action,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  id: string;
  action?: React.ReactNode;
  inverted?: boolean;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-7">
        <p className={`eyebrow flex items-center gap-3 ${inverted ? "text-purple-200" : ""}`}>
          {eyebrow}
        </p>
        <h2 id={id} className={`mt-4 font-heading text-[2.25rem] leading-[1.05] font-normal sm:text-[3rem] ${inverted ? "text-white" : ""}`}>
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-5 lg:col-span-5 lg:pb-1">
        <p className={`text-[1.0625rem] leading-relaxed ${inverted ? "text-white/75" : "text-muted-foreground"}`}>{description}</p>
        {action}
      </div>
    </div>
  );
}

/**
 * The homepage tells the RIGIS story in six scenes:
 * enter → understand → research → people → network → collaborate.
 * Every scene is plain, readable HTML first; interactivity is layered on top.
 */
export default async function HomePage() {
  const data = await getPublicDataset();
  const shared = sharedPublications(data).length;

  return (
    <>
      <SceneNav />
      <StoryHero data={data} />
      <IdentityScene site={data.site} />

      <section id="research" aria-labelledby="research-title" className="scroll-mt-20 border-t border-border bg-card">
        <div className="container-page py-20 lg:py-28">
          <SceneHeader
            id="research-title"
            eyebrow="Research"
            title="Research areas"
            description="Choose an area to see what it covers, who is connected to it and why, and the projects behind it."
          />
          <div className="mt-12 lg:mt-16">
            <AreaExplorer data={data} />
          </div>
        </div>
      </section>

      <section id="people" aria-labelledby="people-title" className="scroll-mt-20 border-t border-border">
        <div className="container-page py-20 lg:py-28">
          <SceneHeader
            id="people-title"
            eyebrow="People"
            title="The researchers"
            description="Open a profile to read about each researcher, their interests, the colleagues they write with and their recent papers."
            action={
              <Button asChild variant="outline" className="self-start">
                <Link href="/people/">
                  Full directory
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
            }
          />
          <div className="mt-12 lg:mt-16">
            <ResearcherExplorer data={data} />
          </div>
        </div>
      </section>

      <section id="network" aria-labelledby="network-title" className="scroll-mt-20 bg-navy-900 text-white">
        <div className="container-page py-20 lg:py-28">
          <SceneHeader
            id="network-title"
            inverted
            eyebrow="Collaboration"
            title="Who works with whom"
            description={`${shared} recent papers were written by two or more RIGIS researchers. The map below is drawn directly from those author lists.`}
            action={
              <Button asChild className="self-start bg-white text-purple-700 hover:bg-purple-50">
                <Link href="/network/">
                  <Network data-icon="inline-start" aria-hidden="true" />
                  Explore the full network
                </Link>
              </Button>
            }
          />
          <div className="mt-12 lg:mt-16">
            <CollaborationMap data={data} />
          </div>
        </div>
      </section>

      <CollaborateScene data={data} />
    </>
  );
}
