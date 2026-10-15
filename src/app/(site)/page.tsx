import Link from "next/link";
import { ArrowRight, Mail, Megaphone, Handshake, FlaskConical } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { areaMap, profileMap, sortProfiles } from "@/lib/data/selectors";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard, projectHref } from "@/components/research/project-card";
import { ProjectCover } from "@/components/research/project-cover";
import { ResearcherCard } from "@/components/people/researcher-card";
import { NetworkFigure } from "@/components/network/network-figure";
import { DemoTag } from "@/components/layout/demo-banner";
import { formatDate } from "@/lib/format";

export default async function HomePage() {
  const data = await getPublicDataset();
  const areas = areaMap(data);
  const people = profileMap(data);
  const featured = data.projects.filter((p) => p.featured);
  const lead = featured[0];
  const researchers = sortProfiles(data.profiles).filter((p) => p.role !== "STUDENT").slice(0, 4);
  const announcements = data.announcements.slice(0, 3);

  return (
    <>
      {/* 2. Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-border">
        <div className="container-page grid gap-12 pt-14 pb-16 sm:pt-20 lg:grid-cols-12 lg:gap-10 lg:pt-24 lg:pb-24">
          <div className="lg:col-span-8">
            <p className="eyebrow flex items-center gap-3">
              <span className="rule-brass" aria-hidden="true" />
              Research Initiative Group Intelligent System
            </p>
            <h1
              id="hero-title"
              className="mt-6 font-heading text-[2.5rem] leading-[1.05] font-extrabold sm:text-6xl lg:text-[4.25rem]"
            >
              Intelligent Systems.
              <br />
              <span className="text-navy-800">Meaningful Research.</span>
              <br />
              Real-World Impact.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Research Initiative Group Intelligent System (RIGIS) brings together academics,
              researchers and students to explore intelligent technologies, develop innovative
              solutions and advance knowledge through research and collaboration.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/research/">
                  Explore Our Research
                  <ArrowRight data-icon="inline-end" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/people/">Meet Our Researchers</Link>
              </Button>
            </div>
          </div>

          {lead && (
            <aside aria-label="Featured research" className="lg:col-span-4 lg:self-end">
              <Link
                href={projectHref(lead.slug)}
                className="group block border border-border bg-card transition-colors hover:border-navy-800/40"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <ProjectCover
                    slug={lead.slug}
                    title={lead.title}
                    coverUrl={lead.coverUrl}
                    priority
                    className="transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <p className="eyebrow flex items-center gap-2">
                    Featured research {lead.isDemo && <DemoTag />}
                  </p>
                  <p className="mt-2 font-heading text-lg leading-snug font-bold text-navy-900">
                    {lead.title}
                  </p>
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800">
                    Read more
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </p>
                </div>
              </Link>
            </aside>
          )}
        </div>
      </section>

      {/* 3. About introduction */}
      <section aria-labelledby="about-title" className="bg-card">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3">
              <span className="rule-brass" aria-hidden="true" />
              About RIGIS
            </p>
            <h2 id="about-title" className="mt-4 font-heading text-[1.875rem] leading-tight font-bold sm:text-4xl">
              A research group built on rigour and collaboration.
            </h2>
          </div>
          <Reveal className="lg:col-span-7 lg:col-start-6">
            <p className="font-heading text-xl leading-[1.6] font-medium text-navy-900 sm:text-[1.375rem]">
              {data.site.introduction}
            </p>
            <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow">Vision</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{data.site.vision}</dd>
              </div>
              <div>
                <dt className="eyebrow">Affiliation</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{data.site.affiliation}</dd>
              </div>
            </dl>
            <Button asChild variant="link" className="mt-6 px-0 text-[0.9375rem] font-semibold">
              <Link href="/about/">
                More about the group
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* 4. Research focus areas */}
      <section aria-labelledby="areas-title" className="border-y border-border">
        <div className="container-page py-20 lg:py-28">
          <SectionHeading
            eyebrow="Research focus"
            title="Where our work concentrates"
            description="Research areas are maintained by group leaders. Each project on this site is linked to one or more of them."
            align="split"
            id="areas-title"
          />
          {data.areas.length === 0 ? (
            <EmptyState icon={FlaskConical} title="Research areas coming soon" className="mt-12" />
          ) : (
            <ol className="mt-14 grid border-t border-navy-900 sm:grid-cols-2 lg:grid-cols-3">
              {data.areas.map((area, i) => (
                <li
                  key={area.id}
                  className="group border-b border-border py-8 sm:odd:pr-8 lg:px-0 lg:pr-10 lg:[&:not(:nth-child(3n+1))]:border-l lg:[&:not(:nth-child(3n+1))]:pl-8"
                >
                  <Link href={`/research/?area=${area.slug}`} className="block">
                    <span className="font-heading text-sm font-semibold text-brass-ink tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-heading text-xl font-bold transition-colors group-hover:text-navy-700">
                      {area.name}
                    </h3>
                    {area.description && (
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{area.description}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* 5. Featured projects */}
      <section aria-labelledby="featured-title" className="bg-card">
        <div className="container-page py-20 lg:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="rule-brass" aria-hidden="true" />
                Featured research
              </p>
              <h2 id="featured-title" className="mt-4 font-heading text-[1.875rem] font-bold sm:text-[2.5rem]">
                Current and recent projects
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/research/">
                All research projects
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <EmptyState
              icon={FlaskConical}
              title="No featured projects yet"
              description="Approved projects marked as featured will appear here."
              className="mt-12"
            />
          ) : (
            <div className="mt-12 grid gap-6 lg:grid-cols-2">
              {featured.slice(0, 3).map((p, i) => (
                <Reveal key={p.id} className={i === 0 ? "lg:col-span-2" : undefined}>
                  <ProjectCard
                    project={p}
                    variant={i === 0 ? "feature" : "default"}
                    areas={p.areaIds.map((id) => areas.get(id)).filter((a) => a !== undefined)}
                    pi={p.principalInvestigatorId ? people.get(p.principalInvestigatorId) : undefined}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 6. Featured researchers */}
      <section aria-labelledby="people-title" className="border-t border-border">
        <div className="container-page py-20 lg:py-28">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow flex items-center gap-3">
                <span className="rule-brass" aria-hidden="true" />
                People
              </p>
              <h2 id="people-title" className="mt-4 font-heading text-[1.875rem] font-bold sm:text-[2.5rem]">
                Our researchers
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link href="/people/">
                Full directory
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
            {researchers.map((p) => (
              <li key={p.id}>
                <ResearcherCard profile={p} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 7. Network preview */}
      <section aria-labelledby="network-title" className="bg-navy-900 text-white">
        <div className="container-page grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-5">
            <SectionHeading
              inverted
              eyebrow="Research network"
              title="See how our research connects"
              description="An interactive map of who works on what. Researchers link to the projects they contribute to, and projects link to their research areas — drawn only from approved records."
              id="network-title"
            />
            <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                ["Researchers", data.profiles.length],
                ["Projects", data.projects.length],
                ["Research areas", data.areas.length],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[0.8125rem] text-white/65">{label}</dt>
                  <dd className="mt-1 font-heading text-2xl font-bold text-white tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[0.75rem] text-white/55">Counts are computed from the records currently published on this site.</p>
            <Button asChild size="lg" className="mt-8 bg-white text-navy-900 hover:bg-white/90">
              <Link href="/network/">
                Explore the network
                <ArrowRight data-icon="inline-end" aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <NetworkFigure data={data} className="mx-auto w-full max-w-[520px]" />
            <ul className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[0.8125rem] text-white/70" aria-label="Legend">
              <li className="flex items-center gap-2"><span className="size-2.5 rounded-full bg-white" aria-hidden="true" />Researcher</li>
              <li className="flex items-center gap-2"><span className="size-3 rounded-full border-[1.5px] border-white bg-navy-800" aria-hidden="true" />Project</li>
              <li className="flex items-center gap-2"><span className="size-2.5 rotate-45 bg-brass" aria-hidden="true" />Research area</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Announcements */}
      <section aria-labelledby="news-title" className="bg-card">
        <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-4">
            <p className="eyebrow flex items-center gap-3">
              <span className="rule-brass" aria-hidden="true" />
              Announcements
            </p>
            <h2 id="news-title" className="mt-4 font-heading text-[1.875rem] font-bold sm:text-[2.5rem]">
              Latest from the group
            </h2>
          </div>
          <div className="lg:col-span-8">
            {announcements.length === 0 ? (
              <EmptyState icon={Megaphone} title="No announcements yet" description="News, seminars and calls for collaboration will be listed here." />
            ) : (
              <ul className="border-b border-border">
                {announcements.map((a) => (
                  <li key={a.id} className="grid gap-2 border-t border-border py-7 sm:grid-cols-[9rem_1fr] sm:gap-8">
                    <time dateTime={a.publishedAt} className="text-sm font-medium text-muted-foreground tabular-nums">
                      {formatDate(a.publishedAt)}
                    </time>
                    <div>
                      <h3 className="flex flex-wrap items-center gap-3 font-heading text-lg leading-snug font-bold">
                        {a.title}
                        {a.isDemo && <DemoTag />}
                      </h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{a.summary}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {/* 9. Contact */}
      <section aria-labelledby="contact-title" className="border-t border-border">
        <div className="container-page py-20 lg:py-24">
          <div className="grid gap-10 border border-navy-900/15 bg-paper p-8 sm:p-12 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <h2 id="contact-title" className="font-heading text-[1.875rem] leading-tight font-bold sm:text-4xl">
                Interested in working with RIGIS?
              </h2>
              <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-muted-foreground">
                We welcome enquiries about research collaboration, postgraduate supervision and
                industry partnerships.
              </p>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
              {[
                { icon: Handshake, title: "Collaboration", text: "Joint projects and partnerships" },
                { icon: Mail, title: "Research enquiries", text: "Questions about our work" },
              ].map(({ icon: Icon, title, text }) => (
                <li key={title}>
                  <Link
                    href="/contact/"
                    className="group flex h-full items-start gap-4 border border-border bg-card p-5 transition-colors hover:border-navy-800/40"
                  >
                    <Icon className="mt-0.5 size-5 shrink-0 text-navy-800" aria-hidden="true" />
                    <span>
                      <span className="block font-heading font-bold text-navy-900">{title}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{text}</span>
                    </span>
                    <ArrowRight className="ml-auto size-4 shrink-0 self-center text-navy-800 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
