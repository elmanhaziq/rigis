import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";
import type { PublicProfile } from "@/types/domain";
import type { PublicDataset } from "@/lib/data";
import {
  areaMap,
  areasForProfile,
  displayName,
  profileMap,
  projectsForProfile,
  publicationsForProfile,
} from "@/lib/data/selectors";
import { ProfileAvatar } from "./profile-avatar";
import { ProjectCard } from "@/components/research/project-card";
import { PublicationItem } from "@/components/research/publication-item";
import { DemoTag } from "@/components/layout/demo-banner";
import { roleLabels } from "@/config/site";

function ExternalProfileLink({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex min-h-11 items-center justify-between gap-3 border-b border-border text-[0.9375rem] font-medium text-navy-800 hover:text-navy-900"
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
  const areas = areasForProfile(data, profile.id);
  const people = profileMap(data);
  const areaById = areaMap(data);
  const orcidUrl = profile.orcid
    ? profile.orcid.startsWith("http") ? profile.orcid : `https://orcid.org/${profile.orcid}`
    : null;

  return (
    <article>
      <header className="border-b border-border">
        <div className="container-page py-10 sm:py-14">
          <Link
            href="/people/"
            className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-navy-900"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All people
          </Link>
          <div className="mt-8 grid gap-10 md:grid-cols-12 md:items-end">
            <div className="max-w-[260px] md:col-span-3 md:max-w-none">
              <ProfileAvatar
                name={profile.fullName}
                photoUrl={profile.photoUrl}
                className="border border-border"
                textClassName="text-6xl"
              />
            </div>
            <div className="md:col-span-9 md:pl-4">
              <p className="eyebrow flex flex-wrap items-center gap-3">
                <span className="rule-brass" aria-hidden="true" />
                {roleLabels[profile.role]}
                {profile.isDemo && <DemoTag />}
              </p>
              <h1 className="mt-4 font-heading text-[2.25rem] leading-[1.1] font-extrabold sm:text-5xl">
                {displayName(profile)}
              </h1>
              {profile.position && <p className="mt-3 text-xl text-muted-foreground">{profile.position}</p>}
              {profile.researchInterests.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Research interests">
                  {profile.researchInterests.map((i) => (
                    <li key={i} className="rounded-sm border border-border bg-card px-3 py-1.5 text-sm text-navy-900">
                      {i}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <div className="space-y-16 lg:col-span-8">
          <section aria-labelledby="bio-title">
            <h2 id="bio-title" className="font-heading text-2xl font-bold">Biography</h2>
            <div className="prose-rigis mt-5">
              {profile.biography ? (
                profile.biography.split(/\n{2,}/).map((para, i) => <p key={i}>{para}</p>)
              ) : (
                <p className="text-muted-foreground">No biography has been added yet.</p>
              )}
            </div>
          </section>

          <section aria-labelledby="projects-title">
            <h2 id="projects-title" className="font-heading text-2xl font-bold">Research projects</h2>
            {projects.length === 0 ? (
              <p className="mt-5 text-muted-foreground">No published projects yet.</p>
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
            <h2 id="pubs-title" className="font-heading text-2xl font-bold">Publications</h2>
            {publications.length === 0 ? (
              <p className="mt-5 text-muted-foreground">No publications listed yet.</p>
            ) : (
              <ul className="mt-4 border-b border-border">
                {publications.map((pub) => (
                  <PublicationItem key={pub.id} publication={pub} profiles={people} />
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="space-y-10 lg:col-span-4" aria-label="Profile details">
          {profile.qualifications.length > 0 && (
            <section aria-labelledby="quals-title">
              <h2 id="quals-title" className="eyebrow">Qualifications</h2>
              <ul className="mt-4 space-y-4">
                {profile.qualifications.map((q) => (
                  <li key={`${q.degree}-${q.institution}`} className="border-l-2 border-brass pl-4">
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

          {areas.length > 0 && (
            <section aria-labelledby="areas-title">
              <h2 id="areas-title" className="eyebrow">Research areas</h2>
              <p className="mt-2 text-xs text-muted-foreground">Derived from published project participation.</p>
              <ul className="mt-3">
                {areas.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/research/?area=${a.slug}`}
                      className="flex min-h-11 items-center border-b border-border text-[0.9375rem] text-navy-800 hover:text-navy-900"
                    >
                      {a.name}
                    </Link>
                  </li>
                ))}
              </ul>
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
                    <Mail className="size-4 shrink-0 text-navy-800" aria-hidden="true" />
                    <a href={`mailto:${profile.publicEmail}`} className="break-all text-navy-800 hover:underline">
                      {profile.publicEmail}
                    </a>
                  </li>
                )}
                {profile.publicPhone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 shrink-0 text-navy-800" aria-hidden="true" />
                    <a href={`tel:${profile.publicPhone.replace(/\s/g, "")}`} className="text-navy-800 hover:underline">
                      {profile.publicPhone}
                    </a>
                  </li>
                )}
                {profile.office && (
                  <li className="flex items-center gap-3">
                    <MapPin className="size-4 shrink-0 text-navy-800" aria-hidden="true" />
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
