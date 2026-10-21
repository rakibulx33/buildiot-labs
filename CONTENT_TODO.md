# Content to confirm or supply

The site is built and every page works. These items need the owners' input before or soon after launch. Each one names the file to edit.

## Before launch

- [ ] **Enable GitHub Pages.** Settings → Pages → Source: GitHub Actions. Then re-run the latest workflow.
- [ ] **Email address.** The site uses `contact@buildiotlabs.com` everywhere, including the project brief. Confirm the mailbox exists and is watched. (`src/content/site.ts`)
- [ ] **Reply promise.** The contact page and the About datasheet say briefs get a reply "usually within one working day". Keep it only if it's true. (`src/app/contact/page.tsx`, `src/app/about/page.tsx`)
- [ ] **HydroAlert numbers.** The broker round trip (14 ms) and prediction accuracy (96.7 %) carry "Method note pending" tags. For each, add the device, conditions, instrument and date to `method` in `src/content/work.ts` and change `status` to `"measured"`, or remove the number.
- [ ] **HydroAlert wording.** Check that the public description is accurate and that the client is happy for it to be shown. (`src/content/work.ts`)

## Soon after launch

- [ ] **Custom domain.** Point `buildiotlabs.com` at GitHub Pages (steps in `README.md`) and retire the old single-page site.
- [ ] **Validate the reference designs.** All three are marked "Draft". Build each on the bench, measure it, then set `status: "validated"` with a short method note in `statusNote`. (`src/content/designs.ts`)
- [ ] **A second report.** The Work page holds one report. Add another client project when one can be shown. (`src/content/work.ts`)
- [ ] **About: people.** The About page describes the lab, not the team. Add names and roles once decided. (`src/app/about/page.tsx`)
- [ ] **Pricing.** No figures are published. Pricing stays proposal-based; do not publish universal prices or timelines. (`src/content/engagements.ts`)
- [ ] **Brief delivery.** Optionally add a `FORM_ENDPOINT` repository variable so briefs arrive without the visitor's email app (see `README.md`).
- [ ] **Bench photos.** Real photos of the bench and boards would strengthen About and the reports. Put them in `public/` and reference them with `withBase()`.

## Later

- [ ] **Bangla version.** The plan includes a Bangla mirror. Content is kept in `src/content/` so it can be translated file by file; a `/bn` route tree would reuse the same components.
- [ ] **Store links back.** On BuildIoT BD product pages, link to the reference designs that use each part.
- [ ] **More lab notes.** Ideas: OTA updates with rollback on ESP-IDF, LoRa range testing, sizing a solar panel for a sensor node.

## From the developer handoff (v1.1, 22 October 2026)

- [ ] **Trademark and use check** for the motto "Engineering Ideas Into Reality." and the line "From Circuit to Cloud: Hardware, Firmware & Software Engineering." before permanent adoption.
- [ ] **Team profiles.** Names, roles and experience, only with each person's consent. The About page and home section currently list disciplines only.
- [ ] **Real PCB renders, schematic excerpts and dashboard screenshots**, authorised and redacted, to replace the two labelled illustrations on the home page.
- [ ] **HydroAlert figures (14 ms, 96.7%).** Shown as "Unverified". Publish device revision, setup, conditions, sample count, method and date, or remove them. Also confirm it may be labelled client work, and whether the client has approved publication.
- [ ] **Brief form delivery.** GitHub Pages has no server, so the form opens the visitor's email app unless a form service is set (`FORM_ENDPOINT`). The handoff calls for server-side validation, spam protection, rate limiting and a confirmation email: choose a form service that provides them, send a test inquiry to contact@buildiotlabs.com, and check the inbox is monitored. Uploads are intentionally not offered.
- [ ] **Privacy and Terms** are plain first drafts. Founders and a lawyer should review them, and add a cookie notice if analytics are ever added.
- [ ] **Analytics** (CTA clicks, qualified submissions, errors) are not installed; add them without recording brief content if wanted.
- [ ] **Production cut-over.** The live buildiotlabs.com is a different implementation. Plan redirects from old routes (301) before pointing the domain here, and keep useful existing pages.
- [ ] **Run Lighthouse and Core Web Vitals** on the deployed site and record the results; no scores are claimed on the site.
- [ ] **Founders approve** final content, IP and confidentiality wording, and the release.
