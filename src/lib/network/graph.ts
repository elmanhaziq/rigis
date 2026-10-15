import type { PublicDataset } from "@/lib/data";
import { displayName, initials } from "@/lib/data/selectors";

export type NetworkNodeKind = "researcher" | "project" | "area";

export type NetworkNode = {
  id: string;
  kind: NetworkNodeKind;
  label: string;
  sublabel: string | null;
  /** Two-letter monogram for researcher nodes. */
  monogram: string | null;
  href: string;
  /** Underlying record id (profile/project/area id). */
  refId: string;
};

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  kind: "participates" | "belongs" | "contributes";
  label?: string;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  /** Adjacency over all edge kinds, for highlighting. */
  neighbours: Map<string, Set<string>>;
}

const nid = (kind: NetworkNodeKind, id: string) => `${kind}:${id}`;

/**
 * Builds the collaboration graph strictly from published records:
 * - researcher → project when the researcher is the PI or a listed member
 * - project → area when the project is tagged with that area
 * - researcher → area (derived) only through such verified participation
 * Records referenced but not present in the public dataset are ignored, so
 * unpublished people or projects can never leak into the graph.
 */
export function buildNetworkGraph(data: PublicDataset): NetworkGraph {
  const profiles = new Map(data.profiles.map((p) => [p.id, p]));
  const areas = new Map(data.areas.map((a) => [a.id, a]));
  const nodes: NetworkNode[] = [];
  const edges: NetworkEdge[] = [];
  const used = new Set<string>();

  const contributes = new Map<string, Set<string>>(); // researcherId -> areaIds

  for (const project of data.projects) {
    const pNode = nid("project", project.id);
    nodes.push({
      id: pNode,
      kind: "project",
      label: project.title,
      sublabel: project.status[0]!.toUpperCase() + project.status.slice(1),
      monogram: null,
      href: `/research/${project.slug}/`,
      refId: project.id,
    });

    const memberRoles = new Map<string, string>();
    if (project.principalInvestigatorId) memberRoles.set(project.principalInvestigatorId, "Principal investigator");
    for (const m of project.members) if (!memberRoles.has(m.profileId)) memberRoles.set(m.profileId, m.projectRole);

    const projectAreaIds = project.areaIds.filter((id) => areas.has(id));
    for (const areaId of projectAreaIds) {
      edges.push({ id: `${pNode}->area:${areaId}`, source: pNode, target: nid("area", areaId), kind: "belongs" });
      used.add(nid("area", areaId));
    }

    for (const [profileId, role] of memberRoles) {
      if (!profiles.has(profileId)) continue;
      const rNode = nid("researcher", profileId);
      used.add(rNode);
      edges.push({ id: `${rNode}->${pNode}`, source: rNode, target: pNode, kind: "participates", label: role });
      const set = contributes.get(profileId) ?? new Set<string>();
      projectAreaIds.forEach((a) => set.add(a));
      contributes.set(profileId, set);
    }
  }

  for (const profile of data.profiles) {
    const id = nid("researcher", profile.id);
    if (!used.has(id)) continue; // only researchers with verified project participation
    nodes.push({
      id,
      kind: "researcher",
      label: displayName(profile),
      sublabel: profile.position,
      monogram: initials(profile.fullName),
      href: `/people/${profile.slug}/`,
      refId: profile.id,
    });
  }
  for (const area of data.areas) {
    const id = nid("area", area.id);
    if (!used.has(id)) continue;
    nodes.push({ id, kind: "area", label: area.name, sublabel: null, monogram: null, href: `/research/?area=${area.slug}`, refId: area.id });
  }

  for (const [profileId, areaIds] of contributes) {
    for (const areaId of areaIds) {
      edges.push({
        id: `researcher:${profileId}~area:${areaId}`,
        source: nid("researcher", profileId),
        target: nid("area", areaId),
        kind: "contributes",
      });
    }
  }

  const neighbours = new Map<string, Set<string>>();
  for (const n of nodes) neighbours.set(n.id, new Set());
  for (const e of edges) {
    neighbours.get(e.source)?.add(e.target);
    neighbours.get(e.target)?.add(e.source);
  }

  return { nodes, edges, neighbours };
}

/**
 * Three-column layered layout (researchers | projects | areas). Rows are
 * ordered by the barycentre of each node's neighbours to reduce crossings.
 */
export function layoutNetwork(graph: NetworkGraph, opts = { colGap: 380, rowGap: 84 }) {
  const byKind = (k: NetworkNodeKind) => graph.nodes.filter((n) => n.kind === k);
  const areas = byKind("area");
  const projects = byKind("project");
  const researchers = byKind("researcher");
  const order = new Map<string, number>();
  areas.forEach((n, i) => order.set(n.id, i));

  const bary = (n: NetworkNode, kinds: NetworkNodeKind[]) => {
    const ns = [...(graph.neighbours.get(n.id) ?? [])].filter((id) => kinds.includes(id.split(":")[0] as NetworkNodeKind) && order.has(id));
    return ns.length ? ns.reduce((s, id) => s + order.get(id)!, 0) / ns.length : Number.MAX_SAFE_INTEGER;
  };

  const projectsSorted = [...projects].sort((a, b) => bary(a, ["area"]) - bary(b, ["area"]));
  const areaScale = projects.length / Math.max(areas.length, 1);
  areas.forEach((n, i) => order.set(n.id, i * areaScale));
  projectsSorted.forEach((n, i) => order.set(n.id, i));
  const researchersSorted = [...researchers].sort((a, b) => bary(a, ["project"]) - bary(b, ["project"]));

  const columns = [researchersSorted, projectsSorted, areas];
  const maxRows = Math.max(...columns.map((c) => c.length), 1);
  const positions = new Map<string, { x: number; y: number }>();
  columns.forEach((col, ci) => {
    const offset = ((maxRows - col.length) * opts.rowGap) / 2;
    col.forEach((n, ri) => positions.set(n.id, { x: ci * opts.colGap, y: offset + ri * opts.rowGap }));
  });
  return positions;
}
