import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { PageMasthead } from "@/components/layout/page-masthead";
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
      <PageMasthead
        section="About RIGIS"
        title={
          <>
            Research Initiative Group <em className="text-purple-700">Intelligent&nbsp;System</em>
          </>
        }
        dek={site.introduction}
      >
        {site.isDemo && (
          <p className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
            <DemoTag /> The text on this page is placeholder content until RIGIS supplies its own.
          </p>
        )}
      </PageMasthead>

      {/* Long-form essay: background and philosophy read as one piece. */}
      <article className="bg-card">
        <div className="container-page grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-3">
            <p className="eyebrow">Background</p>
          </div>
          <div className="lg:col-span-7">
            <h2 className="sr-only">Background</h2>
            <p className="prose-rigis first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:font-heading first-letter:text-[4.25rem] first-letter:leading-[0.8] first-letter:text-purple-700">
              {site.background}
            </p>
            <h2 className="mt-14 font-heading text-[1.75rem] font-normal">Research philosophy</h2>
            <p className="prose-rigis mt-4">{site.philosophy}</p>
          </div>
        </div>
      </article>

      {/* Vision and mission as paired statements. */}
      <section aria-label="Vision and mission" className="border-y border-border">
        <div className="container-page grid gap-12 py-16 md:grid-cols-2 md:gap-16 lg:py-24">
          {[
            ["Vision", site.vision],
            ["Mission", site.mission],
          ].map(([title, text]) => (
            <figure key={title} className="border-l-2 border-purple-700 pl-6 sm:pl-8">
              <h2 className="eyebrow text-purple-700">{title}</h2>
              <blockquote className="mt-5 font-heading text-[1.5rem] leading-[1.4] text-navy-900 sm:text-[1.875rem]">
                {text}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

      <section aria-labelledby="objectives-title" className="bg-card">
        <div className="container-page py-16 lg:py-24">
          <h2 id="objectives-title" className="font-heading text-[2rem] font-normal sm:text-[2.5rem]">
            Research objectives
          </h2>
          <ol className="mt-10 grid gap-x-16 border-t border-navy-900 sm:grid-cols-2">
            {site.objectives.map((o, i) => (
              <li key={o} className="flex gap-5 border-b border-border py-6">
                <span className="w-8 shrink-0 font-heading text-[1.75rem] leading-none text-purple-400 tabular-nums">
                  {i + 1}
                </span>
                <p className="text-[1.0625rem] leading-relaxed">{o}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="affiliation-title">
        <div className="container-page grid gap-8 py-16 lg:grid-cols-12 lg:py-20">
          <div className="lg:col-span-7">
            <h2 id="affiliation-title" className="eyebrow">Institutional affiliation</h2>
            <p className="mt-3 font-heading text-[1.5rem] leading-snug text-navy-900">{site.affiliation}</p>
            {site.address && <p className="mt-2 text-muted-foreground">{site.address}</p>}
          </div>
          <nav aria-label="Next" className="flex flex-col gap-1 lg:col-span-4 lg:col-start-9 lg:self-end">
            {[
              { href: "/people/", label: "Meet the researchers" },
              { href: "/research/", label: "Explore the research areas" },
              { href: "/contact/", label: "Contact the group" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="group flex min-h-12 items-center justify-between border-b border-border font-heading text-lg text-navy-900 hover:text-purple-700"
              >
                {l.label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </div>
      </section>
    </>
  );
}
