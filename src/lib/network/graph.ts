import type { PublicDataset } from "@/lib/data";
import type { ContentStatus } from "@/types/domain";
import { displayName, initials } from "@/lib/data/selectors";
import { areasForInterest, memberAuthors } from "@/lib/data/relationships";

export type NetworkNodeKind = "researcher" | "project" | "area" | "publication";

export type NetworkNode = {
  id: string;
  kind: NetworkNodeKind;
  label: string;
  sublabel: string | null;
  /** Two-letter monogram for researcher nodes. */
  monogram: string | null;
  photoUrl: string | null;
  /** Internal page, or the external source for publications ("" if none). */
  href: string;
  /** Underlying record id (profile/project/area/publication id). */
  refId: string;
  status: ContentStatus;
};

/**
 * - participates  researcher -> project      verified (approved project team)
 * - belongs       project -> area            verified (approved project tags)
 * - authored      researcher -> publication  verified (published authorship)
 * - interest      researcher -> area         declared (the researcher's own stated interest)
 */
export type NetworkEdgeKind = "participates" | "belongs" | "authored" | "interest";

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  kind: NetworkEdgeKind;
  label?: string;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  neighbours: Map<string, Set<string>>;
  byId: Map<string, NetworkNode>;
}

export type PublicationMode = "shared" | "all" | "none";

export interface GraphOptions {
  /** "shared" shows only papers co-authored by two or more members. */
  publications: PublicationMode;
  /** Include declared-interest links between researchers and areas. */
  interests: boolean;
}

export const defaultGraphOptions: GraphOptions = { publications: "shared", interests: true };

export const nid = (kind: NetworkNodeKind, id: string) => `${kind}:${id}`;

export const kindLabel: Record<NetworkNodeKind, string> = {
  researcher: "Researcher",
  project: "Project",
  area: "Research area",
  publication: "Publication",
};

export const edgeKindLabel: Record<NetworkEdgeKind, string> = {
  participates: "Works on project",
  belongs: "Project in research area",
  authored: "Co-authored publication",
  interest: "Stated research interest",
};

/**
 * Builds the network strictly from published records. Records referenced but
 * absent from the public dataset are skipped, so unpublished people or
 * projects can never appear. Researchers appear once they have a connection.
 */
export function buildNetworkGraph(data: PublicDataset, options: GraphOptions = defaultGraphOptions): NetworkGraph {
  const profiles = new Map(data.profiles.map((p) => [p.id, p]));
  const areas = new Map(data.areas.map((a) => [a.id, a]));
  const nodes = new Map<string, NetworkNode>();
  const edges: NetworkEdge[] = [];

  const addResearcher = (id: string) => {
    const p = profiles.get(id);
    if (!p) return null;
    const key = nid("researcher", id);
    if (!nodes.has(key)) {
      nodes.set(key, {
        id: key,
        kind: "researcher",
        label: displayName(p),
        sublabel: p.position,
        monogram: initials(p.fullName),
        photoUrl: p.photoUrl,
        href: `/people/${p.slug}/`,
        refId: p.id,
        status: p.isDemo ? "demo" : "verified",
      });
    }
    return key;
  };
  const addArea = (id: string) => {
    const a = areas.get(id);
    if (!a) return null;
    const key = nid("area", id);
    if (!nodes.has(key)) {
      nodes.set(key, {
        id: key,
        kind: "area",
        label: a.name,
        sublabel: null,
        monogram: null,
        photoUrl: null,
        href: `/research/?area=${a.slug}`,
        refId: a.id,
        status: a.status,
      });
    }
    return key;
  };

  for (const project of data.projects) {
    const pKey = nid("project", project.id);
    nodes.set(pKey, {
      id: pKey,
      kind: "project",
      label: project.title,
      sublabel: project.status[0]!.toUpperCase() + project.status.slice(1),
      monogram: null,
      photoUrl: null,
      href: `/research/${project.slug}/`,
      refId: project.id,
      status: project.isDemo ? "demo" : "verified",
    });
    for (const areaId of project.areaIds) {
      const aKey = addArea(areaId);
      if (aKey) edges.push({ id: `${pKey}>${aKey}`, source: pKey, target: aKey, kind: "belongs" });
    }
    const roles = new Map<string, string>();
    if (project.principalInvestigatorId) roles.set(project.principalInvestigatorId, "Principal investigator");
    for (const m of project.members) if (!roles.has(m.profileId)) roles.set(m.profileId, m.projectRole);
    for (const [profileId, role] of roles) {
      const rKey = addResearcher(profileId);
      if (rKey) edges.push({ id: `${rKey}>${pKey}`, source: rKey, target: pKey, kind: "participates", label: role });
    }
  }

  if (options.publications !== "none") {
    for (const pub of data.publications) {
      const authors = memberAuthors(pub, data);
      if (authors.length === 0) continue;
      if (options.publications === "shared" && authors.length < 2) continue;
      const key = nid("publication", pub.id);
      nodes.set(key, {
        id: key,
        kind: "publication",
        label: pub.title,
        sublabel: pub.year ? String(pub.year) : null,
        monogram: null,
        photoUrl: null,
        href: pub.doi ? `https://doi.org/${pub.doi}` : (pub.url ?? ""),
        refId: pub.id,
        status: pub.isDemo ? "demo" : "verified",
      });
      for (const author of authors) {
        const rKey = addResearcher(author.id)!;
        edges.push({ id: `${rKey}>${key}`, source: rKey, target: key, kind: "authored" });
      }
    }
  }

  if (options.interests) {
    for (const profile of data.profiles) {
      const matched = new Map<string, string[]>();
      for (const interest of profile.researchInterests) {
        for (const area of areasForInterest(data.areas, interest)) {
          matched.set(area.id, [...(matched.get(area.id) ?? []), interest]);
        }
      }
      for (const [areaId, interests] of matched) {
        const rKey = addResearcher(profile.id)!;
        const aKey = addArea(areaId)!;
        edges.push({ id: `${rKey}~${aKey}`, source: rKey, target: aKey, kind: "interest", label: interests.join(", ") });
      }
    }
  }

  const neighbours = new Map<string, Set<string>>();
  for (const n of nodes.keys()) neighbours.set(n, new Set());
  for (const e of edges) {
    neighbours.get(e.source)?.add(e.target);
    neighbours.get(e.target)?.add(e.source);
  }
  return { nodes: [...nodes.values()], edges, neighbours, byId: nodes };
}

/** A node, its direct neighbours, and areas a researcher reaches via projects. */
export function relatedIds(graph: NetworkGraph, id: string): Set<string> {
  const set = new Set([id, ...(graph.neighbours.get(id) ?? [])]);
  if (id.startsWith("researcher:")) {
    for (const n of graph.neighbours.get(id) ?? []) {
      if (!n.startsWith("project:")) continue;
      for (const m of graph.neighbours.get(n) ?? []) if (m.startsWith("area:")) set.add(m);
    }
  }
  return set;
}

/** Edges touching a node. */
export function edgesOf(graph: NetworkGraph, id: string) {
  return graph.edges.filter((e) => e.source === id || e.target === id);
}

/**
 * Three-column layered layout: areas | researchers | work (projects, then
 * publications). Researchers sit in the middle because they connect both
 * sides; outer columns are ordered by the average row of their researchers to
 * reduce crossings, and shorter columns are spread over the tallest one.
 */
export function layoutNetwork(graph: NetworkGraph, opts = { colGap: 380, rowGap: 96 }) {
  const of = (k: NetworkNodeKind) => graph.nodes.filter((n) => n.kind === k);
  const researchers = of("researcher").sort((a, b) => a.label.localeCompare(b.label));
  const order = new Map(researchers.map((n, i) => [n.id, i] as const));

  const bary = (n: NetworkNode) => {
    const ns = [...(graph.neighbours.get(n.id) ?? [])].filter((id) => order.has(id));
    return ns.length ? ns.reduce((s, id) => s + order.get(id)!, 0) / ns.length : Number.MAX_SAFE_INTEGER;
  };
  const sortBy = (list: NetworkNode[]) => [...list].sort((a, b) => bary(a) - bary(b) || a.label.localeCompare(b.label));

  const columns = [sortBy(of("area")), researchers, [...sortBy(of("project")), ...sortBy(of("publication"))]];
  const height = Math.max(...columns.map((c) => c.length), 1) * opts.rowGap;
  const positions = new Map<string, { x: number; y: number }>();
  columns.forEach((col, ci) => {
    const step = height / Math.max(col.length, 1);
    col.forEach((n, ri) => positions.set(n.id, { x: ci * opts.colGap, y: (ri + 0.5) * step }));
  });
  return positions;
}
