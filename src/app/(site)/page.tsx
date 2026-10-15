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
  number,
  eyebrow,
  title,
  description,
  id,
  action,
  inverted = false,
}: {
  number: string;
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
        <p className={`eyebrow flex items-center gap-3 ${inverted ? "text-white/65" : ""}`}>
          <span className="rule-brass" aria-hidden="true" />
          {number} · {eyebrow}
        </p>
        <h2 id={id} className={`mt-4 font-heading text-[2rem] leading-[1.1] font-bold sm:text-[2.75rem] ${inverted ? "text-white" : ""}`}>
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
            number="03"
            eyebrow="Explore our research"
            title="Six areas, one direction"
            description="Choose an area to see what it covers, who works in it and the projects behind it. Every connection shows where it comes from."
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
            number="04"
            eyebrow="Meet the researchers"
            title="The people behind the research"
            description="Select a researcher to read their story, interests, collaborators and recent publications, then move straight on to the next."
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

      <section id="network" aria-labelledby="network-title" className="scroll-mt-20 border-t border-border bg-card">
        <div className="container-page py-20 lg:py-28">
          <SceneHeader
            id="network-title"
            number="05"
            eyebrow="Research network"
            title="Who works with whom"
            description={`${shared} recent papers were written by two or more RIGIS researchers. The map below is drawn directly from those author lists.`}
            action={
              <Button asChild className="self-start">
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
