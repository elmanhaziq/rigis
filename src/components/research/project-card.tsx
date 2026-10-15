import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PublicProfile, ResearchArea, ResearchProject } from "@/types/domain";
import { ProjectCover } from "./project-cover";
import { ProjectStatusBadge } from "./status-badge";
import { DemoTag } from "@/components/layout/demo-banner";
import { displayName } from "@/lib/data/selectors";
import { cn } from "@/lib/utils";

export function projectHref(slug: string) {
  return `/research/${slug}/`;
}

/** Research project summary. The whole card is one link target. */
export function ProjectCard({
  project,
  areas,
  pi,
  variant = "default",
  headingLevel: H = "h3",
}: {
  project: ResearchProject;
  areas: ResearchArea[];
  pi?: PublicProfile;
  variant?: "default" | "feature";
  headingLevel?: "h2" | "h3";
}) {
  const feature = variant === "feature";
  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-[border-color,box-shadow] duration-200",
        "hover:border-purple-400 hover:shadow-[0_12px_32px_-18px_rgba(16,36,58,0.35)]",
        feature && "md:flex-row",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          feature ? "aspect-[16/9] md:aspect-auto md:w-1/2" : "aspect-[16/9]",
        )}
      >
        <ProjectCover
          slug={project.slug}
          title={project.title}
          coverUrl={project.coverUrl}
          className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className={cn("flex flex-1 flex-col p-6", feature && "md:p-8")}>
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge status={project.status} />
          {project.isDemo && <DemoTag />}
        </div>
        <H
          className={cn(
            "mt-4 font-heading font-bold text-navy-900",
            feature ? "text-2xl leading-tight" : "text-xl leading-snug",
          )}
        >
          <Link
            href={projectHref(project.slug)}
            className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-offset-[-2px] after:focus-visible:outline-purple-700"
          >
            {project.title}
          </Link>
        </H>
        <p className={cn("mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground", !feature && "line-clamp-3")}>
          {project.abstract}
        </p>
        <div className="mt-auto pt-6">
          {areas.length > 0 && (
            <p className="text-[0.8125rem] text-muted-foreground">
              {areas.map((a) => a.name).join(" · ")}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4">
            <p className="text-[0.8125rem]">
              {pi ? (
                <>
                  <span className="text-muted-foreground">Led by </span>
                  <span className="font-medium text-navy-900">{displayName(pi)}</span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  {project.startYear ? `Since ${project.startYear}` : " "}
                </span>
              )}
            </p>
            <ArrowUpRight
              className="size-4 shrink-0 text-purple-700 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
