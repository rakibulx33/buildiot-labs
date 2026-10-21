# BuildIoT Lab website

The website of BuildIoT Lab (singular "Lab"), an IoT and embedded product engineering team. Production domain: https://buildiotlabs.com (plural "labs"). Motto: Engineering Ideas Into Reality.

The site is a lab bench. Pages are sheets of paper, reference designs are boards, tools are instruments, and every number carries a tag saying how it was obtained. The brand rules in `docs/REQUIREMENTS.md` (developer handoff v1.1) apply: name "BuildIoT Lab", email contact@buildiotlabs.com, remote-delivery services only, no location or retail marketing. Moving between sections sweeps the page across a soldermask stage; opening an object (a report, a board, a notebook page) morphs it into its own page.

## Run it

Requires Node 22.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm test           # unit tests for the instrument math
npm run lint
npm run typecheck
```

## Deploy (GitHub Pages)

Every push to `main` runs `.github/workflows/deploy.yml`: lint, type-check and test, then build and deploy to GitHub Pages.

**One-time setup:** in the repository, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. Until then the deploy step fails with "Get Pages site failed"; the checks still run.

The site is then served at `https://rakibulx33.github.io/buildiot-labs/`. That address is a **preview**: it is set to `noindex` and its canonical links point to https://buildiotlabs.com. Only the production domain is indexed. The workflow reads the base path from the Pages settings, so nothing in the code changes when you move to a custom domain.

**Custom domain (buildiotlabs.com):**

1. In **Settings → Pages → Custom domain**, enter `buildiotlabs.com` and save.
2. At your DNS provider, point the apex domain at GitHub Pages with four `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. Add a `CNAME` record for `www` pointing to `rakibulx33.github.io`.
3. When the certificate is ready, tick **Enforce HTTPS**.
4. Re-run the workflow (Actions → Check and deploy → Run workflow) so the site is rebuilt without the `/buildiot-labs` prefix.

See GitHub's guide to [managing a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Project brief delivery

GitHub Pages has no server, so by default the project brief opens the visitor's email app with the brief filled in and addressed to `contact@buildiotlabs.com`.

To receive briefs without the email step, create a form at a form service that accepts JSON `POST` requests, then add its endpoint URL as a repository variable named `FORM_ENDPOINT` (**Settings → Secrets and variables → Actions → Variables**). The next deploy sends briefs there.

## Where things live

| What | Where |
| --- | --- |
| Site name, email, motto | `src/content/site.ts` |
| FAQ | `src/content/faq.ts` |
| Logo | `public/logo.png` (`src/components/site/Logo.tsx`) |
| Services, process, engagements | `src/content/services.ts`, `process.ts`, `engagements.ts` |
| Test reports (Work) | `src/content/work.ts` |
| Reference designs and parts lists | `src/content/designs.ts` |
| Lab notes | `src/content/lab-notes/*.mdx` |
| Tool math, with tests | `src/lib/model/wake.ts`, `src/lib/calc/*.ts` |
| Design tokens, components, motion | `src/app/globals.css` |
| Bench objects (sheet, board, instrument) | `src/components/objects/` |

### Add a lab note

Create `src/content/lab-notes/your-slug.mdx` starting with:

```js
export const meta = {
  entry: 5,                 // next number in the notebook
  date: "2026-11-01",
  title: "A plain, specific title",
  summary: "One or two sentences that say what the reader will learn.",
  topics: ["Power", "ESP32"],
};
```

Then write Markdown. Internal links (`/tools/...`) get the page sweep automatically. The note appears on the index, the home page and in the sitemap.

### Add a report or a reference design

Add an entry to `src/content/work.ts` or `src/content/designs.ts`. Pages, links and the sitemap follow.

## The number rule

Every figure on the site carries one of three tags (see `/methods`):

- **Measured**: the method is published next to it: device, conditions, instrument, date.
- **Model**: calculated from datasheets and stated assumptions.
- **Method note pending**: recorded, not yet written up.

A metric only becomes `measured` once its `method` fields are filled in. `CONTENT_TODO.md` lists what is still pending.

## Credits

Typefaces: [Archivo](https://github.com/Omnibus-Type/Archivo) and [B612 Mono](https://github.com/polarsys/b612), both under the SIL Open Font License (`src/app/fonts/OFL.txt`).
