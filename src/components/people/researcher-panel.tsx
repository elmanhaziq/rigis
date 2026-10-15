"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Users } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import type { PublicProfile } from "@/types/domain";
import { displayName, projectsForProfile, publicationsForProfile } from "@/lib/data/selectors";
import { areasForInterest, collaboratorsFor } from "@/lib/data/relationships";
import { ProfileAvatar } from "./profile-avatar";
import { StatusTag } from "@/components/layout/demo-banner";
import { ProjectStatusBadge } from "@/components/research/status-badge";
import { projectHref } from "@/components/research/project-card";
import { roleLabels } from "@/config/site";

/**
 * Everything a visitor needs to understand one researcher, in a compact,
 * scrollable panel: who they are, what they work on, who they work with and
 * what they have published. Interests that map to a research area become
 * links into the research explorer; collaborators switch the panel.
 */
export function ResearcherPanelContent({
  profile,
  data,
  onSelectResearcher,
  onSelectArea,
  titleId,
}: {
  profile: PublicProfile;
  data: PublicDataset;
  onSelectResearcher: (slug: string) => void;
  onSelectArea: (slug: string) => void;
  titleId?: string;
}) {
  const projects = projectsForProfile(data, profile.id);
  const publications = publicationsForProfile(data, profile.id);
  const collaborators = collaboratorsFor(data, profile.id);
  const links = [
    profile.googleScholar && { href: profile.googleScholar, label: "Google Scholar" },
    profile.orcid && { href: profile.orcid.startsWith("http") ? profile.orcid : `https://orcid.org/${profile.orcid}`, label: "ORCID" },
    profile.linkedin && { href: profile.linkedin, label: "LinkedIn" },
  ].filter((l): l is { href: string; label: string } => Boolean(l));

  return (
    <div className="space-y-8">
      <header className="flex gap-5">
        <ProfileAvatar
          name={profile.fullName}
          photoUrl={profile.photoUrl}
          className="w-24 shrink-0 border border-border sm:w-28"
          textClassName="text-2xl"
        />
        <div className="min-w-0 self-end">
          <p className="eyebrow flex flex-wrap items-center gap-2">
            {roleLabels[profile.role]}
            <StatusTag status={profile.isDemo ? "demo" : "verified"} />
          </p>
          <h2 id={titleId} className="mt-2 font-heading text-2xl leading-tight font-extrabold sm:text-[1.75rem]">
            {displayName(profile)}
          </h2>
          {profile.position && <p className="mt-1 text-muted-foreground">{profile.position}</p>}
        </div>
      </header>

      {profile.biography && (
        <section aria-label="Biography" className="space-y-3 text-[0.9375rem] leading-relaxed text-foreground/90">
          {profile.biography.split(/\n{2,}/).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      )}

      {profile.researchInterests.length > 0 && (
        <section aria-labelledby="rp-interests">
          <h3 id="rp-interests" className="eyebrow">Research interests</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.researchInterests.map((interest) => {
              const area = areasForInterest(data.areas, interest)[0];
              return (
                <li key={interest}>
                  {area ? (
                    <button
                      type="button"
                      onClick={() => onSelectArea(area.slug)}
                      className="inline-flex min-h-9 items-center gap-1.5 rounded-sm border border-navy-800/30 bg-card px-3 text-sm font-medium text-navy-900 transition-colors hover:border-navy-800 hover:bg-accent"
                      aria-label={`${interest} — explore ${area.name}`}
                    >
                      {interest}
                      <ArrowRight className="size-3.5 text-muted-foreground" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="inline-flex min-h-9 items-center rounded-sm border border-border bg-card px-3 text-sm text-navy-900">
                      {interest}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {profile.qualifications.length > 0 && (
        <section aria-labelledby="rp-quals">
          <h3 id="rp-quals" className="eyebrow">Qualifications</h3>
          <ul className="mt-3 space-y-2">
            {profile.qualifications.map((q) => (
              <li key={`${q.degree}-${q.institution}`} className="border-l-2 border-brass pl-3 text-[0.9375rem]">
                <span className="font-medium text-navy-900">{q.degree}</span>
                <span className="text-muted-foreground"> · {q.institution}{q.year ? `, ${q.year}` : ""}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {collaborators.length > 0 && (
        <section aria-labelledby="rp-collab">
          <h3 id="rp-collab" className="eyebrow flex items-center gap-2">
            <Users className="size-3.5" aria-hidden="true" />
            Works with in RIGIS
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {collaborators.map(({ profile: c, sharedPublications }) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onSelectResearcher(c.slug)}
                  className="flex w-full items-center gap-3 rounded-sm border border-border p-2 text-left transition-colors hover:border-navy-800/40"
                >
                  <ProfileAvatar name={c.fullName} photoUrl={c.photoUrl} className="aspect-square w-10 shrink-0" textClassName="text-xs" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy-900">{displayName(c)}</span>
                    <span className="block text-xs text-muted-foreground">
                      {sharedPublications} shared {sharedPublications === 1 ? "paper" : "papers"}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="rp-projects">
        <h3 id="rp-projects" className="eyebrow">Projects</h3>
        {projects.length === 0 ? (
          <p className="mt-2 text-[0.9375rem] text-muted-foreground">No approved projects listed yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {projects.map((p) => (
              <li key={p.id}>
                <Link href={projectHref(p.slug)} className="flex min-h-12 items-center justify-between gap-3 py-2 text-[0.9375rem] font-semibold text-navy-900 hover:underline">
                  {p.title}
                  <ProjectStatusBadge status={p.status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {publications.length > 0 && (
        <section aria-labelledby="rp-pubs">
          <h3 id="rp-pubs" className="eyebrow">Recent publications</h3>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {publications.slice(0, 5).map((pub) => {
              const href = pub.doi ? `https://doi.org/${pub.doi}` : pub.url;
              return (
                <li key={pub.id} className="grid grid-cols-[3rem_1fr] gap-2 py-3 text-[0.9375rem]">
                  <span className="text-sm text-muted-foreground tabular-nums">{pub.year}</span>
                  {href ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="font-medium leading-snug text-navy-900 hover:underline">
                      {pub.title}
                      <ExternalLink className="ml-1 inline size-3 text-muted-foreground" aria-hidden="true" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span className="font-medium leading-snug text-navy-900">{pub.title}</span>
                  )}
                </li>
              );
            })}
          </ul>
          {publications.length > 5 && (
            <p className="mt-2 text-sm text-muted-foreground">
              {publications.length - 5} more on the full profile.
            </p>
          )}
        </section>
      )}

      {links.length > 0 && (
        <section aria-labelledby="rp-links">
          <h3 id="rp-links" className="eyebrow">Academic profiles</h3>
          <ul className="mt-2 flex flex-wrap gap-x-5">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline">
                  {l.label}
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
