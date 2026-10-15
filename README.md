# RIGIS — Research Initiative Group Intelligent System

Public research-group website and (from Phase 2) a self-service member portal.
Built with Next.js (static export), TypeScript, Tailwind CSS v4, shadcn/ui,
Lucide, Motion and React Flow, hosted on Cloudflare Pages, with Supabase for
auth, database and storage.

> **Status: Phase 1 complete (foundation, design system, public pages).**
> The site currently runs on **clearly labelled demonstration content**
> (`src/lib/data/demo.ts`). None of the people, projects or publications are
> real. Portal routes show a "not available yet" notice until Supabase is
> connected in Phase 2.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional in Phase 1
npm run dev                   # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Static export to `out/` (+ post-build fix, see below) |
| `npm start` | Serve `out/` locally |
| `npm run typecheck` / `npm run lint` | TypeScript and ESLint |
| `npm run check` | Typecheck + lint + build |

## Architecture

### Why static export

Cloudflare Pages serves static files at near-zero cost, so `next.config.ts`
sets `output: "export"`. Consequences that shape the code:

- **No server code.** No server actions, API routes, middleware, cookies or
  SSR. All data access and auth happen in the browser through the Supabase JS
  client, and **Row Level Security is the security boundary** — the UI is never
  trusted to enforce permissions.
- **Dynamic routes** (`/people/[slug]`, `/research/[slug]`) must list their
  slugs in `generateStaticParams()` at build time. Phase 2 adds a client-side
  fallback (Cloudflare `_redirects` rewrite + slug read from the URL) so
  profiles and projects approved after the last build still resolve, plus an
  optional Cloudflare deploy hook to rebuild for SEO.
- **Images** are unoptimised by Next; uploads are resized and converted to
  WebP in the browser before going to Supabase Storage.
- Security headers live in `public/_headers` (Cloudflare format).

### Data layer

Pages read public content only through `src/lib/data` (`getPublicDataset`,
`getProfileSlugs`, `getProjectSlugs`). In Phase 1 these return the demo
dataset; in Phase 2 they query approved rows from Supabase. Types in
`src/types/domain.ts` mirror the planned schema.

### Structure

```
src/
  app/
    (site)/            public pages: home, about, people, research, network, contact
    portal/            member portal (Phase 2+)
    sitemap.ts robots.ts not-found.tsx icon.svg
  components/
    layout/            header, footer, logo, demo banner
    people/ research/ network/ forms/ portal/
    ui/                shadcn/ui primitives + section heading, search, empty state
  config/site.ts       name, nav, labels
  hooks/               URL query-state, touch detection
  lib/
    data/              data access + demo content + selectors
    network/graph.ts   builds the collaboration graph from approved records only
    validation/        zod schemas
  types/domain.ts
public/branding        favicon, Open Graph image
scripts/               build helpers
```

### Interactive experience

The homepage tells the RIGIS story in six scenes (`src/components/homepage`):
**Enter** (`story-hero`, `hero-constellation`) → **Understand** (`identity-scene`)
→ **Research** (`research/area-explorer`) → **People**
(`people/researcher-explorer`, `researcher-panel`) → **Network**
(`collaboration-map`) → **Collaborate** (`collaborate-scene`), with a chapter
rail on desktop and a "Chapters" bottom sheet on mobile (`scene-nav`).

The `/network` page (`network/network-experience`) offers a React Flow graph
(lazy-loaded, desktop default) and a searchable list (mobile default). Both
use the same inspector (`node-inspector`), where every connection is a step
to the next item. On desktop the inspector sits beside the content; on
mobile it opens as a bottom sheet.

Components talk to each other through small window events (`src/lib/events.ts`):
for example, choosing a research interest in a researcher panel selects that
area in the research explorer.

**Data integrity.** Relationships are computed in
`src/lib/data/relationships.ts` and `src/lib/network/graph.ts`, and every
link carries its basis:

| Link | Basis | Shown as |
| --- | --- | --- |
| Researcher – publication | author lists | Verified |
| Researcher – project, project – area | approved project records | Verified |
| Researcher – research area | the researcher's own listed interests, matched via `interestKeywords` in `src/lib/data/areas.ts` | Declared ("stated interest"), dashed |

Nothing is inferred beyond these rules. Content status is explicit:
`verified`, `provisional` (supplied by RIGIS, awaiting confirmation; e.g.
research-area descriptions) and `demo` (placeholders, e.g. About text and
announcements).

### Design system

Tokens live in `src/app/globals.css`; `src/config/palette.ts` mirrors them for
SVG attributes and graph styles. The palette is UiTM-inspired but RIGIS-owned
(no UiTM marks or implied endorsement):

| Token | Hex | Role |
| --- | --- | --- |
| Midnight Navy `--navy-900` | #17243B | Dark environments: hero, network, footer |
| Warm Ivory `--ivory` / `--background` | #F4F0E8 | Editorial page background |
| White `--card` | #FFFFFF | Content surfaces |
| Academic Purple `--purple-700` / `--primary` | #4B216D | Buttons, links, active navigation, selected states, closing section |
| Soft Purple `--purple-400` | #8B76A5 | Section rules, borders, network lines |
| Lavender `--purple-200` | #CFC3DF | Text and selected connections on navy/purple |
| Muted Gold `--brass` | #B89B68 | Sparing highlights (hero headline, co-authored papers) |
| Slate `--slate` | #AAB6C2 | Borders; secondary text on navy only |

Research areas each carry an `accent` (markers and graph nodes only).
Contrast: every text/background pairing meets WCAG AA (automated scan of
1,019 text elements across all pages at 1280px and 390px; lowest 4.56:1).
Soft purple, slate and gold are never used for body text on light surfaces.
Display type is Newsreader (variable serif with optical sizes); interface and body text use Inter. Page headers use the shared `PageMasthead` component. See `docs/design-audit.md` for the design rationale. Statuses always pair an icon and label with
colour, and all motion respects `prefers-reduced-motion`.

### Windows build note

Next.js 16.4 writes segment-prefetch files into nested folders on Windows
(it splits paths on `/` only), which makes client prefetches 404 locally.
`scripts/fix-export-segments.mjs` runs after `next build` and flattens them.
On Linux (Cloudflare's build image) it does nothing.

## Deploying to Cloudflare Pages

1. Cloudflare dashboard → Workers & Pages → Create → Pages → connect this
   GitHub repository.
2. Build command: `npm run build` · Build output directory: `out` ·
   Environment variable `NODE_VERSION=22` (or newer).
3. Add the variables from `.env.example`.

## Development phases

1. **Foundation & public site** — done.
2. Supabase schema, RLS, storage buckets, registration with admin approval.
3. Management portal: dashboards, profile/project editors, uploads, review workflow, audit log.
4. Research network on live data (UI already built in Phase 1).
5. Testing (incl. direct RLS tests), deployment, backup documentation.
