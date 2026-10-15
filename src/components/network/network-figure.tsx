import type { PublicDataset } from "@/lib/data";

/**
 * Static radial rendering of the real collaboration graph: research areas on
 * the inner ring, projects in the middle, researchers outside. Every line is a
 * relationship that exists in the data — nothing is decorative or invented.
 */
export function NetworkFigure({ data, className }: { data: PublicDataset; className?: string }) {
  const cx = 200;
  const cy = 200;
  const ring = <T,>(items: T[], r: number, offset = 0) =>
    new Map(
      items.map((item, i) => {
        const a = (i / Math.max(items.length, 1)) * Math.PI * 2 + offset - Math.PI / 2;
        return [item, { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }] as const;
      }),
    );

  const areaPos = ring(data.areas.map((a) => a.id), 62, 0.3);
  const projectPos = ring(data.projects.map((p) => p.id), 120, 0.1);
  const peoplePos = ring(data.profiles.map((p) => p.id), 172);

  const edges: { x1: number; y1: number; x2: number; y2: number; kind: "area" | "member" }[] = [];
  for (const project of data.projects) {
    const p = projectPos.get(project.id)!;
    for (const areaId of project.areaIds) {
      const a = areaPos.get(areaId);
      if (a) edges.push({ x1: p.x, y1: p.y, x2: a.x, y2: a.y, kind: "area" });
    }
    const memberIds = new Set([project.principalInvestigatorId, ...project.members.map((m) => m.profileId)]);
    for (const id of memberIds) {
      const m = id ? peoplePos.get(id) : undefined;
      if (m) edges.push({ x1: p.x, y1: p.y, x2: m.x, y2: m.y, kind: "member" });
    }
  }

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-labelledby="network-figure-title">
      <title id="network-figure-title">
        {`Collaboration graph: ${data.profiles.length} researchers, ${data.projects.length} projects and ${data.areas.length} research areas`}
      </title>
      <g fill="none" stroke="#9AA9B8" strokeOpacity="0.18">
        <circle cx={cx} cy={cy} r="62" />
        <circle cx={cx} cy={cy} r="120" />
        <circle cx={cx} cy={cy} r="172" />
      </g>
      <g strokeWidth="0.8">
        {edges.map((e, i) => (
          <line
            key={i}
            {...e}
            stroke={e.kind === "area" ? "#B89B68" : "#9AA9B8"}
            strokeOpacity={e.kind === "area" ? 0.55 : 0.4}
          />
        ))}
      </g>
      {[...areaPos.values()].map((p, i) => (
        <rect key={`a${i}`} x={p.x - 5} y={p.y - 5} width="10" height="10" transform={`rotate(45 ${p.x} ${p.y})`} fill="#B89B68" />
      ))}
      {[...projectPos.values()].map((p, i) => (
        <circle key={`p${i}`} cx={p.x} cy={p.y} r="7" fill="#1D4263" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="1.5" />
      ))}
      {[...peoplePos.values()].map((p, i) => (
        <circle key={`r${i}`} cx={p.x} cy={p.y} r="5" fill="#ffffff" />
      ))}
    </svg>
  );
}
