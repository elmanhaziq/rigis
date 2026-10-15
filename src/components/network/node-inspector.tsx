"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, ExternalLink, FlaskConical, Shapes, User } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import {
  edgeKindLabel,
  edgesOf,
  kindLabel,
  type NetworkEdgeKind,
  type NetworkGraph,
  type NetworkNodeKind,
} from "@/lib/network/graph";
import { ProfileAvatar } from "@/components/people/profile-avatar";
import { StatusTag } from "@/components/layout/demo-banner";
import { cn } from "@/lib/utils";

export const kindIcon: Record<NetworkNodeKind, typeof User> = {
  researcher: User,
  project: FlaskConical,
  area: Shapes,
  publication: BookOpen,
};

const verified: Record<NetworkEdgeKind, boolean> = {
  participates: true,
  belongs: true,
  authored: true,
  interest: false,
};

/**
 * Details and connections for one network node. Every connection is a button
 * that moves the selection, so visitors can walk the network one step at a
 * time — the same experience in graph and list mode, on desktop and mobile.
 */
export function NodeInspector({
  graph,
  data,
  nodeId,
  onSelect,
  titleId,
}: {
  graph: NetworkGraph;
  data: PublicDataset;
  nodeId: string;
  onSelect: (id: string) => void;
  titleId?: string;
}) {
  const node = graph.byId.get(nodeId);
  if (!node) return null;
  const Icon = kindIcon[node.kind];

  const groups = new Map<NetworkEdgeKind, { id: string; label?: string }[]>();
  for (const e of edgesOf(graph, nodeId)) {
    const other = e.source === nodeId ? e.target : e.source;
    groups.set(e.kind, [...(groups.get(e.kind) ?? []), { id: other, label: e.label }]);
  }

  const profile = node.kind === "researcher" ? data.profiles.find((p) => p.id === node.refId) : undefined;
  const area = node.kind === "area" ? data.areas.find((a) => a.id === node.refId) : undefined;
  const pub = node.kind === "publication" ? data.publications.find((p) => p.id === node.refId) : undefined;

  return (
    <div className="space-y-6">
      <header className="flex gap-4">
        {profile ? (
          <ProfileAvatar name={profile.fullName} photoUrl={profile.photoUrl} className="w-20 shrink-0 border border-border" textClassName="text-lg" />
        ) : (
          <span className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-navy-900 text-brass">
            <Icon className="size-5" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          <p className="eyebrow flex flex-wrap items-center gap-2">
            {kindLabel[node.kind]}
            <StatusTag status={node.status} />
          </p>
          <h2 id={titleId} className="mt-1.5 font-heading text-xl leading-snug font-bold text-navy-900">
            {node.label}
          </h2>
          {node.sublabel && <p className="mt-0.5 text-sm text-muted-foreground">{node.sublabel}</p>}
        </div>
      </header>

      {area?.description && <p className="text-[0.9375rem] leading-relaxed text-foreground/90">{area.description}</p>}
      {pub && (
        <div className="space-y-1 text-sm">
          {pub.venue && <p className="text-muted-foreground italic">{pub.venue}</p>}
          <p className="text-foreground/90">{pub.authors.map((a) => a.displayName).join(", ")}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-x-5 gap-y-1">
        {node.kind === "publication" ? (
          node.href && (
            <a href={node.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline">
              Read the paper <ExternalLink className="size-3.5" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        ) : (
          <Link href={node.href} className="inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline">
            {node.kind === "researcher" ? "Open full profile" : node.kind === "project" ? "Open project" : "Explore this area"}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>

      <section aria-label="Connections" className="space-y-5 border-t border-border pt-5">
        {groups.size === 0 && <p className="text-sm text-muted-foreground">No connections yet.</p>}
        {[...groups.entries()].map(([kind, items]) => (
          <div key={kind}>
            <h3 className="flex flex-wrap items-center gap-2 text-[0.8125rem] font-semibold text-navy-900">
              {edgeKindLabel[kind]}
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-semibold tracking-wide uppercase",
                  verified[kind] ? "bg-[#ecf6f0] text-success" : "bg-muted text-muted-foreground",
                )}
              >
                {verified[kind] ? "Verified" : "Declared"}
              </span>
              <span className="text-muted-foreground tabular-nums">{items.length}</span>
            </h3>
            <ul className="mt-2 space-y-1">
              {items.map(({ id, label }) => {
                const other = graph.byId.get(id)!;
                const OtherIcon = kindIcon[other.kind];
                return (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => onSelect(id)}
                      className="flex min-h-11 w-full items-start gap-3 rounded-sm px-2 py-2 text-left transition-colors hover:bg-accent focus-visible:bg-accent"
                    >
                      <OtherIcon className="mt-0.5 size-4 shrink-0 text-navy-800" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug font-medium text-navy-900">{other.label}</span>
                        {label && <span className="block text-xs text-muted-foreground">{kind === "interest" ? `Interest: ${label}` : label}</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
