# RIGIS — Design audit and redesign (October 2026)

Audit of the live site (rigis.elman-ai.com) as rendered, at 1440, 1280, 1024,
768, 430, 390, 375 and 360px, followed by the redesign that addresses it.

## Report 1 — Design audit (before)

### Scores

| Area | Score | Why |
|---|---|---|
| Brand identity | 5 | Nothing ownable. A node-network logo and "constellation" motif are the most common AI/tech cliché; the wordmark was a generic geometric sans. |
| Visual sophistication | 5.5 | Clean and consistent, but every page used the same header (eyebrow + rule, big sans heading, paragraph on the right). Felt assembled from one template. |
| Typography | 5 | Manrope ExtraBold + Inter is a startup-template default. Headings were heavy and similar in size at every level; ~30 tracked-caps eyebrows with rules flattened the hierarchy. |
| Colour consistency | 6.5 | Coherent and accessible after the palette update, but four dark bands stacked (navy banner, navy network, purple close, navy footer) and purple doubled as the colour of every link. |
| Layout composition | 5 | "Label left / text right" repeated four times on About; equal-card grids for people, pathways and contact help; no editorial variation. |
| Research presentation | 4.5 | No projects yet, and the Research page displayed four filters over zero results. Research areas had no identity beyond a diamond; five of six rows read "0 researchers · 0 projects". |
| Interactive experience | 7 | Genuinely useful explorers, panels and network, driven by real data. Hero map labels were unreadable on phones. |
| Mobile experience | 6.5 | No overflow, but tiny map targets (27px), unreadable 5px labels, 26px zoom controls and long vertical runs. |
| Accessibility | 8 | AA contrast verified, keyboard-operable tabs, labelled forms; several targets under 44px. |
| Professional credibility | 5.5 | Placeholder About text, "to be confirmed" affiliation and marketing headlines ("Six areas, one direction", "The next connection could be yours") undercut an academic tone. |
| **Overall** | **5.8** | Competent, accessible, but recognisably template-made. |

### AI-slop patterns found
- Eyebrow label + decorative rule above nearly every heading (~30 instances).
- Identical page-header composition on all inner pages.
- Icon + title + text card grids (closing pathways, contact "How we can help").
- Hover "View profile" slide-up overlay on portraits.
- Decorative grid-paper texture in the hero.
- Marketing headlines in place of plain academic labels.
- Pills everywhere: interest chips, status tags, area tags, filter chips.
- Search and filter controls for four people and zero projects.
- Generated "line-field" project covers standing in for imagery.

### Top 10 problems (ranked)
**Critical**
1. Generic typography (template sans pairing, uniform heavy headings).
2. Every page header built from the same template.
3. Research page dominated by empty controls and zero counts.
4. Tap targets below 44px on phones (hero map, graph zoom).

**Important**
5. Marketing copy instead of academic voice.
6. Icon-card grids and pill overuse.
7. Profiles read as user cards, not academic features.
8. Dark bands stacking at both ends of the page.

**Minor**
9. Vision/mission band showed light stripes at its edges.
10. Publication metadata split over too many lines.

## Report 2 — Implemented redesign

| Change | Why |
|---|---|
| **Typography:** Newsreader (variable serif with optical sizes) for display, Inter for interface and body; headings at regular/medium weight; `.dek` standfirst style | An editorial, journal-like voice; size and weight now carry hierarchy instead of boldness everywhere. |
| **`PageMasthead` component:** section name, serif headline, standfirst, optional row of facts computed from published records | One composition for all inner pages; pages now differ by content and real numbers, not decoration. |
| **Eyebrow rules removed** site-wide; kickers kept only where they label a section | Removes the most visible template tic. |
| **Hero:** grid texture removed; serif headline with italic gold line; figure captioned "Fig. 1"; data strip (researchers, publications, co-written papers, areas) | The opening reads as a research institution, and every number is real. |
| **Homepage headings:** "Research areas", "The researchers", "Who works with whom", "Work with RIGIS" | Plain academic voice. |
| **Researcher entries:** portrait, serif name, position, publication count; purple underline on hover; no overlay | Faculty-directory quality, information over effect. |
| **Closing scene:** numbered typographic index of four pathways, no icons | Distinctive, scannable, and still pre-selects the contact enquiry type. |
| **About:** long-form essay with drop cap; vision and mission as paired statements; objectives as a numbered two-column list; "next" links | Varied rhythm; removed the four-times-repeated row and the stripe bug. |
| **Profiles:** large portrait, serif name with title above, interests as an italic linked line, facts row (publications, RIGIS co-authors, projects), biography lede | Reads as an academic feature, not a user card. |
| **Research:** filters hidden when there are no projects; considered "no projects yet" note with routes to the network and people; area rows say "Not yet linked…" instead of zeros | Honest empty states without dead controls. |
| **People:** search and filters appear only from nine profiles | Avoids interface for interface's sake. |
| **Demo banner:** light lavender strip | Reduces stacked dark bands at the top. |
| **Mobile:** 44px+ hit areas on hero portraits, 40px graph zoom controls, 44px footer links, hero area labels hidden below 640px | Touch comfort and legibility. |

### Colour system
Unchanged tokens (navy, ivory, white, purple, soft purple, lavender, gold,
slate). Distribution adjusted: lighter top band; purple concentrated on
interaction, the About title accent and the closing scene; gold limited to the
hero headline, co-authored papers and the closing title.

### Verification
- TypeScript, ESLint and production static export: pass.
- No horizontal overflow on any page at 360–1024px.
- Contrast scan of 1,074 text elements across 8 pages at 1280px and 390px:
  all WCAG AA; lowest 4.01:1 on large numerals (threshold 3:1).
- Interactions re-tested at desktop and phone width: area tabs, researcher
  panel (side / bottom sheet), next researcher, interest → area, co-authorship
  map, graph selection, mobile network sheet, contact pre-selection.

### Remaining limitations
- No research projects yet: the strongest content type is still missing.
- About text, announcements and area descriptions are placeholders/provisional.
- No authentic research imagery (lab, events, outputs) is available; the site
  uses real portraits and data figures rather than stock or generated images.
- The logo mark was kept as requested; a bespoke wordmark would further
  strengthen identity.
