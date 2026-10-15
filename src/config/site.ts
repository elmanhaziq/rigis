export const siteConfig = {
  shortName: "RIGIS",
  name: "Research Initiative Group Intelligent System",
  description:
    "Research Initiative Group Intelligent System (RIGIS) brings together academics, researchers and students to explore intelligent technologies, develop innovative solutions and advance knowledge through research and collaboration.",
  /** Canonical origin used for metadata, sitemap and robots. Set in Cloudflare. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://rigis.pages.dev").replace(/\/$/, ""),
} as const;

export const mainNav = [
  { href: "/about/", label: "About" },
  { href: "/research/", label: "Research" },
  { href: "/people/", label: "People" },
  { href: "/network/", label: "Network" },
  { href: "/contact/", label: "Contact" },
] as const;

export const roleLabels = {
  SUPER_ADMIN: "Administrator",
  GROUP_LEADER: "Group Leader",
  LECTURER: "Lecturer",
  RESEARCHER: "Researcher",
  STUDENT: "Student",
} as const;

export const projectStatusLabels = {
  proposed: "Proposed",
  ongoing: "Ongoing",
  completed: "Completed",
} as const;
