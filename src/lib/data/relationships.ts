/**
 * Relationship queries shared by the homepage explorers, profile pages and
 * the research network. Every relationship carries its basis so the UI can
 * say *why* two things are connected:
 *
 * - "project"     verified: listed on an approved project
 * - "publication" verified: co-authors on a published paper
 * - "topic"       derived: the researcher's own papers whose titles match an
 *                 area's topic keywords
 * - "interest"    declared: the researcher lists a matching research interest
 */
import type { PublicDataset } from "./index";
import type { PublicProfile, Publication, ResearchArea, ResearchProject } from "@/types/domain";
import { byPublicationDate, projectsForProfile } from "./selectors";

export type RelationBasis = "project" | "publication" | "topic" | "interest";
export type AreaBasis = Extract<RelationBasis, "project" | "topic" | "interest">;

/** Fewest matching papers for a topic link, so one stray title does not create one. */
export const MIN_TOPIC_PAPERS = 2;

const norm = (s: string) => s.trim().toLowerCase();
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Areas whose keywords appear in a single stated research interest. */
export function areasForInterest(areas: ResearchArea[], interest: string): ResearchArea[] {
  const i = norm(interest);
  return areas.filter((a) => a.interestKeywords.some((k) => i.includes(norm(k))));
}

const topicPatterns = new WeakMap<ResearchArea, RegExp>();
function topicPattern(area: ResearchArea): RegExp {
  let re = topicPatterns.get(area);
  if (!re) {
    // Whole words, plurals included: "image" matches "images", not "imagery".
    re = new RegExp(`\\b(?:${area.topicKeywords.map((k) => escape(norm(k))).join("|")})(?:s|es)?\\b`, "i");
    topicPatterns.set(area, re);
  }
  return re;
}

/** Ids of the areas whose topic keywords appear in a publication title. */
export function topicAreaIds(areas: ResearchArea[], title: string): string[] {
  return areas.filter((a) => a.topicKeywords.length > 0 && topicPattern(a).test(title)).map((a) => a.id);
}

export interface AreaLink {
  area: ResearchArea;
  /** Strongest basis: approved project, then papers on the topic, then stated interest. */
  basis: AreaBasis;
  /** The researcher's own interests that match the area (kept alongside other bases). */
  matchedInterests: string[];
  /** The researcher's papers whose titles match the area's topic keywords. */
  topicPapers: number;
}

/** Areas a researcher is connected to, strongest basis first. */
export function areaLinksForProfile(data: PublicDataset, profile: PublicProfile): AreaLink[] {
  const viaProject = new Set(projectsForProfile(data, profile.id).flatMap((p) => p.areaIds));
  const papers = new Map<string, number>();
  for (const pub of data.publications) {
    if (!pub.areaIds?.length || !pub.authors.some((a) => a.profileId === profile.id)) continue;
    for (const id of pub.areaIds) papers.set(id, (papers.get(id) ?? 0) + 1);
  }
  const rank: Record<AreaBasis, number> = { project: 0, topic: 1, interest: 2 };
  return data.areas
    .map((area): AreaLink | null => {
      const matchedInterests = profile.researchInterests.filter((i) => areasForInterest([area], i).length > 0);
      const topicPapers = papers.get(area.id) ?? 0;
      const basis: AreaBasis | null = viaProject.has(area.id)
        ? "project"
        : topicPapers >= MIN_TOPIC_PAPERS
          ? "topic"
          : matchedInterests.length > 0
            ? "interest"
            : null;
      return basis ? { area, basis, matchedInterests, topicPapers } : null;
    })
    .filter((l): l is AreaLink => l !== null)
    .sort((a, b) => rank[a.basis] - rank[b.basis] || b.topicPapers - a.topicPapers);
}

/** One-line reason for an area link, for profiles and the area explorer. */
export function describeAreaLink(link: Pick<AreaLink, "basis" | "matchedInterests" | "topicPapers">): string {
  const parts: string[] = [];
  if (link.basis === "project") parts.push("Through approved projects");
  if (link.topicPapers >= MIN_TOPIC_PAPERS) parts.push(`${link.topicPapers} papers on this topic`);
  if (link.matchedInterests.length > 0) parts.push(`Stated interest: ${link.matchedInterests.join(", ")}`);
  return parts.join(" · ");
}

export interface AreaResearcher extends Omit<AreaLink, "area"> {
  profile: PublicProfile;
}

export function researchersForArea(data: PublicDataset, areaId: string): AreaResearcher[] {
  const rank: Record<AreaBasis, number> = { project: 0, topic: 1, interest: 2 };
  return data.profiles
    .map((profile) => {
      const link = areaLinksForProfile(data, profile).find((l) => l.area.id === areaId);
      return link ? { profile, basis: link.basis, matchedInterests: link.matchedInterests, topicPapers: link.topicPapers } : null;
    })
    .filter((r): r is AreaResearcher => r !== null)
    .sort(
      (a, b) =>
        rank[a.basis] - rank[b.basis] ||
        b.topicPapers - a.topicPapers ||
        a.profile.fullName.localeCompare(b.profile.fullName),
    );
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

/**
 * The window used by the homepage figures: the latest three publication
 * years present in the data. Full records stay on profiles and the network.
 */
export function recentWindow(data: PublicDataset, years = 3) {
  const maxYear = Math.max(0, ...data.publications.map((p) => p.year ?? 0));
  const since = maxYear - (years - 1);
  return { since, publications: data.publications.filter((p) => (p.year ?? 0) >= since) };
}
