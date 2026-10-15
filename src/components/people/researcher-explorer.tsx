"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { PublicDataset } from "@/lib/data";
import { displayName, publicationsForProfile, sortProfiles } from "@/lib/data/selectors";
import { ProfileAvatar } from "./profile-avatar";
import { profileHref } from "./researcher-card";
import { ResearcherPanelContent } from "./researcher-panel";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DESKTOP_QUERY, useMediaQuery } from "@/hooks/use-media-query";
import { OPEN_RESEARCHER_EVENT, requestAreaSelection } from "@/lib/events";

/**
 * Scene 4 — Meet the researchers. Each portrait is a real link to the
 * researcher's profile page (so it works without JavaScript and can be
 * opened in a new tab); a plain click opens a side panel on desktop or a
 * bottom sheet on mobile, where visitors can move between researchers.
 */
export function ResearcherExplorer({ data }: { data: PublicDataset }) {
  const people = sortProfiles(data.profiles);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [slug, setSlug] = useState<string | null>(null);
  const index = people.findIndex((p) => p.slug === slug);
  const current = index >= 0 ? people[index] : undefined;

  useEffect(() => {
    const onOpen = (e: Event) => {
      const s = (e as CustomEvent<string>).detail;
      if (!people.some((p) => p.slug === s)) return;
      e.preventDefault();
      setSlug(s);
    };
    window.addEventListener(OPEN_RESEARCHER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_RESEARCHER_EVENT, onOpen);
  }, [people]);

  const step = (d: number) => setSlug(people[(index + d + people.length) % people.length]!.slug);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4 lg:gap-x-8">
        {people.map((p) => (
          <li key={p.id}>
            <Link
              href={profileHref(p.slug)}
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                e.preventDefault();
                setSlug(p.slug);
              }}
              aria-haspopup="dialog"
              className="group block focus-visible:outline-none"
            >
              <span className="relative block overflow-hidden bg-card group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-purple-700">
                <ProfileAvatar
                  name={p.fullName}
                  photoUrl={p.photoUrl}
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-purple-700 transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100"
                />
              </span>
              <span className="mt-4 block font-heading text-[1.25rem] leading-snug text-navy-900 group-hover:text-purple-700 sm:text-[1.375rem]">
                {displayName(p)}
              </span>
              {p.position && <span className="mt-1 block text-sm text-muted-foreground">{p.position}</span>}
              <span className="mt-3 block border-t border-border pt-3 text-[0.8125rem] text-muted-foreground">
                {publicationsForProfile(data, p.id).length} publications
                <span className="hidden sm:inline"> · open profile</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <Sheet open={current !== undefined} onOpenChange={(open) => !open && setSlug(null)}>
        <SheetContent
          side={desktop ? "right" : "bottom"}
          className={
            desktop
              ? "w-full gap-0 bg-paper p-0 sm:max-w-xl"
              : "max-h-[88dvh] gap-0 rounded-t-xl bg-paper p-0"
          }
        >
          {current && (
            <>
              <SheetTitle className="sr-only">{displayName(current)}</SheetTitle>
              <SheetDescription className="sr-only">Researcher profile summary</SheetDescription>
              {!desktop && <div className="mx-auto mt-2.5 h-1 w-10 shrink-0 rounded-full bg-input" aria-hidden="true" />}
              <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-6 pb-6 sm:px-8 sm:pt-10">
                <ResearcherPanelContent
                  key={current.id}
                  profile={current}
                  data={data}
                  onSelectResearcher={setSlug}
                  onSelectArea={(areaSlug) => {
                    setSlug(null);
                    // Let the sheet close before scrolling to the explorer.
                    window.setTimeout(() => requestAreaSelection(areaSlug), 220);
                  }}
                />
              </div>
              <div className="flex shrink-0 items-center gap-2 border-t border-border bg-card px-5 py-3 sm:px-8">
                {people.length > 1 && (
                  <>
                    <Button variant="outline" size="icon" onClick={() => step(-1)} aria-label="Previous researcher">
                      <ArrowLeft aria-hidden="true" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => step(1)} aria-label="Next researcher">
                      <ArrowRight aria-hidden="true" />
                    </Button>
                  </>
                )}
                <Button asChild className="ml-auto">
                  <Link href={profileHref(current.slug)}>
                    Full profile
                    <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
