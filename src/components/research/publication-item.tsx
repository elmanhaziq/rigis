import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { PublicProfile, Publication } from "@/types/domain";
import { DemoTag } from "@/components/layout/demo-banner";
import { profileHref } from "@/components/people/researcher-card";

const typeLabel: Record<Publication["publicationType"], string> = {
  journal: "Journal article",
  conference: "Conference paper",
  "book-chapter": "Book chapter",
  report: "Report",
  other: "Publication",
};

export function PublicationItem({
  publication,
  profiles,
}: {
  publication: Publication;
  profiles: Map<string, PublicProfile>;
}) {
  const link = publication.doi ? `https://doi.org/${publication.doi}` : publication.url;
  return (
    <li className="grid gap-2 border-t border-border py-5 sm:grid-cols-[5rem_1fr] sm:gap-6">
      <p className="font-heading text-sm font-semibold text-muted-foreground tabular-nums">
        {publication.year ?? "—"}
      </p>
      <div>
        <p className="font-heading text-[1.0625rem] leading-snug font-semibold text-navy-900">
          {link ? (
            <a href={link} target="_blank" rel="noopener noreferrer" className="link-underline">
              {publication.title}
              <ExternalLink className="ml-1.5 inline size-3.5 align-baseline" aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            publication.title
          )}
        </p>
        <p className="mt-1.5 text-[0.875rem] text-muted-foreground">
          {publication.authors.map((a, i) => {
            const p = a.profileId ? profiles.get(a.profileId) : undefined;
            return (
              <span key={`${a.displayName}-${i}`}>
                {i > 0 && ", "}
                {p ? (
                  <Link href={profileHref(p.slug)} className="font-medium text-purple-700 hover:underline">
                    {a.displayName}
                  </Link>
                ) : (
                  a.displayName
                )}
              </span>
            );
          })}
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.8125rem] text-muted-foreground">
          <span>{typeLabel[publication.publicationType]}</span>
          {publication.venue && <span className="italic">{publication.venue}</span>}
          {publication.isDemo && <DemoTag />}
        </p>
      </div>
    </li>
  );
}
