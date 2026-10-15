"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, FlaskConical, Info, Network } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { displayName } from "@/lib/data/selectors";
import { projectsForArea, researchersForArea } from "@/lib/data/relationships";
import { ProfileAvatar } from "@/components/people/profile-avatar";
import { StatusTag } from "@/components/layout/demo-banner";
import { projectHref } from "./project-card";
import { ProjectStatusBadge } from "./status-badge";
import { SELECT_AREA_EVENT, requestResearcherPanel } from "@/lib/events";
import { cn } from "@/lib/utils";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";

/**
 * Interactive research-area explorer. Selecting an area reveals what it
 * covers, the researchers connected to it (and why), and its approved
 * projects — without leaving the page. Implements the WAI-ARIA tabs pattern
 * (arrow keys, Home/End). Used on the homepage and on /research.
 */
export function AreaExplorer({
  data,
  syncUrl = false,
  showDirectoryLink = true,
  headingLevel: H = "h3",
}: {
  data: PublicDataset;
  /** Keep ?area= in the address bar (research page). */
  syncUrl?: boolean;
  showDirectoryLink?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const reduce = useReducedMotion();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [activeSlug, setActiveSlug] = useState(data.areas[0]?.slug ?? "");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (slug: string, focus = false) => {
    setActiveSlug(slug);
    if (syncUrl) {
      const url = new URL(window.location.href);
      url.searchParams.set("area", slug);
      window.history.replaceState(window.history.state, "", url);
    }
    if (focus) tabs.current[data.areas.findIndex((a) => a.slug === slug)]?.focus();
  };

  // Initial selection from ?area= and selections requested by other components.
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("area");
    if (fromUrl && data.areas.some((a) => a.slug === fromUrl)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync from the URL after hydration
      setActiveSlug(fromUrl);
    }
    const onSelect = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      if (data.areas.some((a) => a.slug === slug)) setActiveSlug(slug);
    };
    window.addEventListener(SELECT_AREA_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_AREA_EVENT, onSelect);
  }, [data.areas]);

  const summary = useMemo(
    () =>
      new Map(
        data.areas.map((a) => [a.id, { researchers: researchersForArea(data, a.id), projects: projectsForArea(data, a.id) }]),
      ),
    [data],
  );

  const area = data.areas.find((a) => a.slug === activeSlug) ?? data.areas[0];
  if (!area) return null;
  const { researchers, projects } = summary.get(area.id)!;
  const index = data.areas.indexOf(area);

  function onKeyDown(e: React.KeyboardEvent) {
    const n = data.areas.length;
    const next = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select(data.areas[(next + n) % n]!.slug, true);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div
        role="tablist"
        aria-label="Research areas"
        aria-orientation={desktop ? "vertical" : "horizontal"}
        onKeyDown={onKeyDown}
        className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:col-span-5 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-purple-700 lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
      >
        {data.areas.map((a, i) => {
          const selected = a.id === area.id;
          const s = summary.get(a.id)!;
          return (
            <button
              key={a.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              id={`area-tab-${a.slug}`}
              aria-selected={selected}
              aria-controls="area-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(a.slug)}
              className={cn(
                "group relative flex shrink-0 snap-start items-center gap-3 rounded-sm border px-4 py-3 text-left transition-colors duration-200",
                "lg:rounded-none lg:border-0 lg:border-b lg:border-border lg:px-4 lg:py-5",
                selected ? "border-primary bg-primary text-primary-foreground lg:bg-purple-50 lg:text-purple-700" : "border-border bg-card text-navy-900 hover:border-purple-400 lg:bg-transparent lg:hover:bg-card",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "hidden h-full w-1 self-stretch transition-colors lg:absolute lg:top-0 lg:left-0 lg:block",
                  selected ? "bg-purple-700" : "bg-transparent",
                )}
              />
              <span aria-hidden="true" className="size-2.5 shrink-0 rotate-45" style={{ background: a.accent }} />
              <span className={cn("font-heading text-sm font-semibold tabular-nums", selected ? "text-purple-200 lg:text-purple-700" : "text-muted-foreground")}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-[0.9375rem] leading-snug font-bold whitespace-nowrap lg:text-lg lg:whitespace-normal">
                  {a.name}
                </span>
                <span className={cn("hidden text-[0.8125rem] lg:block", selected ? "text-muted-foreground" : "text-muted-foreground")}>
                  {s.researchers.length} {s.researchers.length === 1 ? "researcher" : "researchers"} · {s.projects.length}{" "}
                  {s.projects.length === 1 ? "project" : "projects"}
                </span>
              </span>
              <ArrowRight
                className={cn("ml-auto hidden size-4 shrink-0 transition-all lg:block", selected ? "translate-x-0 text-purple-700" : "-translate-x-1 text-transparent group-hover:text-muted-foreground")}
                aria-hidden="true"
              />
            </button>
          );
        })}
      </div>

      <div id="area-panel" role="tabpanel" aria-labelledby={`area-tab-${area.slug}`} tabIndex={0} className="min-h-[24rem] outline-none lg:col-span-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={area.id}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="border border-border border-t-4 bg-card p-6 sm:p-8" style={{ borderTopColor: area.accent }}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span aria-hidden="true" className="size-3 rotate-45" style={{ background: area.accent }} />
              <span className="font-heading text-sm font-semibold text-purple-700 tabular-nums">{String(index + 1).padStart(2, "0")}</span>
              <StatusTag status={area.status} />
            </div>
            <H className="mt-3 font-heading text-2xl leading-tight font-bold sm:text-[1.875rem]">{area.name}</H>
            {area.description && <p className="mt-3 text-[1.0625rem] leading-relaxed text-muted-foreground">{area.description}</p>}

            <div className="mt-8 border-t border-border pt-6">
              <h4 className="eyebrow">Researchers</h4>
              {researchers.length === 0 ? (
                <p className="mt-3 text-[0.9375rem] text-muted-foreground">
                  No researcher has listed this area among their interests yet, and no approved project is linked to it.
                </p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {researchers.map(({ profile, basis, matchedInterests }) => (
                    <li key={profile.id}>
                      <Link
                        href={`/people/${profile.slug}/`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                          if (requestResearcherPanel(profile.slug)) e.preventDefault();
                        }}
                        className="group flex items-center gap-3 rounded-sm border border-border p-2.5 transition-colors hover:border-purple-400"
                      >
                        <ProfileAvatar
                          name={profile.fullName}
                          photoUrl={profile.photoUrl}
                          className="aspect-square w-12 shrink-0"
                          textClassName="text-sm"
                        />
                        <span className="min-w-0">
                          <span className="line-clamp-2 text-[0.9375rem] leading-snug font-semibold text-navy-900 group-hover:underline">
                            {displayName(profile)}
                          </span>
                          <span className="block text-[0.8125rem] leading-snug text-muted-foreground">
                            {basis === "project" ? "Project team member" : `Stated interest: ${matchedInterests.join(", ")}`}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {researchers.some((r) => r.basis === "interest") && (
                <p className="mt-3 flex items-start gap-2 text-[0.8125rem] text-muted-foreground">
                  <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                  Interest links come from the research interests each researcher lists on their profile, not from project records.
                </p>
              )}
            </div>

            <div className="mt-8 border-t border-border pt-6">
              <h4 className="eyebrow">Approved projects</h4>
              {projects.length === 0 ? (
                <p className="mt-3 flex items-start gap-2 text-[0.9375rem] text-muted-foreground">
                  <FlaskConical className="mt-0.5 size-4 shrink-0 text-purple-700" aria-hidden="true" />
                  No approved projects are linked to this area yet. They will appear here once published.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-border border-y border-border">
                  {projects.map((p) => (
                    <li key={p.id}>
                      <Link href={projectHref(p.slug)} className="flex min-h-12 items-center justify-between gap-4 py-3 hover:text-purple-700">
                        <span className="font-semibold text-navy-900">{p.title}</span>
                        <ProjectStatusBadge status={p.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <Link
                href={`/network/?focus=area:${area.id}`}
                className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-purple-700 hover:underline"
              >
                <Network className="size-4" aria-hidden="true" />
                See it in the research network
              </Link>
              {showDirectoryLink && (
                <Link
                  href={`/research/?area=${area.slug}`}
                  className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-purple-700 hover:underline"
                >
                  Research directory
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
