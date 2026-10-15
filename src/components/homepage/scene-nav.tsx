"use client";

import { useEffect, useState } from "react";
import { ListOrdered } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const scenes = [
  { id: "enter", label: "Enter RIGIS" },
  { id: "identity", label: "Understanding RIGIS" },
  { id: "research", label: "Explore our research" },
  { id: "people", label: "Meet the researchers" },
  { id: "network", label: "Research network" },
  { id: "collaborate", label: "Work with us" },
] as const;

/**
 * Story navigation. Desktop: a quiet chapter rail on the right edge that marks
 * the scene in view. Mobile: a "Chapters" button (shown after the opening
 * scene) that opens a bottom sheet, so any part of the story is two taps away.
 */
export function SceneNav() {
  const [active, setActive] = useState<string>("enter");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const s of scenes) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <>
      <nav aria-label="Story chapters" className="fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 xl:block">
        <ol className="flex flex-col items-end gap-1">
          {scenes.map((s, i) => {
            const on = active === s.id;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={on ? "location" : undefined}
                  className="group flex min-h-8 items-center gap-3 py-1"
                >
                  <span
                    className={cn(
                      "rounded-sm px-2 py-1 text-xs font-semibold whitespace-nowrap shadow-sm transition-all duration-200",
                      "pointer-events-none translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                      "bg-navy-900 text-white",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} · {s.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "block h-px transition-all duration-300",
                      on ? "w-8 bg-purple-700" : "w-4 bg-slate-brand group-hover:w-6 group-hover:bg-purple-400",
                    )}
                  />
                  <span className="sr-only">{s.label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            className={cn(
              "fixed right-4 bottom-4 z-30 h-11 gap-2 rounded-full px-4 shadow-lg transition-all duration-300 xl:hidden",
              active === "enter" ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
            )}
            aria-hidden={active === "enter"}
            tabIndex={active === "enter" ? -1 : 0}
          >
            <ListOrdered aria-hidden="true" />
            Chapters
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-xl bg-paper px-5 pt-3 pb-8">
          <div className="mx-auto h-1 w-10 rounded-full bg-input" aria-hidden="true" />
          <SheetTitle className="mt-3 font-heading text-lg font-semibold text-navy-900">The RIGIS story</SheetTitle>
          <SheetDescription className="sr-only">Jump to a chapter</SheetDescription>
          <ol className="divide-y divide-border border-y border-border">
            {scenes.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={active === s.id ? "location" : undefined}
                  className={cn(
                    "flex min-h-12 items-center gap-4 text-[0.9375rem]",
                    active === s.id ? "font-semibold text-navy-900" : "text-muted-foreground",
                  )}
                >
                  <span className="w-6 font-heading text-sm text-purple-700 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ol>
        </SheetContent>
      </Sheet>
    </>
  );
}
