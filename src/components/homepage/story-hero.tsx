import Link from "next/link";
import { ArrowDown, ArrowRight } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { HeroConstellation } from "./hero-constellation";

/** Scene 1 — Enter RIGIS. Content is immediately readable; the map is an enhancement. */
export function StoryHero({ data }: { data: PublicDataset }) {
  return (
    <section id="enter" aria-labelledby="hero-title" className="relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,#8B76A5_1px,transparent_1px),linear-gradient(to_bottom,#8B76A5_1px,transparent_1px)] [background-size:72px_72px]"
      />
      <div className="container-page relative grid items-center gap-10 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3 text-purple-200">
            <span className="rule-accent" aria-hidden="true" />
            RIGIS · Research Initiative Group Intelligent System
          </p>
          <h1
            id="hero-title"
            className="mt-6 font-heading text-[2.5rem] leading-[1.05] font-extrabold text-white sm:text-[3.5rem] lg:text-[3.25rem] xl:text-[3.75rem]"
          >
            Intelligent Systems.
            <br />
            <span className="text-brass">Meaningful Research.</span>
            <br />
            Real-World Impact.
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-white/75">
            Research Initiative Group Intelligent System (RIGIS) brings together academics,
            researchers and students to explore intelligent technologies, develop innovative
            solutions and advance knowledge through research and collaboration.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-navy-900 hover:bg-white/90">
              <a href="#identity">
                Explore RIGIS
                <ArrowDown data-icon="inline-end" aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:border-white hover:bg-white/5 hover:text-white">
              <Link href="/research/">
                Our research
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[560px] lg:col-span-5 lg:max-w-none">
          <HeroConstellation data={data} />
        </div>
      </div>
    </section>
  );
}
