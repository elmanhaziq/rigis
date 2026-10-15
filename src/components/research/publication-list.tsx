"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PublicProfile, Publication } from "@/types/domain";
import { PublicationItem } from "./publication-item";
import { Button } from "@/components/ui/button";
import { FilterSelect, SearchField } from "@/components/ui/search-field";

/** Above this many entries the full record gets search, a year filter and year headings. */
const BROWSE_THRESHOLD = 15;

/**
 * Publication record for a researcher. Shows the most recent entries first;
 * the full record (often hundreds of papers) opens with search, a year filter
 * and entries grouped under year headings so it stays navigable.
 */
export function PublicationList({
  publications,
  profiles,
  initialCount = 10,
}: {
  publications: Publication[];
  profiles: PublicProfile[];
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const deferredQuery = useDeferredValue(query);
  const people = useMemo(() => new Map(profiles.map((p) => [p.id, p])), [profiles]);
  const browsable = publications.length > BROWSE_THRESHOLD;

  const years = useMemo(
    () => [...new Set(publications.map((p) => p.year).filter((y): y is number => y !== null))].sort((a, b) => b - a),
    [publications],
  );

  const filtered = useMemo(() => {
    if (!expanded) return publications.slice(0, initialCount);
    const q = deferredQuery.trim().toLowerCase();
    return publications.filter((p) => {
      if (year && String(p.year) !== year) return false;
      if (!q) return true;
      return [p.title, p.venue ?? "", ...p.authors.map((a) => a.displayName)].some((f) => f.toLowerCase().includes(q));
    });
  }, [publications, expanded, initialCount, deferredQuery, year]);

  const groups = useMemo(() => {
    if (!expanded || !browsable) return null;
    const map = new Map<string, Publication[]>();
    for (const p of filtered) {
      const key = p.year ? String(p.year) : "Undated";
      map.set(key, [...(map.get(key) ?? []), p]);
    }
    return [...map.entries()];
  }, [expanded, browsable, filtered]);

  return (
    <div>
      {expanded && browsable && (
        <div role="search" aria-label="Search publications" className="mb-6 grid gap-4 sm:grid-cols-[1fr_12rem] sm:items-end">
          <SearchField
            id="publication-search"
            label="Search this record"
            value={query}
            onChange={setQuery}
            placeholder="Title, venue or co-author"
          />
          <FilterSelect
            id="publication-year"
            label="Year"
            value={year}
            onChange={setYear}
            options={[{ value: "", label: "All years" }, ...years.map((y) => ({ value: String(y), label: String(y) }))]}
          />
          <p className="text-sm text-muted-foreground sm:col-span-2" aria-live="polite">
            {filtered.length === publications.length
              ? `${publications.length} publications`
              : `Showing ${filtered.length} of ${publications.length} publications`}
          </p>
        </div>
      )}

      {groups ? (
        filtered.length === 0 ? (
          <p className="border-t border-border py-6 text-muted-foreground">No publications match. Try another word or year.</p>
        ) : (
          <div id="publication-list" className="space-y-10">
            {groups.map(([label, items]) => (
              <section key={label} aria-labelledby={`pub-year-${label}`}>
                <h3 id={`pub-year-${label}`} className="flex items-baseline gap-3 font-heading text-[1.5rem] font-normal">
                  {label}
                  <span className="font-sans text-sm text-muted-foreground tabular-nums">{items.length}</span>
                </h3>
                <ul className="mt-2 border-b border-border">
                  {items.map((pub) => (
                    <PublicationItem key={pub.id} publication={pub} profiles={people} />
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )
      ) : (
        <ul id="publication-list" className="border-b border-border">
          {filtered.map((pub) => (
            <PublicationItem key={pub.id} publication={pub} profiles={people} />
          ))}
        </ul>
      )}

      {!expanded && publications.length > initialCount && (
        <Button
          variant="outline"
          className="mt-6"
          aria-controls="publication-list"
          aria-expanded={false}
          onClick={() => setExpanded(true)}
        >
          Show all {publications.length} publications
          <ChevronDown data-icon="inline-end" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
