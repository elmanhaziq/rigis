import type { MetadataRoute } from "next";
import { getProfileSlugs, getProjectSlugs } from "@/lib/data";
import { siteConfig } from "@/config/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticRoutes = ["/", "/about/", "/research/", "/people/", "/network/", "/contact/"];
  const [people, projects] = await Promise.all([getProfileSlugs(), getProjectSlugs()]);
  return [
    ...staticRoutes.map((path) => ({ url: `${base}${path}`, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.8 })),
    ...projects.map((slug) => ({ url: `${base}/research/${slug}/`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...people.map((slug) => ({ url: `${base}/people/${slug}/`, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
