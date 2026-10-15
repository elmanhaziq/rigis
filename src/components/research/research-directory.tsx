"use client";

import { useDeferredValue, useMemo } from "react";
import { FlaskConical } from "lucide-react";
import type { PublicProfile, ResearchArea, ResearchProject } from "@/types/domain";
import { ProjectCard } from "./project-card";
import { SearchField, FilterSelect } from "@/components/ui/search-field";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { projectStatusLabels } from "@/config/site";
import { useQueryState } from "@/hooks/use-query-state";

type Sort = "featured" | "newest" | "oldest" | "title";

const sorters: Record<Sort, (a: ResearchProject, b: ResearchProject) => number> = {
  featured: (a, b) => Number(b.featured) - Number(a.featured) || (b.startYear ?? 0) - (a.startYear ?? 0),
  newest: (a, b) => (b.startYear ?? 0) - (a.startYear ?? 0) || a.title.localeCompare(b.title),
  oldest: (a, b) => (a.startYear ?? 9999) - (b.startYear ?? 9999) || a.title.localeCompare(b.title),
  title: (a, b) => a.title.localeCompare(b.title),
};

export function ResearchDirectory({
  projects,
  areas,
  profiles,
}: {
  projects: ResearchProject[];
  areas: ResearchArea[];
  profiles: PublicProfile[];
}) {
  const [query, setQuery] = useQueryState("q");
  const [areaSlug, setAreaSlug] = useQueryState("area");
  const [status, setStatus] = useQueryState("status");
  const [sort, setSort] = useQueryState("sort", "featured");
  const deferredQuery = useDeferredValue(query);

  const areaById = useMemo(() => new Map(areas.map((a) => [a.id, a])), [areas]);
  const people = useMemo(() => new Map(profiles.map((p) => [p.id, p])), [profiles]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    const area = areas.find((a) => a.slug === areaSlug);
    return projects
      .filter((p) => {
        if (area && !p.areaIds.includes(area.id)) return false;
        if (status && p.status !== status) return false;
        if (!q) return true;
        const pi = p.principalInvestigatorId ? people.get(p.principalInvestigatorId) : undefined;
        return [p.title, p.abstract, pi?.fullName ?? "", ...p.areaIds.map((id) => areaById.get(id)?.name ?? "")]
          .some((f) => f.toLowerCase().includes(q));
      })
      .sort(sorters[(sort as Sort) in sorters ? (sort as Sort) : "featured"]);
  }, [projects, areas, areaSlug, status, deferredQuery, sort, people, areaById]);

  const hasFilters = Boolean(query || areaSlug || status);
  const reset = () => {
    setQuery("");
    setAreaSlug("");
    setStatus("");
  };

  return (
    <div>
      <div role="search" aria-label="Filter research projects" className="grid gap-4 border-b border-border pb-8 md:grid-cols-2 lg:grid-cols-12 lg:items-end">
        <SearchField
          id="research-search"
          label="Search projects"
          value={query}
          onChange={setQuery}
          placeholder="Title, topic or researcher"
          className="md:col-span-2 lg:col-span-4"
        />
        <FilterSelect
          id="research-area"
          label="Research area"
          value={areaSlug}
          onChange={setAreaSlug}
          className="lg:col-span-3"
          options={[{ value: "", label: "All areas" }, ...areas.map((a) => ({ value: a.slug, label: a.name }))]}
        />
        <FilterSelect
          id="research-status"
          label="Status"
          value={status}
          onChange={setStatus}
          className="lg:col-span-2"
          options={[
            { value: "", label: "Any status" },
            ...Object.entries(projectStatusLabels).map(([value, label]) => ({ value, label })),
          ]}
        />
        <FilterSelect
          id="research-sort"
          label="Sort by"
          value={sort}
          onChange={setSort}
          className="md:col-span-2 lg:col-span-3"
          options={[
            { value: "featured", label: "Featured first" },
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
            { value: "title", label: "Title (A–Z)" },
          ]}
        />
      </div>

      <div className="mt-6 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filtered.length === projects.length
            ? `${projects.length} ${projects.length === 1 ? "project" : "projects"}`
            : `Showing ${filtered.length} of ${projects.length} projects`}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FlaskConical}
          className="mt-6"
          title={projects.length === 0 ? "No published research yet" : "No projects match these filters"}
          description={
            projects.length === 0
              ? "Projects appear here once they have been submitted by members and approved."
              : "Try another search term or choose a different research area or status."
          }
          action={hasFilters ? <Button variant="outline" onClick={reset}>Clear filters</Button> : undefined}
        />
      ) : (
        <ul className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <li key={p.id}>
              <ProjectCard
                project={p}
                headingLevel="h2"
                areas={p.areaIds.map((id) => areaById.get(id)).filter((a) => a !== undefined)}
                pi={p.principalInvestigatorId ? people.get(p.principalInvestigatorId) : undefined}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
