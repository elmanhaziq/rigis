"use client";

import "@xyflow/react/dist/base.css";
import { memo, useEffect, useMemo } from "react";
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
import { layoutNetwork, relatedIds, type NetworkGraph, type NetworkNode } from "@/lib/network/graph";
import { ProfileAvatar } from "@/components/people/profile-avatar";
import { cn } from "@/lib/utils";
import { palette } from "@/config/palette";

type NodeData = NetworkNode & { state: "default" | "active" | "related" | "dimmed" };
type FlowNode = Node<NodeData>;

const ring = (s: NodeData["state"]) =>
  cn(
    "transition-[opacity,box-shadow] duration-200",
    s === "dimmed" && "opacity-20",
    s === "active" && "ring-2 ring-purple-200 ring-offset-2 ring-offset-navy-900",
  );
const handle = "!size-1.5 !min-h-0 !min-w-0 !border-0 !bg-transparent";

const ResearcherNode = memo(function ResearcherNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("flex w-[240px] items-center gap-3 rounded-full border border-white/20 bg-card py-1.5 pr-4 pl-1.5 shadow-md", ring(data.state))}>
      <Handle type="target" position={Position.Left} className={handle} />
      <span className="size-11 shrink-0 overflow-hidden rounded-full bg-navy-900 ring-2 ring-purple-700">
        <ProfileAvatar name={data.label} photoUrl={data.photoUrl} className="aspect-square w-11" textClassName="text-[0.625rem]" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-[0.8125rem] font-bold text-navy-900">{data.label}</span>
        {data.sublabel && <span className="block truncate text-[0.6875rem] text-muted-foreground">{data.sublabel}</span>}
      </span>
      <Handle type="source" position={Position.Right} className={handle} />
    </div>
  );
});

const ProjectNode = memo(function ProjectNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("w-[250px] rounded-sm border border-purple-400 bg-purple-700 px-3.5 py-2.5 text-white shadow-md", ring(data.state))}>
      <Handle type="target" position={Position.Left} className={handle} />
      <span className="block text-[0.625rem] font-semibold tracking-[0.12em] text-purple-200 uppercase">Project · {data.sublabel}</span>
      <span className="mt-0.5 line-clamp-2 text-[0.8125rem] leading-snug font-semibold">{data.label}</span>
      <Handle type="source" position={Position.Right} className={handle} />
    </div>
  );
});

const PublicationNode = memo(function PublicationNode({ data }: NodeProps<FlowNode>) {
  return (
    <div className={cn("w-[260px] rounded-sm border border-white/20 border-l-[3px] border-l-brass bg-card px-3 py-2 shadow-md", ring(data.state))}>
      <Handle type="target" position={Position.Left} className={handle} />
      <span className="block text-[0.625rem] font-semibold tracking-[0.12em] text-brass-ink uppercase">Paper · {data.sublabel}</span>
      <span className="mt-0.5 line-clamp-2 text-[0.75rem] leading-snug font-medium text-navy-900">{data.label}</span>
    </div>
  );
});

const AreaNode = memo(function AreaNode({ data }: NodeProps<FlowNode>) {
  return (
    <div
      className={cn("flex w-[220px] items-center gap-2.5 rounded-sm border bg-navy-800 px-3 py-2.5 shadow-md", ring(data.state))}
      style={{ borderColor: data.accent ?? palette.gold }}
    >
      <span className="size-2.5 shrink-0 rotate-45" style={{ background: data.accent ?? palette.gold }} aria-hidden="true" />
      <span className="text-[0.8125rem] leading-snug font-semibold text-white">{data.label}</span>
      <Handle type="source" position={Position.Right} className={handle} />
    </div>
  );
});

const nodeTypes = { researcher: ResearcherNode, project: ProjectNode, publication: PublicationNode, area: AreaNode };

const edgeStyle: Record<string, React.CSSProperties> = {
  participates: { stroke: palette.purple400 },
  belongs: { stroke: palette.gold },
  authored: { stroke: palette.slate },
  interest: { stroke: palette.purple400, strokeDasharray: "5 5" },
};

export interface NetworkCanvasProps {
  graph: NetworkGraph;
  selectedId: string | null;
  hoveredId: string | null;
  /** Ids kept at full strength by a filter; null = no filter. */
  scope: Set<string> | null;
  /** Bumped to request the view to fit around the selection (or everything). */
  fitToken: number;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
  className?: string;
}

function Canvas({ graph, selectedId, hoveredId, scope, fitToken, onSelect, onHover, className }: NetworkCanvasProps) {
  const { fitView } = useReactFlow();
  const positions = useMemo(() => layoutNetwork(graph), [graph]);
  const focusId = hoveredId ?? selectedId;
  const related = useMemo(() => (focusId ? relatedIds(graph, focusId) : null), [graph, focusId]);

  // Re-layout positions are stable per graph; columns sit areas | researchers | work.
  const nodes: FlowNode[] = useMemo(
    () =>
      graph.nodes.map((n) => {
        let state: NodeData["state"] = "default";
        if (related) state = n.id === focusId ? "active" : related.has(n.id) ? "related" : "dimmed";
        else if (scope && !scope.has(n.id)) state = "dimmed";
        return {
          id: n.id,
          type: n.kind,
          position: positions.get(n.id) ?? { x: 0, y: 0 },
          data: { ...n, state },
          ariaLabel: `${n.kind}: ${n.label}`,
          draggable: false,
          connectable: false,
          selected: n.id === selectedId,
        };
      }),
    [graph, positions, related, focusId, scope, selectedId],
  );

  const edges: Edge[] = useMemo(
    () =>
      graph.edges.map((e) => {
        const lit = related
          ? related.has(e.source) && related.has(e.target) && (e.source === focusId || e.target === focusId)
          : scope
            ? scope.has(e.source) && scope.has(e.target)
            : true;
        // Draw every edge left-to-right across the columns (areas | researchers | work).
        const reversed = e.kind === "interest" || e.kind === "belongs";
        return {
          id: e.id,
          source: reversed ? e.target : e.source,
          target: reversed ? e.source : e.target,
          focusable: false,
          style: {
            ...edgeStyle[e.kind],
            // Selected connections switch to lavender so they stand out from every edge colour.
            ...(lit && related ? { stroke: palette.purple200 } : {}),
            strokeWidth: lit && (related || scope) ? 2.2 : 1.2,
            opacity: lit ? (related || scope ? 1 : 0.55) : 0.1,
            transition: "opacity 200ms, stroke-width 200ms",
          },
        };
      }),
    [graph, related, focusId, scope],
  );

  useEffect(() => {
    if (fitToken === 0) return;
    const target = selectedId
      ? [...relatedIds(graph, selectedId)].map((id) => ({ id }))
      : scope
        ? [...scope].map((id) => ({ id }))
        : undefined;
    const t = window.setTimeout(() => fitView({ nodes: target, duration: 450, padding: 0.2 }), 30);
    return () => window.clearTimeout(t);
  }, [fitToken, fitView, graph, selectedId, scope]);

  return (
    <ReactFlow<FlowNode, Edge>
      className={className}
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.1 }}
      minZoom={0.15}
      maxZoom={2}
      nodesDraggable={false}
      nodesConnectable={false}
      zoomOnDoubleClick={false}
      panOnScroll={false}
      preventScrolling
      onNodeMouseEnter={(_, n) => onHover(n.id)}
      onNodeMouseLeave={() => onHover(null)}
      onNodeClick={(_, n) => onSelect(n.id)}
      onPaneClick={() => onSelect(null)}
      aria-label="Research network graph"
    >
      <Background variant={BackgroundVariant.Dots} gap={22} size={1} color={palette.navy700} />
      <Controls showInteractive={false} position="bottom-left" />
    </ReactFlow>
  );
}

/** React Flow canvas. Loaded lazily (client-only) by NetworkExperience. */
export default function NetworkCanvas(props: NetworkCanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}
