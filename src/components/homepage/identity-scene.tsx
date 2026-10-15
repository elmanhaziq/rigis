"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { SiteContent } from "@/types/domain";
import { DemoTag } from "@/components/layout/demo-banner";
import { cn } from "@/lib/utils";

/**
 * Scene 2 — Understanding RIGIS. Four statements read as one continuous
 * narrative. On wide screens a sticky index follows the reader and marks the
 * statement in view; on small screens the statements simply stack. All text
 * stays at full contrast — the active state changes emphasis, never legibility.
 */
export function IdentityScene({ site }: { site: SiteContent }) {
  const steps = [
    { key: "who", label: "Who we are", text: site.introduction },
    { key: "vision", label: "Our vision", text: site.vision },
    { key: "mission", label: "Our mission", text: site.mission },
    { key: "philosophy", label: "Research philosophy", text: site.philosophy },
  ];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="identity" aria-labelledby="identity-title" className="scroll-mt-20 bg-paper">
      <div className="container-page grid gap-10 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow flex items-center gap-3">
              <span className="rule-brass" aria-hidden="true" />
              02 · Understanding RIGIS
            </p>
            <h2 id="identity-title" className="mt-4 font-heading text-[2rem] leading-[1.1] font-bold sm:text-[2.75rem]">
              Who RIGIS is, and what guides its work
            </h2>

            <ol className="mt-10 hidden border-l border-border lg:block" aria-label="In this section">
              {steps.map((s, i) => (
                <li key={s.key}>
                  <a
                    href={`#identity-${s.key}`}
                    aria-current={active === i ? "step" : undefined}
                    className={cn(
                      "-ml-px flex min-h-11 items-center gap-4 border-l-2 pl-5 text-[0.9375rem] transition-colors duration-300",
                      active === i ? "border-brass font-semibold text-navy-900" : "border-transparent text-muted-foreground hover:text-navy-900",
                    )}
                  >
                    <span className="w-6 font-heading text-sm tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ol>

            {site.isDemo && (
              <p className="mt-8 flex items-start gap-3 text-sm text-muted-foreground">
                <DemoTag />
                <span>These statements are placeholders until RIGIS confirms its own wording.</span>
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          {steps.map((s, i) => (
            <article
              key={s.key}
              id={`identity-${s.key}`}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              className="scroll-mt-28 border-t border-border py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[26rem] lg:flex-col lg:justify-center lg:border-t-0 lg:py-16 lg:first:pt-16"
            >
              <h3 className="flex items-center gap-3 font-sans text-[0.8125rem] font-semibold tracking-[0.14em] text-brass-ink uppercase">
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="h-px w-8 bg-brass" aria-hidden="true" />
                {s.label}
              </h3>
              <p
                className={cn(
                  "mt-5 font-heading text-[1.375rem] leading-[1.5] font-medium transition-colors duration-500 sm:text-[1.75rem] sm:leading-[1.45]",
                  active === i ? "text-navy-900" : "text-navy-900 lg:text-muted-foreground",
                )}
              >
                {s.text}
              </p>
            </article>
          ))}
          <Link
            href="/about/"
            className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-navy-800 hover:underline lg:mt-0"
          >
            Objectives and full background
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
