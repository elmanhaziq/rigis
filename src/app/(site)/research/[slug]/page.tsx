import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectSlugs, getPublicDataset } from "@/lib/data";
import { ProjectView } from "@/components/research/project-view";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/research/[slug]">): Promise<Metadata> {
  const { slug } = await params;
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
  const data = await getPublicDataset();
  const project = data.projects.find((p) => p.slug === slug);
  if (!project) notFound();
  return <ProjectView project={project} data={data} />;
}
