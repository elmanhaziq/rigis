import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FALLBACK_SLUG, getProjectSlugs, getPublicDataset } from "@/lib/data";
import { RecordUnavailable } from "@/components/layout/record-unavailable";
import { ProjectView } from "@/components/research/project-view";

export const dynamicParams = false;

export async function generateStaticParams() {
  return [...(await getProjectSlugs()), FALLBACK_SLUG].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) return { title: "Not found", robots: { index: false } };
  const { projects } = await getPublicDataset();
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.abstract.slice(0, 160),
    alternates: { canonical: `/research/${slug}/` },
    openGraph: { type: "article", title: project.title, description: project.abstract.slice(0, 200), url: `/research/${slug}/` },
  };
}

export default async function ProjectPage({ params }: PageProps<"/research/[slug]">) {
  const { slug } = await params;
  if (slug === FALLBACK_SLUG) return <RecordUnavailable kind="project" />;
  const data = await getPublicDataset();
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectView project={project} data={data} />;
}
