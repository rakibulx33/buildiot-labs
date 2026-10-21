# BuildIoT Lab website

The website of BuildIoT Lab, an IoT and embedded product engineering team. Production domain: https://buildiotlabs.com.

> **Engineering Ideas Into Reality.**
> From Circuit to Cloud — Hardware, Firmware & Software Engineering.

## What BuildIoT Lab does

Five service families, all delivered remotely as designs, source files, documentation and advice:

1. **IoT Hardware R&D & Design**: architecture, circuits, sensor interfaces, power budgets, design review.
2. **Custom PCB Design**: schematic capture, layout, stack-up, DFM review, Gerber and BOM output. Digital files only; no manufacturing or assembly service.
3. **Embedded Firmware**: ESP32 and STM32, C/C++, drivers, BLE, Wi-Fi, MQTT, LoRa, OTA updates.
4. **IoT Software & Cloud**: dashboards, mobile apps, APIs, MQTT and cloud, telemetry, device management.
5. **Technical Consulting & Remote Engineering**: feasibility, architecture, debugging, prototype guidance, remote team support.

Engagement models: **Review**, **Build sprint**, **Retainer**. Every engagement is a written proposal after a short technical brief.

## About the site

The site is a lab bench seen from above. Pages are sheets of paper, reference designs are boards, tools are instruments, and every number carries a tag saying how it was obtained (measured, model, or unverified). Moving between sections sweeps the page across a soldermask stage; opening an object (a report, a board, a notebook page) morphs it into its own page. Design and motion rules: [`docs/DESIGN.md`](docs/DESIGN.md).

| Section | Route |
| --- | --- |
| Home | `/` |
| Services (five families) | `/services/` |
| Work and case studies | `/work/` |
| Reference designs | `/reference-designs/` |
| Lab notes | `/lab-notes/` |
| Tools (battery life, voltage divider, MQTT data) | `/tools/` |
| Process | `/process/` |
| Engagement models | `/pricing/` |
| About | `/about/` |
| How we measure | `/methods/` |
| FAQ | `/faq/` |
| Contact (project brief) | `/contact/` |
| Privacy, Terms | `/privacy/`, `/terms/` |

Stack: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS v4, MDX for lab notes, Vitest. Fonts: Archivo and B612 Mono (SIL Open Font License, `src/app/fonts/OFL.txt`).

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

**One-time setup:** repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.

### Custom domain: buildiotlabs.com

1. **Verify the domain** (stops another GitHub account from claiming it): profile photo → **Settings → Pages → Add a domain** → `buildiotlabs.com`. Add the TXT record GitHub shows (name `_github-pages-challenge-<your-username>`) in the DNS provider, then press **Verify**.
2. **DNS records** at the domain provider (Hostinger: Domains → DNS Zone):

   | Type | Name | Value |
   | --- | --- | --- |
   | A | `@` | `185.199.108.153` |
   | A | `@` | `185.199.109.153` |
   | A | `@` | `185.199.110.153` |
   | A | `@` | `185.199.111.153` |
   | CNAME | `www` | `rakibulx33.github.io` |

   Remove any older A, AAAA or `www` CNAME records for the same names. **Keep the MX records**; they carry the email for contact@buildiotlabs.com.
3. Repository **Settings → Pages → Custom domain**: `buildiotlabs.com`, then **Save**. Wait for "DNS check successful" and tick **Enforce HTTPS**.
4. Re-run the workflow (**Actions → Check and deploy → Run workflow**) so the site is built without the `/buildiot-labs` prefix.

Until the custom domain is live, `https://rakibulx33.github.io/buildiot-labs/` is a **preview**: it is served with `noindex`, and its canonical links already point to `https://buildiotlabs.com`.

## SEO

What the code does for search engines (all verified in the built HTML):

- One unique `<title>` and meta description per page (titles about 60 characters or fewer, descriptions 100 to 165), set through `pageMeta()` in `src/lib/seo.ts`. Every page uses it, so do the same for new pages.
- Canonical URL on `https://buildiotlabs.com` for every page, with a trailing slash, matching `og:url`. Preview hosts are `noindex` and `robots.txt` disallows them.
- Open Graph and Twitter cards on every page, with a 1200 × 630 image (`public/og.png`).
- Structured data (JSON-LD): `Organization` + `ProfessionalService` and `WebSite` on every page; `BreadcrumbList` on detail pages; `ItemList` of `Service` on Services; `FAQPage` on FAQ; `TechArticle` on lab notes.
- `sitemap.xml` (with `lastmod`; update `CONTENT_UPDATED` in `src/app/sitemap.ts` when content changes), `robots.txt`, web manifest, and favicon files.
- One `<h1>` per page, a logical heading order, descriptive link text, alt text on images, and visible focus. Static HTML, a fast first load, and self-hosted fonts.

**After the domain is live, do this once:**

1. Add `https://buildiotlabs.com` as a property in [Google Search Console](https://search.google.com/search-console) and in Bing Webmaster Tools. For the HTML-tag method, add the token as a repository variable (**Settings → Secrets and variables → Actions → Variables**): `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` or `NEXT_PUBLIC_BING_SITE_VERIFICATION`, then redeploy. (DNS TXT verification works too and needs no code.)
2. Submit `https://buildiotlabs.com/sitemap.xml` and request indexing for the home page.
3. Test the home, services and a lab note in Google's Rich Results Test.
4. Run Lighthouse and record the real results; the site claims no scores.
5. Plan 301 redirects for the old site's URLs before switching the domain. GitHub Pages cannot do server redirects, so the old routes need a small redirect page for each (or keep the same paths).

What no code can do: rankings come from useful content and links. Publish lab notes regularly, add real case studies and approved project images, and earn links from relevant sites (supplier, community and university pages). Do not buy links.

## Project brief delivery

GitHub Pages has no server, so by default the project brief opens the visitor's email app with the brief filled in, addressed to `contact@buildiotlabs.com`. Nothing is sent until the visitor presses send, and the site says so.

To receive briefs without the email step, create a form at a service that accepts JSON `POST` requests and provides server-side validation, spam protection and rate limiting, then add its endpoint as a repository variable named `FORM_ENDPOINT`. The next deploy sends briefs there. Send a test brief and check the inbox before relying on it.

## Where things live

| What | Where |
| --- | --- |
| Name, email, motto, canonical domain | `src/content/site.ts` |
| SEO helpers (titles, cards, JSON-LD) | `src/lib/seo.ts` |
| Services, process, engagements, FAQ | `src/content/services.ts`, `process.ts`, `engagements.ts`, `faq.ts` |
| Test reports (Work) | `src/content/work.ts` |
| Reference designs and parts lists | `src/content/designs.ts` |
| Lab notes | `src/content/lab-notes/*.mdx` |
| Tool math, with tests | `src/lib/model/wake.ts`, `src/lib/calc/*.ts` |
| Logo and favicon | `public/logo.png`, `src/app/icon.png`, `src/app/apple-icon.png` |
| Design tokens, components, motion | `src/app/globals.css` |

### Add a lab note

Create `src/content/lab-notes/your-slug.mdx` starting with:

```js
export const meta = {
  seoTitle: "Short title for search results",   // optional, about 45 characters
  entry: 5,                 // next number in the notebook
  date: "2026-11-01",
  title: "A plain, specific title",
  summary: "One or two sentences (about 120 to 160 characters); also the meta description.",
  topics: ["Power", "ESP32"],
};
```

Then write Markdown. The note appears on the index, the home page and in the sitemap.

### Add a report or a reference design

Add an entry to `src/content/work.ts` or `src/content/designs.ts`. Pages, links and the sitemap follow.

## The number rule

Every figure on the site carries one of three tags (see `/methods/`):

- **Measured**: the method is published next to it: device, conditions, instrument, date.
- **Model**: calculated from datasheets and stated assumptions.
- **Unverified**: recorded, but the method is not yet published. Do not rely on it.

A metric becomes `measured` only once its `method` fields are filled in. [`CONTENT_TODO.md`](CONTENT_TODO.md) lists what is still pending.

## Credits

Typefaces: [Archivo](https://github.com/Omnibus-Type/Archivo) and [B612 Mono](https://github.com/polarsys/b612), both under the SIL Open Font License.
