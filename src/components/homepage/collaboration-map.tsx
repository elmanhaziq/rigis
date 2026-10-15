"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { displayName } from "@/lib/data/selectors";
import { memberAuthors, sharedPublications } from "@/lib/data/relationships";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";


type Selection = { kind: "researcher" | "publication"; id: string } | null;

/**
 * Co-authorship map for the homepage network scene. Researchers sit around
 * the edge; each paper written together is placed between its RIGIS authors,
 * so clusters show who works with whom. Every element is a real record.
 * Select a researcher or a paper (click, tap, Enter/Space) to inspect it.
 */
export function CollaborationMap({ data }: { data: PublicDataset }) {
  const [selected, setSelected] = useState<Selection>(null);
  const [hovered, setHovered] = useState<Selection>(null);
  const focus = hovered ?? selected;
  // Phones get a portrait canvas so nodes stay large enough to tap without sideways scrolling.
  const compact = useMediaQuery("(max-width: 639px)");
  const W = compact ? 400 : 800;
  const H = compact ? 560 : 480;

  const model = useMemo(() => {
    const pubs = sharedPublications(data);
    const people = data.profiles.filter((p) => pubs.some((pub) => memberAuthors(pub, data).some((a) => a.id === p.id)));
    const n = people.length;
    const pos = new Map(
      people.map((p, i) => {
        const a = (i / Math.max(n, 1)) * Math.PI * 2 - Math.PI * 0.75;
        const rx = compact ? 112 : 300;
        const ry = compact ? 170 : 175;
        return [p.id, { x: W / 2 + Math.cos(a) * rx, y: H / 2 + Math.sin(a) * ry }] as const;
      }),
    );
    const groupCount = new Map<string, number>();
    const papers = pubs.map((pub) => {
      const authors = memberAuthors(pub, data).map((a) => a.id).filter((id) => pos.has(id));
      const key = [...authors].sort().join("|");
      const k = groupCount.get(key) ?? 0;
      groupCount.set(key, k + 1);
      const cx = authors.reduce((s, id) => s + pos.get(id)!.x, 0) / authors.length;
      const cy = authors.reduce((s, id) => s + pos.get(id)!.y, 0) / authors.length;
      const angle = k * 2.4;
      const r = k === 0 ? 0 : (compact ? 22 : 26) * Math.sqrt(k);
      return { pub, authors, x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r };
    });
    return { people, pos, papers };
  }, [data, compact, W, H]);

  if (model.papers.length === 0) return null;

  const litResearcher = (id: string) =>
    !focus ||
    (focus.kind === "researcher" && (focus.id === id || model.papers.some((p) => p.authors.includes(focus.id) && p.authors.includes(id)))) ||
    (focus.kind === "publication" && model.papers.find((p) => p.pub.id === focus.id)?.authors.includes(id));
  const litPaper = (paper: (typeof model.papers)[number]) =>
    !focus || (focus.kind === "publication" ? focus.id === paper.pub.id : paper.authors.includes(focus.id));

  const toggle = (s: NonNullable<Selection>) =>
    setSelected((cur) => (cur && cur.kind === s.kind && cur.id === s.id ? null : s));
  const keyActivate = (s: NonNullable<Selection>) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(s);
    }
  };

  const sel = selected;
  const selPerson = sel?.kind === "researcher" ? data.profiles.find((p) => p.id === sel.id) : undefined;
  const selPaper = sel?.kind === "publication" ? model.papers.find((p) => p.pub.id === sel.id) : undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
      <div className="min-w-0 lg:col-span-8">
        <div className="mx-auto max-w-[440px] sm:max-w-none">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-auto w-full"
            role="group"
            aria-label={`Co-authorship map: ${model.papers.length} papers written together by ${model.people.length} RIGIS researchers`}
            onMouseLeave={() => setHovered(null)}
          >
            <defs>
              {model.people.map((p) => {
                const c = model.pos.get(p.id)!;
                return (
                  <clipPath key={p.id} id={`cm-clip-${p.id}`}>
                    <circle cx={c.x} cy={c.y} r="34" />
                  </clipPath>
                );
              })}
            </defs>
            <g aria-hidden="true">
              {model.papers.flatMap((paper) =>
                paper.authors.map((id) => {
                  const c = model.pos.get(id)!;
                  const on = litPaper(paper);
                  return (
                    <line
                      key={`${paper.pub.id}-${id}`}
                      x1={c.x} y1={c.y} x2={paper.x} y2={paper.y}
                      stroke={on && focus ? "#B89B68" : "#9AA9B8"}
                      strokeOpacity={on ? (focus ? 0.9 : 0.45) : 0.08}
                      strokeWidth={on && focus ? 1.6 : 1}
                      style={{ transition: "stroke-opacity 200ms, stroke 200ms" }}
                    />
                  );
                }),
              )}
            </g>
            {model.papers.map((paper) => {
              const s = { kind: "publication", id: paper.pub.id } as const;
              const isSel = selected?.kind === "publication" && selected.id === paper.pub.id;
              return (
                <g
                  key={paper.pub.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`Paper: ${paper.pub.title}, ${paper.pub.year}`}
                  onClick={() => toggle(s)}
                  onKeyDown={keyActivate(s)}
                  onMouseEnter={() => setHovered(s)}
                  onFocus={() => setHovered(s)}
                  onBlur={() => setHovered(null)}
                  className="cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-navy-900"
                  style={{ opacity: litPaper(paper) ? 1 : 0.25, transition: "opacity 200ms" }}
                >
                  <circle cx={paper.x} cy={paper.y} r="18" fill="transparent" />
                  <circle
                    cx={paper.x}
                    cy={paper.y}
                    r={isSel ? 10 : 8}
                    fill="#B89B68"
                    stroke={isSel ? "#10243A" : "#ffffff"}
                    strokeWidth="2.5"
                    style={{ transition: "r 150ms" }}
                  />
                </g>
              );
            })}
            {model.people.map((p) => {
              const c = model.pos.get(p.id)!;
              const s = { kind: "researcher", id: p.id } as const;
              const isSel = selected?.kind === "researcher" && selected.id === p.id;
              const below = c.y > H / 2;
              return (
                <g
                  key={p.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSel}
                  aria-label={`Researcher: ${displayName(p)}`}
                  onClick={() => toggle(s)}
                  onKeyDown={keyActivate(s)}
                  onMouseEnter={() => setHovered(s)}
                  onFocus={() => setHovered(s)}
                  onBlur={() => setHovered(null)}
                  className="cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-brass"
                  style={{ opacity: litResearcher(p.id) ? 1 : 0.35, transition: "opacity 200ms" }}
                >
                  <circle cx={c.x} cy={c.y} r="39" fill="#ffffff" stroke={isSel ? "#B89B68" : "#10243A"} strokeWidth={isSel ? 4 : 1.5} />
                  {p.photoUrl ? (
                    <image
                      href={p.photoUrl}
                      x={c.x - 34}
                      y={c.y - 34}
                      width="68"
                      height="68"
                      preserveAspectRatio="xMidYMin slice"
                      clipPath={`url(#cm-clip-${p.id})`}
                    />
                  ) : (
                    <text x={c.x} y={c.y + 6} textAnchor="middle" className="fill-navy-900 font-heading text-[18px] font-bold">
                      {p.fullName.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </text>
                  )}
                  <text
                    x={c.x}
                    y={below ? c.y + 62 : c.y - 52}
                    textAnchor="middle"
                    className="fill-navy-900 font-heading text-[15px] font-bold"
                  >
                    {compact ? p.fullName.split(" ")[0] : p.fullName}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <aside aria-live="polite" className="min-w-0 lg:col-span-4">
        <div className="border border-border bg-card p-6">
          {selPaper ? (
            <>
              <p className="eyebrow">Paper written together · {selPaper.pub.year}</p>
              <p className="mt-2 font-heading text-lg leading-snug font-bold text-navy-900">{selPaper.pub.title}</p>
              {selPaper.pub.venue && <p className="mt-2 text-sm text-muted-foreground italic">{selPaper.pub.venue}</p>}
              <p className="mt-4 text-sm font-semibold text-navy-900">RIGIS authors</p>
              <ul className="mt-2 space-y-1.5">
                {selPaper.authors.map((id) => {
                  const p = data.profiles.find((x) => x.id === id)!;
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => setSelected({ kind: "researcher", id })}
                        className="min-h-8 text-left text-[0.9375rem] text-navy-800 hover:underline"
                      >
                        {displayName(p)}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {(selPaper.pub.doi || selPaper.pub.url) && (
                <a
                  href={selPaper.pub.doi ? `https://doi.org/${selPaper.pub.doi}` : selPaper.pub.url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline"
                >
                  Read the paper <ExternalLink className="size-3.5" aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </>
          ) : selPerson ? (
            <>
              <p className="eyebrow">Researcher</p>
              <p className="mt-2 font-heading text-lg font-bold text-navy-900">{displayName(selPerson)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {model.papers.filter((p) => p.authors.includes(selPerson.id)).length} papers written with other RIGIS members
              </p>
              <ul className="mt-4 space-y-2">
                {model.papers
                  .filter((p) => p.authors.includes(selPerson.id))
                  .map((p) => (
                    <li key={p.pub.id}>
                      <button
                        type="button"
                        onClick={() => setSelected({ kind: "publication", id: p.pub.id })}
                        className="text-left text-sm leading-snug text-navy-800 hover:underline"
                      >
                        {p.pub.title}
                      </button>
                    </li>
                  ))}
              </ul>
              <Link
                href={`/people/${selPerson.slug}/`}
                className="mt-4 inline-flex min-h-10 items-center gap-1.5 text-sm font-semibold text-navy-800 hover:underline"
              >
                Full profile <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            </>
          ) : (
            <>
              <p className="eyebrow">How to read this map</p>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/90">
                Each <span className="font-semibold text-brass-ink">gold point</span> is a paper written by two or more RIGIS
                researchers, placed between its authors. Points near the centre involve more of the group.
              </p>
              <p className={cn("mt-3 text-[0.9375rem] text-muted-foreground")}>
                Select a researcher or a paper to see the connection.
              </p>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
