import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { sharedPublications } from "@/lib/data/relationships";
import { Button } from "@/components/ui/button";
import { HeroConstellation } from "./hero-constellation";

/**
 * Scene 1 — Enter RIGIS. Typography leads; the figure beside it is a real
 * map of the group, captioned like a journal figure. The fact strip is
 * computed from published records.
 */
export function StoryHero({ data }: { data: PublicDataset }) {
  const facts = [
    { value: data.profiles.length, label: "Researchers" },
    { value: data.publications.length, label: "Publications listed" },
    { value: sharedPublications(data).length, label: "Written together" },
    { value: data.areas.length, label: "Research areas" },
  ];
  return (
    <section id="enter" aria-labelledby="hero-title" className="relative overflow-hidden bg-navy-900 text-white">
      <div className="container-page relative grid gap-12 pt-14 pb-14 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-20">
        <div className="lg:col-span-7 lg:pt-6">
          <p className="eyebrow text-purple-200">Research Initiative Group Intelligent System</p>
          <h1
            id="hero-title"
            className="mt-6 font-heading text-[2.875rem] leading-[1.02] font-normal tracking-[-0.02em] text-white sm:text-[4rem] lg:text-[3.75rem] xl:text-[4.5rem]"
          >
            Intelligent Systems.
            <br />
            <em className="text-brass">Meaningful Research.</em>
            <br />
            Real-World Impact.
          </h1>
          <p className="mt-8 max-w-[54ch] text-[1.0625rem] leading-relaxed text-white/80 sm:text-lg">
            Research Initiative Group Intelligent System (RIGIS) brings together academics, researchers and students to
            explore intelligent technologies, develop innovative solutions and advance knowledge through research and
            collaboration.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-purple-50">
              <a href="#identity">
                Explore RIGIS
                <ArrowDown data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/5 hover:text-white"
            >
              <Link href="/research/">
                Research areas
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[520px] lg:col-span-5 lg:max-w-none">
          <HeroConstellation data={data} />
        </div>
      </div>

      <div className="border-t border-white/12">
        <dl className="container-page grid grid-cols-2 gap-y-6 py-7 sm:grid-cols-4">
          {facts.map((f) => (
            <div key={f.label} className="flex flex-col-reverse sm:border-l sm:border-white/12 sm:pl-6 sm:first:border-l-0 sm:first:pl-0">
              <dt className="mt-1 text-[0.8125rem] text-white/65">{f.label}</dt>
              <dd className="font-heading text-[2.25rem] leading-none text-white tabular-nums">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
