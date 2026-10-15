"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { PublicProfile, Publication } from "@/types/domain";
import { PublicationItem } from "./publication-item";
import { Button } from "@/components/ui/button";

/**
 * Publication list that shows the most recent entries first and reveals the
 * rest on request, so long publication records stay readable.
 */
export function PublicationList({
  publications,
  profiles,
  initialCount = 10,
}: {
  publications: Publication[];
  profiles: PublicProfile[];
  initialCount?: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const people = new Map(profiles.map((p) => [p.id, p]));
  const visible = expanded ? publications : publications.slice(0, initialCount);
  const hidden = publications.length - visible.length;

  return (
    <div>
      <ul id="publication-list" className="border-b border-border">
        {visible.map((pub) => (
          <PublicationItem key={pub.id} publication={pub} profiles={people} />
        ))}
      </ul>
      {hidden > 0 && (
        <Button
          variant="outline"
          className="mt-6"
          aria-controls="publication-list"
          aria-expanded={expanded}
          onClick={() => setExpanded(true)}
        >
          Show all {publications.length} publications
          <ChevronDown data-icon="inline-end" aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
