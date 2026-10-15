/**
 * Public data access. Pages and components read public content only through
 * these functions so the source can change without touching the UI.
 *
 * Phase 1: returns the clearly-labelled demonstration dataset.
 * Phase 2: reads approved records from Supabase (RLS guarantees only approved,
 * public rows are returned to anonymous visitors).
 *
 * The functions run both at build time (static export) and in the browser.
 */
import type {
  Announcement,
  PublicProfile,
  Publication,
  ResearchArea,
  ResearchProject,
  SiteContent,
} from "@/types/domain";
import {
  demoAnnouncements,
  demoSiteContent,
} from "./demo";
import { memberProfiles, memberPublications } from "./members";
import { projects } from "./projects";
import { researchAreas } from "./areas";

const profiles = memberProfiles;
const publications = memberPublications;

export interface PublicDataset {
  profiles: PublicProfile[];
  projects: ResearchProject[];
  areas: ResearchArea[];
  publications: Publication[];
  announcements: Announcement[];
  site: SiteContent;
}

export async function getPublicDataset(): Promise<PublicDataset> {
  return {
    profiles,
    projects,
    areas: researchAreas,
    publications,
    announcements: [...demoAnnouncements].sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    ),
    site: demoSiteContent,
  };
}

export async function getProfileSlugs(): Promise<string[]> {
  return profiles.map((p) => p.slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  return projects.map((p) => p.slug);
}

export const isDemoMode = true;

/**
 * Placeholder segment always generated for /people/[slug] and
 * /research/[slug]. Static export requires at least one page per dynamic
 * route, and Phase 2 rewrites unknown slugs to this page so records approved
 * after the last build can load client-side.
 */
export const FALLBACK_SLUG = "_";

/**
 * A lighter copy of the dataset for client components that only need
 * relationships. Publications in the recent window keep their full record
 * (with RIGIS-member authors only); older ones keep just their identity,
 * year and RIGIS authors, which is all the counts need. Keeps the homepage
 * payload small as records grow.
 */
export function slimDataset(data: PublicDataset, recentSince: number): PublicDataset {
  return {
    ...data,
    publications: data.publications.map((p) => {
      const authors = p.authors.filter((a) => a.profileId !== null);
      if ((p.year ?? 0) >= recentSince) return { ...p, authors };
      return { ...p, title: "", venue: null, doi: null, url: null, publishedOn: null, authors };
    }),
  };
}
