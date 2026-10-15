import type { PublicDataset } from "./index";
import type { PublicProfile, ResearchProject } from "@/types/domain";

/** Projects a person participates in, PI first. */
export function projectsForProfile(data: PublicDataset, profileId: string): ResearchProject[] {
  return data.projects.filter(
    (p) =>
      p.principalInvestigatorId === profileId ||
      p.members.some((m) => m.profileId === profileId),
  );
}

export function publicationsForProfile(data: PublicDataset, profileId: string) {
  return data.publications
    .filter((pub) => pub.authors.some((a) => a.profileId === profileId))
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
}

export function profileMap(data: PublicDataset): Map<string, PublicProfile> {
  return new Map(data.profiles.map((p) => [p.id, p]));
}

export function areaMap(data: PublicDataset) {
  return new Map(data.areas.map((a) => [a.id, a]));
}

/** Research areas a person contributes to through verified project participation. */
export function areasForProfile(data: PublicDataset, profileId: string) {
  const areas = areaMap(data);
  const ids = new Set(projectsForProfile(data, profileId).flatMap((p) => p.areaIds));
  return [...ids].map((id) => areas.get(id)).filter((a) => a !== undefined);
}

export function displayName(p: Pick<PublicProfile, "professionalTitle" | "fullName">) {
  return p.professionalTitle ? `${p.professionalTitle} ${p.fullName}` : p.fullName;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

const ROLE_ORDER = ["GROUP_LEADER", "SUPER_ADMIN", "LECTURER", "RESEARCHER", "STUDENT"];

export function sortProfiles(profiles: PublicProfile[]) {
  return [...profiles].sort(
    (a, b) =>
      ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) ||
      a.fullName.localeCompare(b.fullName),
  );
}
