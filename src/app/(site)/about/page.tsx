import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { DemoTag } from "@/components/layout/demo-banner";

export const metadata: Metadata = {
  title: "About",
  description:
    "Background, vision, mission and research philosophy of the Research Initiative Group Intelligent System (RIGIS).",
  alternates: { canonical: "/about/" },
};

export default async function AboutPage() {
  const { site } = await getPublicDataset();

  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20 lg:py-24">
          <SectionHeading
            as="h1"
            eyebrow="About RIGIS"
            title="Research Initiative Group Intelligent System"
            description={site.introduction}
            align="split"
          />
          {site.isDemo && (
            <p className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <DemoTag /> About-page text is placeholder content, editable by administrators in the portal.
            </p>
          )}
        </div>
      </header>

      <section aria-labelledby="background-title" className="bg-card">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
          <h2 id="background-title" className="font-heading text-[1.75rem] font-bold lg:col-span-4">
            Background
          </h2>
          <div className="prose-rigis lg:col-span-7 lg:col-start-6">
            <p>{site.background}</p>
          </div>
        </div>
      </section>

      <section aria-label="Vision and mission" className="bg-navy-900 text-white">
        <div className="container-page grid gap-px bg-white/10 md:grid-cols-2">
          {[
            ["Vision", site.vision],
            ["Mission", site.mission],
          ].map(([title, text]) => (
            <div key={title} className="bg-navy-900 py-16 md:px-10 md:py-20 md:first:pl-0 md:last:pr-0">
              <p className="eyebrow flex items-center gap-3 text-purple-200">
                <span className="rule-accent" aria-hidden="true" />
                Our {title.toLowerCase()}
              </p>
              <h2 className="sr-only">{title}</h2>
              <p className="mt-6 font-heading text-xl leading-[1.55] font-medium text-white sm:text-2xl">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="objectives-title">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
          <h2 id="objectives-title" className="font-heading text-[1.75rem] font-bold lg:col-span-4">
            Research objectives
          </h2>
          <ol className="lg:col-span-7 lg:col-start-6">
            {site.objectives.map((o, i) => (
              <li key={o} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-6 last:border-b">
                <span className="font-heading text-sm font-semibold text-purple-700 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[1.0625rem] leading-relaxed">{o}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="philosophy-title" className="border-t border-border bg-card">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
          <h2 id="philosophy-title" className="font-heading text-[1.75rem] font-bold lg:col-span-4">
            Research philosophy
          </h2>
          <div className="prose-rigis lg:col-span-7 lg:col-start-6">
            <p>{site.philosophy}</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="affiliation-title" className="border-t border-border">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
          <h2 id="affiliation-title" className="font-heading text-[1.75rem] font-bold lg:col-span-4">
            Institutional affiliation
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="flex items-start gap-4 border border-border bg-card p-6">
              <Building2 className="mt-0.5 size-5 shrink-0 text-purple-700" aria-hidden="true" />
              <div>
                <p className="font-heading text-lg font-bold text-navy-900">{site.affiliation}</p>
                {site.address && <p className="mt-2 text-muted-foreground">{site.address}</p>}
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <Link href="/people/">
                  Meet the team
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contact/">Contact the group</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
