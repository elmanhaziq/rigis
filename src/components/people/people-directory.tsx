"use client";

import { useDeferredValue, useMemo } from "react";
import { Users } from "lucide-react";
import type { PublicProfile } from "@/types/domain";
import { ResearcherCard } from "./researcher-card";
import { SearchField, FilterSelect } from "@/components/ui/search-field";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { roleLabels } from "@/config/site";
import { sortProfiles } from "@/lib/data/selectors";
import { useQueryState } from "@/hooks/use-query-state";

const roleGroups: { key: PublicProfile["role"][]; label: string }[] = [
  { key: ["GROUP_LEADER", "SUPER_ADMIN"], label: "Group leadership" },
  { key: ["LECTURER"], label: "Lecturers" },
  { key: ["RESEARCHER"], label: "Researchers" },
  { key: ["STUDENT"], label: "Postgraduate students" },
];

function normalise(s: string) {
  return s.trim().toLowerCase();
}

export function PeopleDirectory({ profiles }: { profiles: PublicProfile[] }) {
  const [query, setQuery] = useQueryState("q");
  const [role, setRole] = useQueryState("role");
  const [interest, setInterest] = useQueryState("interest");
  const deferredQuery = useDeferredValue(query);

  const interestOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of profiles) for (const i of p.researchInterests) if (!map.has(normalise(i))) map.set(normalise(i), i);
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [profiles]);

  const filtered = useMemo(() => {
    const q = normalise(deferredQuery);
    return sortProfiles(profiles).filter((p) => {
      if (role && p.role !== role) return false;
      if (interest && !p.researchInterests.some((i) => normalise(i) === interest)) return false;
      if (!q) return true;
      return [p.fullName, p.position ?? "", ...p.researchInterests].some((f) => normalise(f).includes(q));
    });
  }, [profiles, deferredQuery, role, interest]);

  const hasFilters = Boolean(query || role || interest);
  const reset = () => {
    setQuery("");
    setRole("");
    setInterest("");
  };

  const groups = roleGroups
    .map((g) => ({ ...g, people: filtered.filter((p) => g.key.includes(p.role)) }))
    .filter((g) => g.people.length > 0);

  return (
    <div>
      <div role="search" aria-label="Filter researchers" className="grid gap-4 border-b border-border pb-8 md:grid-cols-12 md:items-end">
        <SearchField
          id="people-search"
          label="Search by name or interest"
          value={query}
          onChange={setQuery}
          placeholder="e.g. computer vision"
          className="md:col-span-6"
        />
        <FilterSelect
          id="people-role"
          label="Role"
          value={role}
          onChange={setRole}
          className="md:col-span-3"
          options={[
            { value: "", label: "All roles" },
            ...(["GROUP_LEADER", "LECTURER", "RESEARCHER", "STUDENT"] as const).map((r) => ({
              value: r,
              label: roleLabels[r],
            })),
          ]}
        />
        <FilterSelect
          id="people-interest"
          label="Research interest"
          value={interest}
          onChange={setInterest}
          className="md:col-span-3"
          options={[{ value: "", label: "All interests" }, ...interestOptions.map(([value, label]) => ({ value, label }))]}
        />
      </div>

      <div className="mt-6 flex min-h-10 flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {filtered.length === profiles.length
            ? `${profiles.length} ${profiles.length === 1 ? "person" : "people"}`
            : `Showing ${filtered.length} of ${profiles.length} people`}
        </p>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          className="mt-6"
          title={profiles.length === 0 ? "No public profiles yet" : "No researchers match these filters"}
          description={
            profiles.length === 0
              ? "Approved member profiles will appear here once they are published."
              : "Try a broader search term, or clear the role and interest filters."
          }
          action={
            hasFilters ? (
              <Button variant="outline" onClick={reset}>
                Clear filters
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="mt-6 space-y-16">
          {groups.map((g) => (
            <section key={g.label} aria-labelledby={`group-${g.key[0]}`}>
              <h2 id={`group-${g.key[0]}`} className="flex items-center gap-4 font-heading text-xl font-bold">
                {g.label}
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
                <span className="text-sm font-medium text-muted-foreground tabular-nums">{g.people.length}</span>
              </h2>
              <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
                {g.people.map((p) => (
                  <li key={p.id}>
                    <ResearcherCard profile={p} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
