"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import type { PublicDataset } from "@/lib/data";
import { displayName } from "@/lib/data/selectors";
import { areasForInterest, collaboratorsFor, memberAuthors, recentWindow } from "@/lib/data/relationships";
import { cn } from "@/lib/utils";
import { palette } from "@/config/palette";

const C = 300; // viewBox centre
const R_PEOPLE = 118;
const R_AREAS = 252;

type Point = { x: number; y: number };
const polar = (r: number, angle: number): Point => ({ x: C + r * Math.cos(angle), y: C + r * Math.sin(angle) });

/**
 * "RIGIS at a glance": every researcher, every listed publication and every
 * research area, drawn from the data. Papers sit between the members who
 * wrote them, so co-authorship is visible as shared ground. Pointer movement
 * adds a little depth on desktop; selecting a researcher (hover, focus or
 * tap) explains their part of the picture in the caption.
 */
export function HeroConstellation({ data }: { data: PublicDataset }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const frame = useRef(0);
  const [active, setActive] = useState<string | null>(null);
  const lastTap = useRef<{ pointerType: string; wasActive: boolean } | null>(null);

  const model = useMemo(() => {
    const people = data.profiles.map((p, i) => ({
      profile: p,
      pos: polar(R_PEOPLE, (i / Math.max(data.profiles.length, 1)) * Math.PI * 2 - Math.PI / 4),
    }));
    const posOf = new Map(people.map((p) => [p.profile.id, p.pos]));
    const areas = data.areas.map((a, i) => ({
      area: a,
      pos: polar(R_AREAS, (i / Math.max(data.areas.length, 1)) * Math.PI * 2 - Math.PI / 2),
    }));

    const soloCount = new Map<string, number>();
    const pubs = recentWindow(data).publications
      .map((pub) => {
        const authors = memberAuthors(pub, data).filter((a) => posOf.has(a.id));
        if (authors.length === 0) return null;
        let pos: Point;
        if (authors.length > 1) {
          const cx = authors.reduce((s, a) => s + posOf.get(a.id)!.x, 0) / authors.length;
          const cy = authors.reduce((s, a) => s + posOf.get(a.id)!.y, 0) / authors.length;
          const k = soloCount.get(pub.id) ?? 0;
          const seed = [...pub.id].reduce((s, ch) => s + ch.charCodeAt(0), 0);
          pos = { x: cx + ((seed % 23) - 11) * 2.2, y: cy + (((seed >> 3) % 23) - 11) * 2.2 + k };
        } else {
          const home = posOf.get(authors[0]!.id)!;
          const n = soloCount.get(authors[0]!.id) ?? 0;
          soloCount.set(authors[0]!.id, n + 1);
          const base = Math.atan2(home.y - C, home.x - C);
          const angle = base + ((n % 7) - 3) * 0.17;
          const r = R_PEOPLE + 46 + Math.floor(n / 7) * 18 + (n % 2) * 9;
          pos = polar(r, angle);
        }
        return { pub, authors: authors.map((a) => a.id), pos, shared: authors.length > 1 };
      })
      .filter((p) => p !== null);

    const interestLinks = people.flatMap(({ profile }) => {
      const ids = new Set(profile.researchInterests.flatMap((i) => areasForInterest(data.areas, i).map((a) => a.id)));
      return [...ids].map((areaId) => ({ profileId: profile.id, areaId }));
    });
    return { people, areas, pubs, interestLinks, posOf };
  }, [data]);

  const { since } = recentWindow(data);
  const areaPos = new Map(model.areas.map((a) => [a.area.id, a.pos]));
  const activeProfile = active ? model.people.find((p) => p.profile.id === active)?.profile : undefined;
  const activeStats = useMemo(() => {
    if (!active) return null;
    return {
      pubs: model.pubs.filter((p) => p.authors.includes(active)).length,
      collaborators: collaboratorsFor(data, active).length,
      areas: model.interestLinks.filter((l) => l.profileId === active).length,
    };
  }, [active, model, data]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const el = svgRef.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
  }

  const layer = (depth: number): React.CSSProperties => ({
    transform: `translate(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth}px))`,
    transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
  });
  const lit = (ids: string[]) => !active || ids.includes(active);

  return (
    <figure className="relative" onPointerMove={onPointerMove} onPointerLeave={() => svgRef.current?.style.setProperty("--mx", "0")}>
      <svg
        ref={svgRef}
        viewBox="-90 -10 780 620"
        className="h-auto w-full"
        role="group"
        aria-label={`RIGIS at a glance: ${data.profiles.length} researchers, ${model.pubs.length} publications and ${data.areas.length} research areas`}
      >
        <defs>
          {model.people.map(({ profile, pos }) => (
            <clipPath key={profile.id} id={`hero-clip-${profile.id}`}>
              <circle cx={pos.x} cy={pos.y} r="29" />
            </clipPath>
          ))}
        </defs>

        <g style={layer(14)} aria-hidden="true">
          <circle cx={C} cy={C} r={R_AREAS} fill="none" stroke={palette.purple400} strokeOpacity="0.35" />
          <circle cx={C} cy={C} r={R_PEOPLE + 62} fill="none" stroke={palette.purple400} strokeOpacity="0.14" />
          {model.interestLinks.map(({ profileId, areaId }) => {
            const a = areaPos.get(areaId)!;
            const p = model.posOf.get(profileId)!;
            return (
              <line
                key={`${profileId}-${areaId}`}
                x1={p.x} y1={p.y} x2={a.x} y2={a.y}
                stroke={palette.purple400}
                strokeDasharray="3 5"
                strokeOpacity={lit([profileId]) ? 0.7 : 0.08}
                style={{ transition: "stroke-opacity 250ms" }}
              />
            );
          })}
          {model.areas.map(({ area, pos }) => {
            const on = !active || model.interestLinks.some((l) => l.profileId === active && l.areaId === area.id);
            const right = pos.x >= C;
            return (
              <g key={area.id} style={{ opacity: on ? 1 : 0.3, transition: "opacity 250ms" }}>
                <rect x={pos.x - 7} y={pos.y - 7} width="14" height="14" transform={`rotate(45 ${pos.x} ${pos.y})`} fill={area.accent} />
                <text
                  x={pos.x + (Math.abs(pos.x - C) < 10 ? 0 : right ? 14 : -14)}
                  y={pos.y + (Math.abs(pos.x - C) < 10 ? (pos.y < C ? -16 : 26) : 4)}
                  textAnchor={Math.abs(pos.x - C) < 10 ? "middle" : right ? "start" : "end"}
                  className="hidden fill-white/75 font-sans text-[13px] font-medium sm:inline"
                >
                  {area.shortName}
                </text>
              </g>
            );
          })}
        </g>

        <g style={layer(7)} aria-hidden="true">
          {model.pubs.flatMap(({ pub, authors, pos }) =>
            authors.map((id) => {
              const p = model.posOf.get(id)!;
              return (
                <line
                  key={`${pub.id}-${id}`}
                  x1={p.x} y1={p.y} x2={pos.x} y2={pos.y}
                  pathLength={1}
                  className="hero-draw"
                  stroke={palette.slate}
                  strokeOpacity={lit(authors) ? 0.35 : 0.06}
                  style={{ transition: "stroke-opacity 250ms" }}
                />
              );
            }),
          )}
          {model.pubs.map(({ pub, authors, pos, shared }) => (
            <circle
              key={pub.id}
              cx={pos.x}
              cy={pos.y}
              r={shared ? 5 : 3.2}
              fill={shared ? palette.gold : palette.purple200}
              opacity={lit(authors) ? 1 : 0.18}
              style={{ transition: "opacity 250ms" }}
            />
          ))}
        </g>

        <g style={layer(3)}>
          {model.people.map(({ profile, pos }) => {
            const on = active === profile.id;
            return (
              <a
                key={profile.id}
                href={`/people/${profile.slug}/`}
                aria-label={`${displayName(profile)}, ${profile.position ?? "researcher"}`}
                // Hover previews only for a real mouse: touch browsers emulate hover
                // right before the tap, which would skip the preview step.
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(profile.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                onPointerDown={(e) => {
                  lastTap.current = { pointerType: e.pointerType, wasActive: active === profile.id };
                }}
                // Keyboard focus previews; focus caused by a tap does not.
                onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(profile.id)}
                onBlur={() => setActive((current) => (current === profile.id ? null : current))}
                onClick={(e) => {
                  // Touch: the first tap shows the preview, a second tap opens the profile.
                  const tap = lastTap.current;
                  lastTap.current = null;
                  if (tap && tap.pointerType !== "mouse" && !tap.wasActive) {
                    e.preventDefault();
                    setActive(profile.id);
                  }
                }}
                className="cursor-pointer outline-none [&:focus-visible>circle:nth-child(2)]:stroke-purple-200"
              >
                {/* Invisible hit area: keeps the target at least 44px wide on small phones. */}
                <circle cx={pos.x} cy={pos.y} r="58" fill="transparent" />
                <circle cx={pos.x} cy={pos.y} r="34" fill={palette.navy900} stroke={on ? palette.purple200 : palette.white} strokeOpacity={on ? 1 : 0.85} strokeWidth={on ? 3 : 1.5} style={{ transition: "stroke 200ms" }} />
                {profile.photoUrl ? (
                  <image
                    href={profile.photoUrl}
                    x={pos.x - 29}
                    y={pos.y - 29}
                    width="58"
                    height="58"
                    preserveAspectRatio="xMidYMin slice"
                    clipPath={`url(#hero-clip-${profile.id})`}
                    opacity={!active || on ? 1 : 0.45}
                    style={{ transition: "opacity 250ms" }}
                  />
                ) : (
                  <text x={pos.x} y={pos.y + 5} textAnchor="middle" className="fill-white font-heading text-[15px] font-semibold">
                    {profile.fullName.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </text>
                )}
              </a>
            );
          })}
        </g>
      </svg>

      <figcaption aria-live="polite" className="mt-3 min-h-[4.5rem] border-t border-white/15 pt-4 text-[0.9375rem] leading-relaxed text-white/75">
        <span className="mr-2 font-heading text-base text-purple-200 italic">Fig. 1</span>
        {activeProfile && activeStats ? (
          <>
            <span className="font-heading text-base text-white">{displayName(activeProfile)}</span>
            {" "}— {activeStats.pubs} publications since {since}; has written with {activeStats.collaborators} RIGIS{" "}
            {activeStats.collaborators === 1 ? "colleague" : "colleagues"}.
            <Link
              href={`/people/${activeProfile.slug}/`}
              className="mt-1 flex min-h-8 items-center gap-1 text-sm font-semibold text-purple-200 hover:underline"
            >
              View profile <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
          </>
        ) : (
          <>
            The group since {since}. Portraits are researchers; each point is a paper, in{" "}
            <span className="text-brass">gold</span> where two or more members wrote it together; diamonds are research areas.{" "}
            <span className={cn("text-white/60")}>Select a researcher to see their part.</span>
          </>
        )}
      </figcaption>
    </figure>
  );
}
