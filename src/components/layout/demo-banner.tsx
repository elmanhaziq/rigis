import { Info } from "lucide-react";
import type { ContentStatus } from "@/types/domain";
import { cn } from "@/lib/utils";

/** Site-wide notice shown while parts of the site are not yet final. */
export function DemoBanner() {
  return (
    <div role="note" className="border-b border-purple-400/40 bg-purple-50 text-navy-900">
      <div className="container-page flex items-start gap-2.5 py-2 text-[0.8125rem] leading-snug sm:items-center">
        <Info className="mt-0.5 size-4 shrink-0 text-purple-700 sm:mt-0" aria-hidden="true" />
        <p>
          <span className="font-semibold text-purple-700">Content in progress.</span>{" "}
          Items marked &ldquo;Demo&rdquo; are placeholders and items marked &ldquo;Provisional&rdquo;
          await confirmation by RIGIS.
        </p>
      </div>
    </div>
  );
}

/** Inline label for an individual demonstration record. */
export function DemoTag({ className = "" }: { className?: string }) {
  return <StatusTag status="demo" className={className} />;
}

/**
 * Inline content-status label. Verified records render nothing; other states
 * carry text, not just colour, so the distinction is never visual-only.
 */
export function StatusTag({
  status,
  className,
  inverted = false,
}: {
  status: ContentStatus;
  className?: string;
  inverted?: boolean;
}) {
  if (status === "verified") return null;
  const label = status === "demo" ? "Demo" : "Provisional";
  return (
    <span
      title={
        status === "demo"
          ? "Placeholder content, not real RIGIS information"
          : "Supplied by RIGIS, awaiting final confirmation"
      }
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-sm border border-dashed px-2 text-[0.6875rem] font-semibold tracking-[0.08em] uppercase",
        inverted ? "border-brass/60 text-brass" : "border-brass-ink/50 text-brass-ink",
        className,
      )}
    >
      {label}
    </span>
  );
}
