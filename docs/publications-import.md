# Publication import (October 2026)

`src/lib/data/scholar-publications.json` holds the lecturers' full publication
records. It is generated, not hand-edited.

## Sources

1. **Google Scholar profiles** of the four lecturers: the list of entries
   (title, year, Scholar record) is the definition of "their publications".
2. **OpenAlex** (open scholarly database, api.openalex.org): each entry is
   matched by title (≥ 92% similarity, year within ±1) to obtain the full
   author list, affiliations, venue, volume/issue/pages, date and DOI.
3. **Crossref** (DOI registry, api.crossref.org): same match rule, used for
   entries OpenAlex did not return (its free daily quota is small without a
   key).

## Rules

- Entries listed by more than one lecturer are merged into one record and
  linked to every RIGIS author.
- With an OpenAlex or Crossref match, the listing lecturer must appear in the author list
  (full given name, or initials and surname with a UiTM affiliation).
  Matches that fail this check are held back for review, not published.
- Entries with no match in either keep their Scholar title and year, link to
  their Scholar record, and are marked "and co-authors (full list on the
  source record)".
- A curation list removes:
  - entries that are not publications (journal names, reviewer lists,
    author indexes, placeholders);
  - fragments and duplicates of entries that are kept;
  - papers Scholar attributed to the wrong person (other authors with the
    same surname in unrelated fields such as orthopaedics, agronomy,
    geodesy or circuit design).
- Hand-checked entries in `src/lib/data/members.ts` take precedence when a
  generated record lacks a confirmed author list.

## Updating

The intended long-term route is for members to manage publications in the
member portal (Phase 2). Until then, re-run the import scripts kept outside
the repository, then review the exclusion and review lists before committing.
