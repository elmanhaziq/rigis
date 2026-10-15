/**
 * DEMONSTRATION CONTENT ONLY (announcements and About-page text).
 *
 * Every record here is fictional and flagged with isDemo: true so the UI can
 * label it. None of these people, projects or publications exist. This source
 * is used only when Supabase is not configured (see src/lib/data/index.ts) and
 * must be replaced by real RIGIS records entered through the portal.
 */
import type {
  Announcement,
  Collaboration,
  SiteContent,
} from "@/types/domain";

const demo = { isDemo: true } as const;

export const demoSiteContent: SiteContent = {
  ...demo,
  introduction:
    "RIGIS is a research group dedicated to the study and application of intelligent systems. The group brings together academics, researchers and students who share an interest in how computational intelligence can address meaningful problems in science, industry and society.",
  background:
    "This paragraph is placeholder text. Replace it with the founding story of RIGIS: when the group was established, the faculty or department it belongs to, and the research questions that brought its members together.",
  vision:
    "Placeholder vision statement: to be a recognised centre of research excellence in intelligent systems that advances knowledge and delivers responsible, real-world impact.",
  mission:
    "Placeholder mission statement: to conduct rigorous research in intelligent systems, nurture researchers at every career stage, and build collaborations that translate research into practice.",
  objectives: [
    "Conduct high-quality research in intelligent systems and related fields.",
    "Develop innovative, evidence-based solutions to real-world problems.",
    "Support postgraduate and early-career researchers through mentoring and supervision.",
    "Build collaborations with academic, industry and community partners.",
    "Disseminate findings through peer-reviewed publications and public engagement.",
  ],
  philosophy:
    "Placeholder research philosophy: RIGIS values methodological rigour, openness, interdisciplinary collaboration and the responsible use of intelligent technologies. Replace this text with the group's own statement.",
  affiliation: "Institutional affiliation to be confirmed",
  contactEmail: null,
  contactPhone: null,
  address: null,
};


export const demoAnnouncements: Announcement[] = [
  {
    ...demo,
    id: "a-1",
    title: "Demonstration announcement: website launch",
    summary:
      "Placeholder announcement. Group leaders can publish news, seminars and calls for collaboration from the management portal.",
    body: null,
    publishedAt: "2026-10-01T00:00:00Z",
  },
  {
    ...demo,
    id: "a-2",
    title: "Demonstration announcement: research seminar series",
    summary: "Placeholder announcement showing how an upcoming seminar would be listed.",
    body: null,
    publishedAt: "2026-09-15T00:00:00Z",
  },
  {
    ...demo,
    id: "a-3",
    title: "Demonstration announcement: postgraduate opportunities",
    summary: "Placeholder announcement showing how a call for postgraduate applicants would appear.",
    body: null,
    publishedAt: "2026-08-20T00:00:00Z",
  },
];

export const demoCollaborations: Collaboration[] = [];
