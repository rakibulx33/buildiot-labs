@AGENTS.md

# BuildIoT Labs website: working notes for Claude Code

Read `README.md` for what the site is and how it deploys, and `docs/DESIGN.md` for the design and motion system. This file holds the rules that keep changes consistent.

## Verify before every commit

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

`npm run build` must finish with every route listed as static. Check new pages at 390 px and 1280 px wide, with and without `prefers-reduced-motion`.

## Platform constraints

- Next.js 16, App Router, `output: "export"`, deployed to GitHub Pages. No server code: no route handlers that read the request, no server actions, no `cookies()` or `headers()`.
- `cacheComponents` stays off; it cannot be combined with a static export.
- The Turbopack file-system cache is off in `next.config.ts`. With it on, builds kept serving a stale `globals.css`.
- The site may be served under a base path (`/buildiot-labs`). `next/link` handles it. For files in `public/`, use `withBase()`; for absolute URLs (canonical, sitemap, Open Graph), use `absoluteUrl()`, both from `src/content/site.ts`.
- Dynamic routes need `generateStaticParams` and `export const dynamicParams = false`.

## Links and transitions

- Internal links use `TLink` (`src/components/site/TLink.tsx`); it plays the page sweep. External links and in-page anchors use a plain `<a>`.
- A link that opens an object (report, board, notebook page) passes `transitionTypes={["drill"]}`, and the object is wrapped in a `ViewTransition` with the same `name` on both pages (`report-<slug>`, `board-<slug>`, `note-<slug>`) plus `share="morph" default="none"`.
- Page-level enter and exit animations live in `src/app/template.tsx`, never in a layout.
- Keep to one orchestrated moment per page. Drawings animate only while their container has `data-active` (see `ActiveWhenVisible`). Don't add fade-ins to every section.
- Every new animation gets a reduced-motion rule in the block at the end of `globals.css`. Canvas code checks `matchMedia("(prefers-reduced-motion: reduce)")` itself.

## Styling

- Tailwind v4 utilities for layout; shared components as classes in `globals.css`. Tokens live in `@theme` at the top of that file. Don't add colours outside the palette in `docs/DESIGN.md`.
- Type uses the `t-*` classes. Archivo's width axis is the expressive one: wide for headings, normal for reading.
- Monospace (B612 Mono, one weight) is for codes, legends and readout labels only.

## Brand and scope rules (from the developer handoff, `docs/REQUIREMENTS.md`)

- Company name is "BuildIoT Lab" (singular). The domain is buildiotlabs.com (plural), the email contact@buildiotlabs.com. Never write "BuildIoT Labs" as the company name or "buildiotlab.com".
- Motto: "Engineering Ideas Into Reality." Supporting line: "From Circuit to Cloud — Hardware, Firmware & Software Engineering."
- No location-led or country-targeted marketing, no local retail or store promotion, no pricing in a local currency.
- Services are remote deliverables only: designs, source files, documentation, advisory. No installation, distribution or in-house PCB manufacture or assembly.
- Five service families: IoT Hardware R&D & Design, Custom PCB Design, Embedded Firmware, IoT Software & Cloud, Technical Consulting & Remote Engineering.
- Canonical URLs always use `canonicalUrl()` (production domain). Preview hosts are `noindex`.

## Content rules

- Every figure carries a `MethodTag`. A metric becomes `measured` only when its `method` fields (device, conditions, instrument, date) are filled in.
- Models are labelled as models. Nothing simulated is presented as live data.
- No unverifiable claims ("military-grade", "industrial-grade", unsourced percentages).
- This repository is public. Client reports stay high level: problem, approach, results. No client names without permission, no private repository details, no methods others could copy.
- Copy is plain and specific: sentence case, active voice, no filler. Buttons say what happens ("Start a project brief", "Copy parts list").
