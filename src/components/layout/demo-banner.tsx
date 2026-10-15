import { Info } from "lucide-react";

/** Site-wide notice shown while the site is running on demonstration content. */
export function DemoBanner() {
  return (
    <div role="note" className="bg-navy-900 text-white">
      <div className="container-page flex items-start gap-2.5 py-2 text-[0.8125rem] leading-snug sm:items-center">
        <Info className="mt-0.5 size-4 shrink-0 text-brass sm:mt-0" aria-hidden="true" />
        <p>
          <span className="font-semibold text-brass">Demonstration content.</span>{" "}
          People, projects and publications shown here are fictional placeholders until real
          RIGIS information is added.
        </p>
      </div>
    </div>
  );
}

/** Inline label for an individual demonstration record. */
export function DemoTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-sm border border-dashed border-brass-ink/50 px-2 text-[0.6875rem] font-semibold tracking-[0.08em] text-brass-ink uppercase ${className}`}
    >
      Demo
    </span>
  );
}
