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
  demoAreas,
  demoProfiles,
  demoProjects,
  demoPublications,
  demoSiteContent,
} from "./demo";
import { memberProfiles, memberPublications } from "./members";

const profiles = [...memberProfiles, ...demoProfiles];
const publications = [...memberPublications, ...demoPublications];

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
    projects: demoProjects,
    areas: demoAreas,
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
  return demoProjects.map((p) => p.slug);
}

export const isDemoMode = true;
