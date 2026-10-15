"use client";

import "@xyflow/react/dist/base.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import { ArrowUpRight, List, Network, RotateCcw } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { PublicDataset } from "@/lib/data";
import { buildNetworkGraph, layoutNetwork, type NetworkNode } from "@/lib/network/graph";
import { SearchField, FilterSelect } from "@/components/ui/search-field";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { useIsTouch, useQueryState } from "@/hooks/use-query-state";

type NodeData = NetworkNode & { state: "default" | "active" | "related" | "dimmed" };
type FlowNode = Node<NodeData>;

const kindLabel = { researcher: "Researcher", project: "Project", area: "Research area" } as const;

const stateClass = (s: NodeData["state"]) =>
  cn(
    "transition-[opacity,box-shadow,transform] duration-200",
    s === "dimmed" && "opacity-25",
    s === "active" && "ring-2 ring-brass ring-offset-2 ring-offset-paper",
  );

const ResearcherNode = memo(function ResearcherNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("flex w-[230px] items-center gap-3 rounded-full border border-navy-900/20 bg-card py-1.5 pr-4 pl-1.5 shadow-sm", stateClass(data.state))}>
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-navy-900 text-[0.6875rem] font-bold tracking-wider text-white" aria-hidden="true">
        {data.monogram}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.8125rem] font-semibold text-navy-900">{data.label}</span>
        {data.sublabel && <span className="block truncate text-[0.6875rem] text-muted-foreground">{data.sublabel}</span>}
      </span>
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-slate-brand" />
    </div>
  );
});

const ProjectNode = memo(function ProjectNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("w-[250px] rounded-sm border border-navy-900 bg-navy-900 px-3.5 py-2.5 text-white shadow-sm", stateClass(data.state))}>
      <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-slate-brand" />
      <span className="block text-[0.625rem] font-semibold tracking-[0.12em] text-brass uppercase">{data.sublabel}</span>
      <span className="mt-0.5 line-clamp-2 block text-[0.8125rem] leading-snug font-semibold">{data.label}</span>
      <Handle type="source" position={Position.Right} className="!size-1.5 !border-0 !bg-brass" />
    </div>
  );
});

const AreaNode = memo(function AreaNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("flex w-[230px] items-center gap-2.5 rounded-sm border border-brass bg-[#f7f1e6] px-3 py-2.5", stateClass(data.state))}>
      <Handle type="target" position={Position.Left} className="!size-1.5 !border-0 !bg-brass" />
      <span className="size-2.5 shrink-0 rotate-45 bg-brass" aria-hidden="true" />
      <span className="text-[0.8125rem] leading-snug font-semibold text-navy-900">{data.label}</span>
    </div>
  );
});

const nodeTypes = { researcher: ResearcherNode, project: ProjectNode, area: AreaNode };

function GraphCanvas({ data }: { data: PublicDataset }) {
  const router = useRouter();
  const { fitView } = useReactFlow();
  const graph = useMemo(() => buildNetworkGraph(data), [data]);
  const positions = useMemo(() => layoutNetwork(graph), [graph]);

  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useQueryState("area");
  const [showDerived, setShowDerived] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const isTouch = useIsTouch();
  const reduceMotion = useReducedMotion();

  const focusId = hovered ?? selected;
  const nodeById = useMemo(() => new Map(graph.nodes.map((n) => [n.id, n])), [graph]);

  // Nodes within the chosen research area (area + its projects + their researchers).
  const areaScope = useMemo(() => {
    if (!areaFilter) return null;
    const area = graph.nodes.find((n) => n.kind === "area" && n.href.endsWith(`area=${areaFilter}`));
    if (!area) return null;
    const scope = new Set([area.id]);
    for (const e of graph.edges) {
      if (e.kind === "belongs" && e.target === area.id) scope.add(e.source);
    }
    for (const e of graph.edges) {
      if (e.kind === "participates" && scope.has(e.target)) scope.add(e.source);
    }
    return scope;
  }, [areaFilter, graph]);

  const related = useMemo(() => {
    if (!focusId) return null;
    const set = new Set([focusId, ...(graph.neighbours.get(focusId) ?? [])]);
    // A project highlights its researchers and areas; a researcher reaches areas via projects.
    return set;
  }, [focusId, graph]);

  const nodes: FlowNode[] = useMemo(
    () =>
      graph.nodes.map((n) => {
        let state: NodeData["state"] = "default";
        if (related) state = n.id === focusId ? "active" : related.has(n.id) ? "related" : "dimmed";
        else if (areaScope && !areaScope.has(n.id)) state = "dimmed";
        return {
          id: n.id,
          type: n.kind,
          position: positions.get(n.id)!,
          data: { ...n, state },
          ariaLabel: `${kindLabel[n.kind]}: ${n.label}`,
          draggable: false,
          connectable: false,
        };
      }),
    [graph, positions, related, focusId, areaScope],
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges
        .filter((e) => showDerived || e.kind !== "contributes")
        .map((e) => {
          const lit = related ? related.has(e.source) && related.has(e.target) && (e.source === focusId || e.target === focusId) : areaScope ? areaScope.has(e.source) && areaScope.has(e.target) : true;
          const color = e.kind === "belongs" ? "#B89B68" : e.kind === "contributes" ? "#2A5680" : "#9AA9B8";
          return {
            id: e.id,
            source: e.source,
            target: e.target,
            type: "default",
            focusable: false,
            animated: false,
            style: {
              stroke: color,
              strokeWidth: lit && (related || areaScope) ? 2 : 1.25,
              strokeDasharray: e.kind === "contributes" ? "4 4" : undefined,
              opacity: lit ? 1 : 0.12,
              transition: "opacity 200ms, stroke-width 200ms",
            },
          };
        }),
    [graph, showDerived, related, focusId, areaScope],
  );

  const researcherOptions = useMemo(
    () => graph.nodes.filter((n) => n.kind === "researcher").sort((a, b) => a.label.localeCompare(b.label)),
    [graph],
  );
  const areaOptions = useMemo(() => data.areas.filter((a) => graph.neighbours.has(`area:${a.id}`)), [data.areas, graph]);

  const focusNode = useCallback(
    (id: string) => {
      setSelected(id);
      fitView({ nodes: [{ id }, ...[...(graph.neighbours.get(id) ?? [])].map((n) => ({ id: n }))], duration: 450, padding: 0.25 });
    },
    [fitView, graph],
  );

  const onSearch = (value: string) => {
    setQuery(value);
    const q = value.trim().toLowerCase();
    if (!q) return;
    const match =
      researcherOptions.find((n) => n.label.toLowerCase() === q) ??
      (q.length >= 3 ? researcherOptions.find((n) => n.label.toLowerCase().includes(q)) : undefined);
    if (match) focusNode(match.id);
  };

  const reset = () => {
    setQuery("");
    setAreaFilter("");
    setSelected(null);
    setHovered(null);
    setShowDerived(false);
    fitView({ duration: 450, padding: 0.12 });
  };

  const preview = focusId ? nodeById.get(focusId) : undefined;

  if (graph.nodes.length === 0) {
    return (
      <EmptyState
        icon={Network}
        title="The network is empty"
        description="Connections appear once approved projects list their researchers and research areas."
      />
    );
  }

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-12 md:items-end">
        <div className="md:col-span-5">
          {researcherOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Researchers appear here once they are linked to a published project.
            </p>
          ) : (
          <SearchField id="network-search" label="Find a researcher" value={query} onChange={onSearch} placeholder="Type a name" list="network-researchers" />
          )}
          <datalist id="network-researchers">
            {researcherOptions.map((n) => <option key={n.id} value={n.label} />)}
          </datalist>
        </div>
        <FilterSelect
          id="network-area"
          label="Research area"
          value={areaFilter}
          onChange={(v) => { setAreaFilter(v); setSelected(null); }}
          className="md:col-span-4"
          options={[{ value: "", label: "All research areas" }, ...areaOptions.map((a) => ({ value: a.slug, label: a.name }))]}
        />
        <div className="flex gap-2 md:col-span-3 md:justify-end">
          <Button variant="outline" className="h-11 flex-1 md:flex-none" onClick={reset}>
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Reset
          </Button>
        </div>
      </div>
      <label className="mt-4 inline-flex min-h-10 items-center gap-2.5 text-sm">
        <input type="checkbox" checked={showDerived} onChange={(e) => setShowDerived(e.target.checked)} className="size-4 accent-navy-900" />
        Show researcher–area links (derived from project participation)
      </label>

      <div className="relative mt-4 h-[68vh] min-h-[460px] overflow-hidden border border-border bg-paper">
        <ReactFlow<FlowNode, Edge>
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.2}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          proOptions={{ hideAttribution: false }}
          onNodeMouseEnter={(_, n) => setHovered(n.id)}
          onNodeMouseLeave={() => setHovered(null)}
          onNodeClick={(_, n) => {
            // Touch: first tap previews and highlights, second tap opens.
            if (isTouch && selected !== n.id) {
              setSelected(n.id);
              return;
            }
            router.push(n.data.href);
          }}
          onPaneClick={() => setSelected(null)}
          aria-label="Research collaboration network graph"
        >
          <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#c9d2db" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>

        <AnimatePresence>
        {preview && (
          <motion.div
            key={preview.id}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-auto absolute top-3 left-3 z-10 w-[min(320px,calc(100%-1.5rem))] border border-border bg-card p-4 shadow-lg"
            role="status"
            aria-live="polite"
          >
            <p className="eyebrow">{kindLabel[preview.kind]}</p>
            <p className="mt-1.5 font-heading font-bold leading-snug text-navy-900">{preview.label}</p>
            {preview.sublabel && <p className="mt-0.5 text-sm text-muted-foreground">{preview.sublabel}</p>}
            <p className="mt-2 text-[0.8125rem] text-muted-foreground">
              {graph.neighbours.get(preview.id)?.size ?? 0} direct connection(s)
            </p>
            <Link href={preview.href} className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline">
              {preview.kind === "researcher" ? "Open profile" : preview.kind === "project" ? "Open project" : "View projects"}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem] text-muted-foreground" aria-label="Legend">
        <li className="flex items-center gap-2"><span className="size-3 rounded-full border border-navy-900/30 bg-card" aria-hidden="true" />Researcher</li>
        <li className="flex items-center gap-2"><span className="h-3 w-4 rounded-[2px] bg-navy-900" aria-hidden="true" />Project</li>
        <li className="flex items-center gap-2"><span className="size-2.5 rotate-45 bg-brass" aria-hidden="true" />Research area</li>
        <li className="flex items-center gap-2"><span className="h-px w-5 bg-slate-brand" aria-hidden="true" />Participates in</li>
        <li className="flex items-center gap-2"><span className="h-px w-5 bg-brass" aria-hidden="true" />Belongs to area</li>
      </ul>
      <p className="mt-2 text-[0.8125rem] text-muted-foreground">
        {isTouch ? "Tap a node to preview its connections; tap again to open it." : "Hover a node to highlight its connections; click to open it. Scroll or pinch to zoom, drag to pan."}
      </p>
    </div>
  );
}

function NetworkList({ data }: { data: PublicDataset }) {
  const graph = useMemo(() => buildNetworkGraph(data), [data]);
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const areas = graph.nodes.filter((n) => n.kind === "area");
  return (
    <div className="space-y-10">
      {areas.map((area) => {
        const projects = graph.edges.filter((e) => e.kind === "belongs" && e.target === area.id).map((e) => byId.get(e.source)!);
        return (
          <section key={area.id} aria-labelledby={`list-${area.id}`} className="border-t border-navy-900 pt-6">
            <h2 id={`list-${area.id}`} className="font-heading text-xl font-bold">
              <Link href={area.href} className="hover:underline">{area.label}</Link>
            </h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {projects.map((p) => {
                const people = graph.edges.filter((e) => e.kind === "participates" && e.target === p.id);
                return (
                  <li key={p.id} className="border border-border bg-card p-5">
                    <Link href={p.href} className="font-heading font-bold text-navy-900 hover:underline">{p.label}</Link>
                    <p className="mt-0.5 text-[0.8125rem] text-muted-foreground">{p.sublabel}</p>
                    <ul className="mt-3 space-y-1 text-[0.9375rem]" aria-label={`Researchers on ${p.label}`}>
                      {people.map((e) => {
                        const r = byId.get(e.source)!;
                        return (
                          <li key={e.id}>
                            <Link href={r.href} className="text-navy-800 hover:underline">{r.label}</Link>
                            <span className="text-muted-foreground"> — {e.label}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function NetworkExplorer({ data }: { data: PublicDataset }) {
  const [view, setView] = useQueryState("view", "graph");
  return (
    <div>
      <div role="tablist" aria-label="Network view" className="mb-8 inline-flex border border-border bg-card p-1">
        {[
          { id: "graph", label: "Graph view", icon: Network },
          { id: "list", label: "List view", icon: List },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            role="tab"
            type="button"
            aria-selected={view === id}
            aria-controls={`panel-${id}`}
            id={`tab-${id}`}
            onClick={() => setView(id)}
            className={cn(
              "inline-flex h-10 items-center gap-2 px-4 text-sm font-medium transition-colors",
              view === id ? "bg-navy-900 text-white" : "text-muted-foreground hover:text-navy-900",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${view}`} aria-labelledby={`tab-${view}`}>
        {view === "list" ? (
          <NetworkList data={data} />
        ) : (
          <ReactFlowProvider>
            <GraphCanvas data={data} />
          </ReactFlowProvider>
        )}
      </div>
    </div>
  );
}
