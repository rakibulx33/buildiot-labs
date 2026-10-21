# Content to confirm or supply

The site is built and every page works. These items need the owners' input before or soon after launch. Each one names the file to edit.

## Before launch

- [ ] **Enable GitHub Pages.** Settings → Pages → Source: GitHub Actions. Then re-run the latest workflow.
- [ ] **Email address.** The site uses `hello@buildiotlabs.com` everywhere, including the project brief. Confirm the mailbox exists and is watched. (`src/content/site.ts`)
- [ ] **Reply promise.** The contact page and the About datasheet say briefs get a reply "usually within one working day". Keep it only if it's true. (`src/app/contact/page.tsx`, `src/app/about/page.tsx`)
- [ ] **HydroAlert numbers.** The broker round trip (14 ms) and prediction accuracy (96.7 %) carry "Method note pending" tags. For each, add the device, conditions, instrument and date to `method` in `src/content/work.ts` and change `status` to `"measured"`, or remove the number.
- [ ] **HydroAlert wording.** Check that the public description is accurate and that the client is happy for it to be shown. (`src/content/work.ts`)

## Soon after launch

- [ ] **Custom domain.** Point `buildiotlabs.com` at GitHub Pages (steps in `README.md`) and retire the old single-page site.
- [ ] **Validate the reference designs.** All three are marked "Draft". Build each on the bench, measure it, then set `status: "validated"` with a short method note in `statusNote`. (`src/content/designs.ts`)
- [ ] **A second report.** The Work page holds one report. Add another client project when one can be shown. (`src/content/work.ts`)
- [ ] **About: people.** The About page describes the lab, not the team. Add names and roles once decided. (`src/app/about/page.tsx`)
- [ ] **Pricing.** No figures are published. Decide whether to show starting prices in taka. (`src/content/engagements.ts`)
- [ ] **Brief delivery.** Optionally add a `FORM_ENDPOINT` repository variable so briefs arrive without the visitor's email app (see `README.md`).
- [ ] **Bench photos.** Real photos of the bench and boards would strengthen About and the reports. Put them in `public/` and reference them with `withBase()`.

## Later

- [ ] **Bangla version.** The plan includes a Bangla mirror. Content is kept in `src/content/` so it can be translated file by file; a `/bn` route tree would reuse the same components.
- [ ] **Store links back.** On BuildIoT BD product pages, link to the reference designs that use each part.
- [ ] **More lab notes.** Ideas: OTA updates with rollback on ESP-IDF, LoRa range in Dhaka, sizing a solar panel for a sensor node.
