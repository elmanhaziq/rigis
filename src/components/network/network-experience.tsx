"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { List, MousePointerClick, Network as NetworkIcon, RotateCcw, Search, X } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import {
  buildNetworkGraph,
  kindLabel,
  type NetworkNodeKind,
  type PublicationMode,
} from "@/lib/network/graph";
import { NodeInspector, kindIcon } from "./node-inspector";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSelect } from "@/components/ui/search-field";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const NetworkCanvas = dynamic(() => import("./network-canvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground" role="status">
      Loading the network…
    </div>
  ),
});

const kindOrder: NetworkNodeKind[] = ["researcher", "area", "project", "publication"];
const kindPlural: Record<NetworkNodeKind, string> = {
  researcher: "Researchers",
  area: "Research areas",
  project: "Projects",
  publication: "Publications",
};

type View = "graph" | "list";

/**
 * The research network page. Two ways to explore the same relationships:
 * - Graph: zoom, pan, hover to preview, select to inspect (desktop default)
 * - List:  search and step from item to connected item (mobile default)
 * The inspector sits beside the content on desktop and in a bottom sheet on
 * mobile. Selection, view and filters are kept in the URL for sharing.
 */
export function NetworkExperience({ data }: { data: PublicDataset }) {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [view, setView] = useState<View | null>(null);
  const [pubs, setPubs] = useState<PublicationMode>("shared");
  const [interests, setInterests] = useState(true);
  const [areaSlug, setAreaSlug] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [fitToken, setFitToken] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const effectiveView: View = view ?? (desktop ? "graph" : "list");
  const graph = useMemo(() => buildNetworkGraph(data, { publications: pubs, interests }), [data, pubs, interests]);

  // Read shareable state once after hydration.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const v = q.get("view");
    const p = q.get("pubs");
    const focus = q.get("focus");
    /* eslint-disable react-hooks/set-state-in-effect -- one-time sync from the URL after hydration */
    if (v === "graph" || v === "list") setView(v);
    if (p === "shared" || p === "all" || p === "none") setPubs(p);
    if (q.get("area")) setAreaSlug(q.get("area")!);
    if (focus) {
      setSelectedId(focus);
      setFitToken((t) => t + 1);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    const set = (k: string, v: string | null) => (v ? url.searchParams.set(k, v) : url.searchParams.delete(k));
    set("view", view);
    set("pubs", pubs === "shared" ? null : pubs);
    set("area", areaSlug || null);
    set("focus", selectedId);
    window.history.replaceState(window.history.state, "", url);
  }, [view, pubs, areaSlug, selectedId]);

  // A selection that no longer exists (e.g. after hiding publications) is cleared.
  const selected = selectedId && graph.byId.has(selectedId) ? selectedId : null;

  const scope = useMemo(() => {
    const area = data.areas.find((a) => a.slug === areaSlug);
    if (!area) return null;
    const id = `area:${area.id}`;
    const set = new Set([id]);
    for (const e of graph.edges) {
      if (e.kind === "belongs" && e.target === id) set.add(e.source);
      if (e.kind === "interest" && e.target === id) set.add(e.source);
    }
    for (const e of graph.edges) if (e.kind === "participates" && set.has(e.target)) set.add(e.source);
    return set;
  }, [areaSlug, data.areas, graph]);

  const select = (id: string | null, fit = true) => {
    setSelectedId(id);
    setHoveredId(null);
    if (fit) setFitToken((t) => t + 1);
    if (id && !desktop) setSheetOpen(true);
  };

  const reset = () => {
    setQuery("");
    setAreaSlug("");
    setPubs("shared");
    setInterests(true);
    setSelectedId(null);
    setHoveredId(null);
    setFitToken((t) => t + 1);
  };

  const q = query.trim().toLowerCase();
  const results = useMemo(
    () =>
      graph.nodes
        .filter((n) => (!q || n.label.toLowerCase().includes(q) || (n.sublabel ?? "").toLowerCase().includes(q)))
        .filter((n) => !scope || scope.has(n.id))
        .sort((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind) || a.label.localeCompare(b.label)),
    [graph, q, scope],
  );
  const counts = useMemo(() => {
    const c = new Map<NetworkNodeKind, number>();
    for (const n of graph.nodes) c.set(n.kind, (c.get(n.kind) ?? 0) + 1);
    return c;
  }, [graph]);
  const unlinkedAreas = data.areas.filter((a) => !graph.byId.has(`area:${a.id}`));

  const inspector = selected ? (
    <NodeInspector graph={graph} data={data} nodeId={selected} onSelect={(id) => select(id)} titleId="inspector-title" />
  ) : (
    <div className="text-[0.9375rem] text-muted-foreground">
      <MousePointerClick className="size-5 text-purple-700" aria-hidden="true" />
      <p className="mt-3 font-heading text-lg font-bold text-navy-900">Select anything to inspect it</p>
      <p className="mt-2 leading-relaxed">
        Researchers, papers and research areas show what they are connected to and why. Each connection is a step to the
        next item.
      </p>
    </div>
  );

  return (
    <div>
      {/* Toolbar */}
      <div className="grid gap-4 lg:grid-cols-12 lg:items-end">
        <div role="tablist" aria-label="View" className="inline-flex self-end border border-border bg-card p-1 lg:col-span-3 lg:justify-self-start">
          {([
            { id: "graph", label: "Graph", icon: NetworkIcon },
            { id: "list", label: "List", icon: List },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              role="tab"
              type="button"
              aria-selected={effectiveView === id}
              aria-controls="network-view"
              onClick={() => {
                setView(id);
                setFitToken((t) => t + 1);
              }}
              className={cn(
                "inline-flex h-10 flex-1 items-center justify-center gap-2 px-4 text-sm font-medium transition-colors",
                effectiveView === id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-navy-900",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="relative lg:col-span-4">
          <label htmlFor="network-search" className="mb-2 block text-sm font-medium text-navy-900">
            Search
          </label>
          <Search className="pointer-events-none absolute bottom-3.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            id="network-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Researcher, paper or area"
            className="h-11 pr-10 pl-9 [&::-webkit-search-cancel-button]:hidden"
            autoComplete="off"
            aria-controls={effectiveView === "graph" ? "network-search-results" : "network-view"}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-1 bottom-1 flex size-9 items-center justify-center text-muted-foreground hover:text-navy-900"
              aria-label="Clear search"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
          {effectiveView === "graph" && q && (
            <ul
              id="network-search-results"
              className="absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-auto border border-border bg-card shadow-lg"
            >
              {results.length === 0 && <li className="px-3 py-3 text-sm text-muted-foreground">No matches. Try another name or topic.</li>}
              {results.slice(0, 8).map((n) => {
                const Icon = kindIcon[n.kind];
                return (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => {
                        select(n.id);
                        setQuery("");
                      }}
                      className="flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-accent"
                    >
                      <Icon className="size-4 shrink-0 text-purple-700" aria-hidden="true" />
                      <span className="line-clamp-1">{n.label}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted-foreground">{kindLabel[n.kind]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <FilterSelect
          id="network-area"
          label="Research area"
          value={areaSlug}
          onChange={(v) => {
            setAreaSlug(v);
            setSelectedId(null);
            setFitToken((t) => t + 1);
          }}
          className="lg:col-span-3"
          options={[{ value: "", label: "All areas" }, ...data.areas.map((a) => ({ value: a.slug, label: a.name }))]}
        />
        <Button variant="outline" className="h-11 lg:col-span-2" onClick={reset}>
          <RotateCcw data-icon="inline-start" aria-hidden="true" />
          Reset
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Publications</legend>
          <span className="font-medium text-navy-900">Publications:</span>
          {([
            ["shared", "Written together"],
            ["all", "All"],
            ["none", "Hide"],
          ] as const).map(([value, label]) => (
            <label
              key={value}
              className={cn(
                "inline-flex min-h-9 cursor-pointer items-center rounded-sm border px-3 transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-purple-700",
                pubs === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-navy-900 hover:border-purple-400",
              )}
            >
              <input type="radio" name="pubs" value={value} checked={pubs === value} onChange={() => setPubs(value)} className="sr-only" />
              {label}
            </label>
          ))}
        </fieldset>
        <label className="inline-flex min-h-9 items-center gap-2.5">
          <input type="checkbox" checked={interests} onChange={(e) => setInterests(e.target.checked)} className="size-4 accent-purple-700" />
          Show stated-interest links
        </label>
        <p className="text-muted-foreground" aria-live="polite">
          {kindOrder
            .filter((k) => counts.get(k))
            .map((k) => `${counts.get(k)} ${(counts.get(k) === 1 ? kindLabel[k] : kindPlural[k]).toLowerCase()}`)
            .join(" · ")}
        </p>
      </div>

      {/* View + inspector */}
      <div id="network-view" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {effectiveView === "graph" ? (
            <div className="relative h-[62dvh] min-h-[420px] overflow-hidden rounded-sm border border-navy-800 bg-navy-900 lg:h-[70vh] lg:min-h-[560px]">
              <NetworkCanvas
                graph={graph}
                selectedId={selected}
                hoveredId={desktop ? hoveredId : null}
                scope={scope}
                fitToken={fitToken}
                onSelect={(id) => select(id, false)}
                onHover={setHoveredId}
              />
            </div>
          ) : (
            <NetworkList results={results} selectedId={selected} onSelect={(id) => select(id, false)} query={q} />
          )}
          <Legend />
          {unlinkedAreas.length > 0 && (
            <p className="mt-4 border-l-2 border-purple-400 pl-4 text-sm leading-relaxed text-muted-foreground">
              {unlinkedAreas.length} of {data.areas.length} research areas have no connections yet:{" "}
              {unlinkedAreas.map((a, i) => (
                <span key={a.id}>
                  {i > 0 && ", "}
                  <Link href={`/research/?area=${a.slug}`} className="text-purple-700 hover:underline">
                    {a.name}
                  </Link>
                </span>
              ))}
              . They join the network as projects are published or researchers list them as interests.
            </p>
          )}
        </div>

        {desktop && (
          <aside aria-labelledby={selected ? "inspector-title" : undefined} aria-label={selected ? undefined : "Details"} className="lg:col-span-4">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto border border-border bg-card p-6">{inspector}</div>
          </aside>
        )}
      </div>

      {!desktop && (
        <Sheet open={sheetOpen && selected !== null} onOpenChange={setSheetOpen}>
          <SheetContent side="bottom" className="max-h-[85dvh] gap-0 rounded-t-xl bg-paper p-0">
            <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-input" aria-hidden="true" />
            <SheetTitle className="sr-only">{selected ? graph.byId.get(selected)?.label : "Details"}</SheetTitle>
            <SheetDescription className="sr-only">Details and connections</SheetDescription>
            <div className="overflow-y-auto overscroll-contain px-5 pt-5 pb-8">{inspector}</div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

function NetworkList({
  results,
  selectedId,
  onSelect,
  query,
}: {
  results: ReturnType<typeof buildNetworkGraph>["nodes"];
  selectedId: string | null;
  onSelect: (id: string) => void;
  query: string;
}) {
  if (results.length === 0) {
    return (
      <p className="border border-dashed border-input bg-card p-8 text-center text-muted-foreground">
        {query ? "Nothing matches that search. Try a researcher's name or a topic." : "Nothing to show with these filters."}
      </p>
    );
  }
  return (
    <div className="space-y-8">
      {kindOrder.map((kind) => {
        const items = results.filter((n) => n.kind === kind);
        if (items.length === 0) return null;
        const Icon = kindIcon[kind];
        return (
          <section key={kind} aria-labelledby={`list-${kind}`}>
            <h2 id={`list-${kind}`} className="flex items-center gap-3 font-heading text-lg font-bold">
              <Icon className="size-4 text-purple-700" aria-hidden="true" />
              {kindPlural[kind]}
              <span className="h-px flex-1 bg-border" aria-hidden="true" />
              <span className="text-sm font-medium text-muted-foreground tabular-nums">{items.length}</span>
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => onSelect(n.id)}
                    aria-pressed={selectedId === n.id}
                    className={cn(
                      "flex min-h-14 w-full items-center gap-3 rounded-sm border bg-card px-3 py-2.5 text-left transition-colors",
                      selectedId === n.id ? "border-purple-700 bg-purple-50 ring-1 ring-purple-700" : "border-border hover:border-purple-400",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="line-clamp-2 text-sm leading-snug font-semibold text-navy-900">{n.label}</span>
                      {n.sublabel && <span className="block text-xs text-muted-foreground">{n.sublabel}</span>}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Legend() {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[0.8125rem] text-muted-foreground" aria-label="Legend">
      <li className="flex items-center gap-2"><span className="size-3 rounded-full bg-card ring-2 ring-purple-700" aria-hidden="true" />Researcher</li>
      <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[2px] border-l-[3px] border-brass bg-card ring-1 ring-border" aria-hidden="true" />Publication</li>
      <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[2px] bg-purple-700" aria-hidden="true" />Project</li>
      <li className="flex items-center gap-2"><span className="size-2.5 rotate-45 bg-navy-800 ring-1 ring-brass" aria-hidden="true" />Research area (accent per discipline)</li>
      <li className="flex items-center gap-2"><span className="h-px w-5 bg-slate-brand" aria-hidden="true" />Authored (verified)</li>
      <li className="flex items-center gap-2"><span className="h-0.5 w-5 bg-purple-200 ring-1 ring-purple-400" aria-hidden="true" />Selected connection</li>
      <li className="flex items-center gap-2"><span className="h-0 w-5 border-t-2 border-dashed border-purple-400" aria-hidden="true" />Stated interest (declared)</li>
    </ul>
  );
}
