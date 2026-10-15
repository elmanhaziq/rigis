import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Shown for the placeholder slug, or a record that is not (or no longer) published. */
export function RecordUnavailable({ kind }: { kind: "project" | "profile" }) {
  const project = kind === "project";
  return (
    <div className="container-page py-24 sm:py-32">
      <p className="eyebrow flex items-center gap-3">
        <span className="rule-accent" aria-hidden="true" />
        {project ? "Research" : "People"}
      </p>
      <h1 className="mt-4 font-heading text-4xl font-extrabold sm:text-5xl">
        {project ? "Project not found" : "Profile not found"}
      </h1>
      <p className="mt-5 max-w-xl text-lg text-muted-foreground">
        This {kind} may not be published yet, or it may have been removed.
      </p>
      <Button asChild size="lg" className="mt-10">
        <Link href={project ? "/research/" : "/people/"}>{project ? "Browse research" : "Browse people"}</Link>
      </Button>
    </div>
  );
}
