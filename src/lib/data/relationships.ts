/**
 * Relationship queries shared by the homepage explorers, profile pages and
 * the research network. Every relationship carries its basis so the UI can
 * say *why* two things are connected:
 *
 * - "project"     verified: listed on an approved project
 * - "publication" verified: co-authors on a published paper
 * - "interest"    declared: the researcher lists a matching research interest
 */
import type { PublicDataset } from "./index";
import type { PublicProfile, Publication, ResearchArea, ResearchProject } from "@/types/domain";
import { byPublicationDate, projectsForProfile } from "./selectors";

export type RelationBasis = "project" | "publication" | "interest";

const norm = (s: string) => s.trim().toLowerCase();

/** Areas whose keywords appear in a single stated research interest. */
export function areasForInterest(areas: ResearchArea[], interest: string): ResearchArea[] {
  const i = norm(interest);
  return areas.filter((a) => a.interestKeywords.some((k) => i.includes(norm(k))));
}

export interface AreaLink {
  area: ResearchArea;
  basis: Extract<RelationBasis, "project" | "interest">;
  /** The researcher's own interests that produced an interest match. */
  matchedInterests: string[];
}

/** Areas a researcher is connected to: via projects first, then stated interests. */
export function areaLinksForProfile(data: PublicDataset, profile: PublicProfile): AreaLink[] {
  const byId = new Map(data.areas.map((a) => [a.id, a]));
  const links = new Map<string, AreaLink>();
  for (const project of projectsForProfile(data, profile.id)) {
    for (const id of project.areaIds) {
      const area = byId.get(id);
      if (area) links.set(id, { area, basis: "project", matchedInterests: [] });
    }
  }
  for (const interest of profile.researchInterests) {
    for (const area of areasForInterest(data.areas, interest)) {
      const existing = links.get(area.id);
      if (existing?.basis === "project") continue;
      const matched = existing ? [...existing.matchedInterests, interest] : [interest];
      links.set(area.id, { area, basis: "interest", matchedInterests: matched });
    }
  }
  return [...links.values()];
}

export interface AreaResearcher {
  profile: PublicProfile;
  basis: Extract<RelationBasis, "project" | "interest">;
  matchedInterests: string[];
}

export function researchersForArea(data: PublicDataset, areaId: string): AreaResearcher[] {
  return data.profiles
    .map((profile) => {
      const link = areaLinksForProfile(data, profile).find((l) => l.area.id === areaId);
      return link ? { profile, basis: link.basis, matchedInterests: link.matchedInterests } : null;
    })
    .filter((r): r is AreaResearcher => r !== null)
    .sort((a, b) => (a.basis === b.basis ? a.profile.fullName.localeCompare(b.profile.fullName) : a.basis === "project" ? -1 : 1));
}

export function projectsForArea(data: PublicDataset, areaId: string): ResearchProject[] {
  return data.projects.filter((p) => p.areaIds.includes(areaId));
}

/** Members credited as authors on a publication. */
export function memberAuthors(pub: Publication, data: PublicDataset): PublicProfile[] {
  const byId = new Map(data.profiles.map((p) => [p.id, p]));
  const ids = [...new Set(pub.authors.map((a) => a.profileId).filter((id): id is string => !!id))];
  return ids.map((id) => byId.get(id)).filter((p): p is PublicProfile => p !== undefined);
}

/** Publications co-authored by two or more RIGIS members, newest first. */
export function sharedPublications(data: PublicDataset): Publication[] {
  return data.publications.filter((p) => memberAuthors(p, data).length >= 2).sort(byPublicationDate);
}

export interface Collaborator {
  profile: PublicProfile;
  sharedPublications: number;
}

/** Fellow members a researcher has co-authored with, most frequent first. */
export function collaboratorsFor(data: PublicDataset, profileId: string): Collaborator[] {
  const counts = new Map<string, number>();
  for (const pub of data.publications) {
    const authors = memberAuthors(pub, data).map((p) => p.id);
    if (!authors.includes(profileId)) continue;
    for (const id of authors) if (id !== profileId) counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  const byId = new Map(data.profiles.map((p) => [p.id, p]));
  return [...counts.entries()]
    .map(([id, n]) => ({ profile: byId.get(id)!, sharedPublications: n }))
    .filter((c) => c.profile)
    .sort((a, b) => b.sharedPublications - a.sharedPublications || a.profile.fullName.localeCompare(b.profile.fullName));
}
