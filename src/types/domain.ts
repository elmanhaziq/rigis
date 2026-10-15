/**
 * Domain types for the public site. They mirror the Supabase schema
 * (supabase/migrations) so the demo data source and the database source are
 * interchangeable behind src/lib/data.
 */

export type MemberRole =
  | "SUPER_ADMIN"
  | "GROUP_LEADER"
  | "LECTURER"
  | "RESEARCHER"
  | "STUDENT";

export type ProjectStatus = "proposed" | "ongoing" | "completed";

export type ApprovalStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "archived";

export type AccountStatus = "pending" | "active" | "rejected" | "suspended";

export interface Qualification {
  degree: string;
  institution: string;
  year?: number | null;
}

export interface PublicProfile {
  id: string;
  slug: string;
  fullName: string;
  /** Honorific / professional title, e.g. "Dr.", "Assoc. Prof." */
  professionalTitle: string | null;
  /** Academic position, e.g. "Senior Lecturer" */
  position: string | null;
  role: MemberRole;
  photoUrl: string | null;
  biography: string | null;
  qualifications: Qualification[];
  researchInterests: string[];
  orcid: string | null;
  googleScholar: string | null;
  linkedin: string | null;
  publicEmail: string | null;
  publicPhone: string | null;
  office: string | null;
  isDemo: boolean;
}

export interface ResearchArea {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  isDemo: boolean;
}

export interface ProjectMember {
  profileId: string;
  /** Free-text role on the project, e.g. "Co-investigator" */
  projectRole: string;
}

export interface ProjectDocument {
  id: string;
  title: string;
  /** Public URL; only present for approved, public documents. */
  url: string;
  sizeBytes: number | null;
}

export interface ResearchProject {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  description: string | null;
  objectives: string[];
  methodology: string | null;
  outcomes: string | null;
  coverUrl: string | null;
  status: ProjectStatus;
  featured: boolean;
  startYear: number | null;
  endYear: number | null;
  principalInvestigatorId: string | null;
  members: ProjectMember[];
  areaIds: string[];
  publicationIds: string[];
  documents: ProjectDocument[];
  approvedAt: string | null;
  isDemo: boolean;
}

export interface PublicationAuthor {
  /** Linked RIGIS profile, if the author is a member. */
  profileId: string | null;
  displayName: string;
}

export interface Publication {
  id: string;
  title: string;
  venue: string | null;
  year: number | null;
  publicationType: "journal" | "conference" | "book-chapter" | "report" | "other";
  doi: string | null;
  url: string | null;
  authors: PublicationAuthor[];
  isDemo: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  body: string | null;
  publishedAt: string;
  isDemo: boolean;
}

export interface Collaboration {
  id: string;
  partnerName: string;
  description: string | null;
  url: string | null;
  isDemo: boolean;
}

/** Editable About-page and contact content (site_content table). */
export interface SiteContent {
  introduction: string;
  background: string;
  vision: string;
  mission: string;
  objectives: string[];
  philosophy: string;
  affiliation: string;
  contactEmail: string | null;
  contactPhone: string | null;
  address: string | null;
  isDemo: boolean;
}
