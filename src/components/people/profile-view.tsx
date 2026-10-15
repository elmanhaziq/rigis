import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import type { PublicProfile } from "@/types/domain";
import type { PublicDataset } from "@/lib/data";
import {
  areaMap,
  displayName,
  profileMap,
  projectsForProfile,
  publicationsForProfile,
} from "@/lib/data/selectors";
import { ProfileAvatar } from "./profile-avatar";
import { areaLinksForProfile, areasForInterest, collaboratorsFor } from "@/lib/data/relationships";
import { ProjectCard } from "@/components/research/project-card";
import { PublicationList } from "@/components/research/publication-list";
import { DemoTag } from "@/components/layout/demo-banner";
import { roleLabels } from "@/config/site";

function ExternalProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center justify-between gap-3 border-b border-border text-[0.9375rem] font-medium text-purple-700 hover:text-navy-900"
      >
        {label}
        <span className="text-xs text-muted-foreground" aria-hidden="true">↗</span>
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </li>
  );
}

export function ProfileView({ profile, data }: { profile: PublicProfile; data: PublicDataset }) {
  const projects = projectsForProfile(data, profile.id);
  const publications = publicationsForProfile(data, profile.id);
  const areaLinks = areaLinksForProfile(data, profile);
  const collaborators = collaboratorsFor(data, profile.id);
  const people = profileMap(data);
  const areaById = areaMap(data);
  const orcidUrl = profile.orcid
    ? profile.orcid.startsWith("http") ? profile.orcid : `https://orcid.org/${profile.orcid}`
    : null;

  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page pt-8 pb-12 sm:pt-10 lg:pb-16">
          <Link
            href="/people/"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-purple-700"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All researchers
          </Link>
          <div className="mt-6 grid gap-8 sm:grid-cols-12 sm:gap-10 lg:mt-10">
            <div className="max-w-[320px] sm:col-span-5 sm:max-w-none lg:col-span-4">
              <ProfileAvatar name={profile.fullName} photoUrl={profile.photoUrl} textClassName="text-6xl" />
            </div>
            <div className="flex flex-col sm:col-span-7 lg:col-span-8 lg:pl-6">
              <p className="eyebrow flex flex-wrap items-center gap-3">
                {profile.position ?? roleLabels[profile.role]}
                {profile.isDemo && <DemoTag />}
              </p>
              <h1 className="mt-4 font-heading text-[2.625rem] leading-[1.02] font-normal sm:text-[3.5rem] lg:text-[4.25rem]">
                {profile.professionalTitle && (
                  <span className="block text-[0.5em] leading-tight text-muted-foreground">{profile.professionalTitle}</span>
                )}
                {profile.fullName}
              </h1>
              {profile.researchInterests.length > 0 && (
                <p className="mt-5 font-heading text-[1.1875rem] leading-relaxed text-navy-900 italic sm:text-[1.3125rem]">
                  <span className="sr-only">Research interests: </span>
                  {profile.researchInterests.map((i, idx) => {
                    const area = areasForInterest(data.areas, i)[0];
                    return (
                      <span key={i}>
                        {idx > 0 && <span className="text-purple-400 not-italic" aria-hidden="true"> · </span>}
                        {area ? (
                          <Link
                            href={`/research/?area=${area.slug}`}
                            title={`Explore ${area.name}`}
                            className="decoration-purple-400 underline-offset-4 hover:text-purple-700 hover:underline"
                          >
                            {i}
                          </Link>
                        ) : (
                          i
                        )}
                      </span>
                    );
                  })}
                </p>
              )}
              <dl className="mt-auto grid grid-cols-3 gap-4 border-t border-border pt-6 max-sm:mt-8 sm:pt-8">
                {[
                  { value: publications.length, label: "Recent publications" },
                  { value: collaborators.length, label: "Co-authors in RIGIS" },
                  { value: projects.length, label: "Approved projects" },
                ].map((f) => (
                  <div key={f.label} className="flex flex-col-reverse">
                    <dt className="mt-1 text-[0.8125rem] text-muted-foreground">{f.label}</dt>
                    <dd className="font-heading text-[2rem] leading-none text-navy-900 tabular-nums">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="flex flex-col gap-16 lg:col-span-8">
          <section aria-labelledby="bio-title">
            <h2 id="bio-title" className="eyebrow">Biography</h2>
            {profile.biography ? (
              profile.biography.split(/\n{2,}/).map((para, i) =>
                i === 0 ? (
                  <p key={i} className="dek mt-4 text-navy-900">{para}</p>
                ) : (
                  <p key={i} className="prose-rigis mt-5">{para}</p>
                ),
              )
            ) : (
              <p className="mt-4 text-muted-foreground">No biography has been added yet.</p>
            )}
          </section>

          <section aria-labelledby="projects-title" className={projects.length === 0 ? "order-last" : undefined}>
            <h2 id="projects-title" className="font-heading text-[1.75rem] font-normal">Research projects</h2>
            {projects.length === 0 ? (
              <p className="mt-3 text-muted-foreground">No approved projects are listed yet.</p>
            ) : (
              <ul className="mt-6 grid gap-6 md:grid-cols-2">
                {projects.map((p) => (
                  <li key={p.id}>
                    <ProjectCard
                      project={p}
                      areas={p.areaIds.map((id) => areaById.get(id)).filter((a) => a !== undefined)}
                      pi={p.principalInvestigatorId ? people.get(p.principalInvestigatorId) : undefined}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-labelledby="pubs-title">
            <h2 id="pubs-title" className="font-heading text-[1.75rem] font-normal">Publications</h2>
            {publications.length === 0 ? (
              <p className="mt-5 text-muted-foreground">No publications listed yet.</p>
            ) : (
              <>
                <p className="mt-2 text-sm text-muted-foreground">
                  {publications.length} {publications.length === 1 ? "publication" : "publications"} listed, most recent first.
                  {profile.googleScholar && (
                    <>
                      {" "}
                      <a href={profile.googleScholar} target="_blank" rel="noopener noreferrer" className="font-medium text-purple-700 hover:underline">
                        Full record on Google Scholar
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </>
                  )}
                </p>
                <div className="mt-4">
                  <PublicationList publications={publications} profiles={data.profiles} />
                </div>
              </>
            )}
          </section>
        </div>

        <aside className="space-y-10 lg:col-span-4" aria-label="Profile details">
          {profile.qualifications.length > 0 && (
            <section aria-labelledby="quals-title">
              <h2 id="quals-title" className="eyebrow">Qualifications</h2>
              <ul className="mt-4 space-y-4">
                {profile.qualifications.map((q) => (
                  <li key={`${q.degree}-${q.institution}`} className="border-l-2 border-purple-400 pl-4">
                    <p className="font-medium text-navy-900">{q.degree}</p>
                    <p className="text-sm text-muted-foreground">
                      {q.institution}
                      {q.year ? `, ${q.year}` : ""}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {areaLinks.length > 0 && (
            <section aria-labelledby="areas-title">
              <h2 id="areas-title" className="eyebrow">Research areas</h2>
              <ul className="mt-3">
                {areaLinks.map(({ area, basis, matchedInterests }) => (
                  <li key={area.id}>
                    <Link
                      href={`/research/?area=${area.slug}`}
                      className="flex min-h-12 flex-col justify-center border-b border-border py-2 text-[0.9375rem] text-purple-700 hover:text-navy-900"
                    >
                      {area.name}
                      <span className="text-xs text-muted-foreground">
                        {basis === "project" ? "Through approved projects" : `Stated interest: ${matchedInterests.join(", ")}`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {collaborators.length > 0 && (
            <section aria-labelledby="collab-title">
              <h2 id="collab-title" className="eyebrow">Works with in RIGIS</h2>
              <p className="mt-2 text-xs text-muted-foreground">Co-authors on the publications listed here.</p>
              <ul className="mt-3">
                {collaborators.map(({ profile: c, sharedPublications }) => (
                  <li key={c.id}>
                    <Link href={`/people/${c.slug}/`} className="group flex min-h-14 items-center gap-3 border-b border-border py-2">
                      <ProfileAvatar name={c.fullName} photoUrl={c.photoUrl} className="aspect-square w-10 shrink-0" textClassName="text-xs" />
                      <span className="min-w-0">
                        <span className="block truncate text-[0.9375rem] font-semibold text-navy-900 group-hover:underline">{displayName(c)}</span>
                        <span className="block text-xs text-muted-foreground">
                          {sharedPublications} shared {sharedPublications === 1 ? "paper" : "papers"}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/network/?focus=researcher:${profile.id}`}
                className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-purple-700 hover:underline"
              >
                See connections in the network
              </Link>
            </section>
          )}

          {(orcidUrl || profile.googleScholar || profile.linkedin) && (
            <section aria-labelledby="links-title">
              <h2 id="links-title" className="eyebrow">Academic profiles</h2>
              <ul className="mt-3">
                {orcidUrl && <ExternalProfileLink href={orcidUrl} label="ORCID" />}
                {profile.googleScholar && <ExternalProfileLink href={profile.googleScholar} label="Google Scholar" />}
                {profile.linkedin && <ExternalProfileLink href={profile.linkedin} label="LinkedIn" />}
              </ul>
            </section>
          )}

          {(profile.publicEmail || profile.publicPhone || profile.office) && (
            <section aria-labelledby="contact-title">
              <h2 id="contact-title" className="eyebrow">Institutional contact</h2>
              <ul className="mt-4 space-y-3 text-[0.9375rem]">
                {profile.publicEmail && (
                  <li className="flex items-center gap-3">
                    <Mail className="size-4 shrink-0 text-purple-700" aria-hidden="true" />
                    <a href={`mailto:${profile.publicEmail}`} className="break-all text-purple-700 hover:underline">
                      {profile.publicEmail}
                    </a>
                  </li>
                )}
                {profile.publicPhone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-purple-700" aria-hidden="true" />
                    <a href={`tel:${profile.publicPhone.replace(/\s/g, "")}`} className="text-purple-700 hover:underline">
                      {profile.publicPhone}
                    </a>
                  </li>
                )}
                {profile.office && (
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 shrink-0 text-purple-700" aria-hidden="true" />
                    {profile.office}
                  </li>
                )}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </article>
  );
}
