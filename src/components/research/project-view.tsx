import Link from "next/link";
import { ArrowLeft, FileText, Download } from "lucide-react";
import type { ResearchProject } from "@/types/domain";
import type { PublicDataset } from "@/lib/data";
import { areaMap, displayName, profileMap } from "@/lib/data/selectors";
import { ProjectCover } from "./project-cover";
import { ProjectStatusBadge } from "./status-badge";
import { PublicationItem } from "./publication-item";
import { ProfileAvatar } from "@/components/people/profile-avatar";
import { profileHref } from "@/components/people/researcher-card";
import { DemoTag } from "@/components/layout/demo-banner";
import { formatBytes, yearRange } from "@/lib/format";

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="grid gap-4 border-t border-border pt-8 md:grid-cols-[12rem_1fr] md:gap-10">
      <h2 id={id} className="font-heading text-lg font-bold">{title}</h2>
      <div>{children}</div>
    </section>
  );
}

export function ProjectView({ project, data }: { project: ResearchProject; data: PublicDataset }) {
  const people = profileMap(data);
  const areas = areaMap(data);
  const pi = project.principalInvestigatorId ? people.get(project.principalInvestigatorId) : undefined;
  const collaborators = project.members
    .filter((m) => m.profileId !== project.principalInvestigatorId)
    .map((m) => ({ ...m, profile: people.get(m.profileId) }))
    .filter((m) => m.profile !== undefined);
  const projectAreas = project.areaIds.map((id) => areas.get(id)).filter((a) => a !== undefined);
  const publications = data.publications.filter((p) => project.publicationIds.includes(p.id));
  const period = yearRange(project.startYear, project.endYear);

  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page pt-10 sm:pt-14">
          <Link
            href="/research/"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-navy-900"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All research
          </Link>
          <div className="mt-8 grid gap-8 pb-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-2">
                <ProjectStatusBadge status={project.status} />
                {project.isDemo && <DemoTag />}
              </div>
              <h1 className="mt-5 font-heading text-[2.125rem] leading-[1.1] font-extrabold sm:text-5xl">{project.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{project.abstract}</p>
            </div>
            <dl className="grid content-end gap-5 text-[0.9375rem] sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-border lg:pl-8">
              {pi && (
                <div>
                  <dt className="eyebrow">Principal investigator</dt>
                  <dd className="mt-1.5">
                    <Link href={profileHref(pi.slug)} className="font-semibold text-navy-800 hover:underline">
                      {displayName(pi)}
                    </Link>
                  </dd>
                </div>
              )}
              {period && (
                <div>
                  <dt className="eyebrow">Period</dt>
                  <dd className="mt-1.5 tabular-nums">{period}</dd>
                </div>
              )}
              {projectAreas.length > 0 && (
                <div className="sm:col-span-2 lg:col-span-1">
                  <dt className="eyebrow">Research areas</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-2">
                    {projectAreas.map((a) => (
                      <Link
                        key={a.id}
                        href={`/research/?area=${a.slug}`}
                        className="rounded-sm border border-border bg-card px-2.5 py-1 text-sm text-navy-900 hover:border-navy-800/40"
                      >
                        {a.name}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        <div className="container-page">
          <div className="aspect-[21/9] overflow-hidden border border-b-0 border-border">
            <ProjectCover slug={project.slug} title={project.title} coverUrl={project.coverUrl} priority />
          </div>
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="space-y-12 lg:col-span-8">
          {project.description && (
            <Block id="desc" title="Overview">
              <div className="prose-rigis">
                {project.description.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Block>
          )}
          {project.objectives.length > 0 && (
            <Block id="objectives" title="Objectives">
              <ol className="space-y-3">
                {project.objectives.map((o, i) => (
                  <li key={o} className="grid grid-cols-[2rem_1fr] gap-2 text-[1.0625rem] leading-relaxed">
                    <span className="font-heading text-sm font-semibold text-brass-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {o}
                  </li>
                ))}
              </ol>
            </Block>
          )}
          {project.methodology && (
            <Block id="method" title="Methodology">
              <div className="prose-rigis">
                {project.methodology.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Block>
          )}
          {project.outcomes && (
            <Block id="outcomes" title="Outcomes">
              <div className="prose-rigis">
                {project.outcomes.split(/\n{2,}/).map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </Block>
          )}
          {publications.length > 0 && (
            <Block id="pubs" title="Related publications">
              <ul className="-mt-5 border-b border-border">
                {publications.map((pub) => (
                  <PublicationItem key={pub.id} publication={pub} profiles={people} />
                ))}
              </ul>
            </Block>
          )}
        </div>

        <aside className="space-y-10 lg:col-span-4" aria-label="Project team and documents">
          <section aria-labelledby="team-title">
            <h2 id="team-title" className="eyebrow">Research team</h2>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {[...(pi ? [{ profileId: pi.id, projectRole: "Principal investigator", profile: pi }] : []), ...collaborators].map(
                (m) => (
                  <li key={m.profileId}>
                    <Link href={profileHref(m.profile!.slug)} className="group flex items-center gap-4 py-3">
                      <ProfileAvatar
                        name={m.profile!.fullName}
                        photoUrl={m.profile!.photoUrl}
                        className="aspect-square w-12 shrink-0"
                        textClassName="text-sm"
                      />
                      <span className="min-w-0">
                        <span className="block truncate font-semibold text-navy-900 group-hover:underline">
                          {displayName(m.profile!)}
                        </span>
                        <span className="block text-sm text-muted-foreground">{m.projectRole}</span>
                      </span>
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </section>

          {project.documents.length > 0 && (
            <section aria-labelledby="docs-title">
              <h2 id="docs-title" className="eyebrow">Supporting documents</h2>
              <ul className="mt-4 space-y-2">
                {project.documents.map((d) => (
                  <li key={d.id}>
                    <a
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-12 items-center gap-3 border border-border bg-card px-4 py-2 hover:border-navy-800/40"
                    >
                      <FileText className="size-4 shrink-0 text-navy-800" aria-hidden="true" />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.title}</span>
                      {d.sizeBytes && <span className="text-xs text-muted-foreground">{formatBytes(d.sizeBytes)}</span>}
                      <Download className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
