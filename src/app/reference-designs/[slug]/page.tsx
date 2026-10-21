import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyParts } from "@/components/designs/CopyParts";
import { DesignBoard } from "@/components/designs/DesignCard";
import { TLink } from "@/components/site/TLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { designs, getDesign } from "@/content/designs";
import { absoluteUrl, site } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return designs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reference-designs/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) return {};
  return {
    title: `${design.name}, reference design`,
    description: design.summary,
    alternates: { canonical: absoluteUrl(`/reference-designs/${design.slug}/`) },
  };
}

export default async function DesignPage({ params }: PageProps<"/reference-designs/[slug]">) {
  const { slug } = await params;
  const design = getDesign(slug);
  if (!design) notFound();

  const partsText = [
    `${design.code} ${design.name}, parts list`,
    ...design.parts.map((p) => `${p.qty} x ${p.name}${p.optional ? " (optional)" : ""}: ${p.url}`),
  ].join("\n");

  return (
    <article className="pb-24">
      <div className="wrap pt-10 sm:pt-14">
        <Breadcrumb items={[{ href: "/reference-designs", label: "Reference designs" }]} current={design.name} />
        <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-mono text-sm text-ink-3">{design.code}</p>
            <h1 className="t-h1 mt-2">{design.name}</h1>
            <p className="t-lead mt-5">{design.summary}</p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-[4px] bg-sheet px-3 py-2 text-sm shadow-[inset_0_0_0_1px_var(--color-line)]">
              <span className="h-2 w-2 rounded-full bg-mask" aria-hidden="true" />
              <span>
                <strong className="font-semibold">{design.status === "draft" ? "Draft." : "Validated."}</strong>{" "}
                {design.statusNote}
              </span>
            </p>
          </div>
          <div className="lg:col-span-7">
            <DesignBoard design={design} />
          </div>
        </div>
      </div>

      <div className="wrap mt-16 grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="min-w-0 space-y-16 lg:col-span-8">
          <section aria-labelledby="uses-title">
            <h2 id="uses-title" className="t-h3">
              Where it fits
            </h2>
            <ul className="tick-list mt-4">
              {design.useCases.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
            <p className="mt-5 text-[0.9375rem] text-ink-2">
              <span className="font-semibold text-ink">Power: </span>
              {design.power}
            </p>
          </section>

          <section aria-labelledby="parts-title">
            <h2 id="parts-title" className="t-h3">
              Parts list
            </h2>
            <div className="sheet mt-5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Part</th>
                      <th scope="col" className="text-right">
                        Qty
                      </th>
                      <th scope="col">Role</th>
                      <th scope="col">
                        <span className="sr-only">Store link</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {design.parts.map((p) => (
                      <tr key={p.name}>
                        <th scope="row">
                          {p.name}
                          {p.optional ? <span className="ml-2 text-xs font-normal text-ink-3">Optional</span> : null}
                        </th>
                        <td className="text-right font-mono tabular-nums">{p.qty}</td>
                        <td className="text-ink-2">{p.role}</td>
                        <td className="whitespace-nowrap text-right">
                          <a className="link text-sm" href={p.url} rel="noopener">
                            View in store<span className="sr-only">: {p.name}</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <CopyParts text={partsText} />
              <a className="link text-[0.9375rem] font-medium" href={site.store.quoteUrl} rel="noopener">
                Request a quote from {site.store.name}
              </a>
            </div>
          </section>

          <section aria-labelledby="wiring-title">
            <h2 id="wiring-title" className="t-h3">
              Wiring
            </h2>
            <div className="sheet mt-5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Signal</th>
                      <th scope="col">Connect to</th>
                      <th scope="col">Why</th>
                    </tr>
                  </thead>
                  <tbody>
                    {design.pins.map((p) => (
                      <tr key={p.signal}>
                        <th scope="row">{p.signal}</th>
                        <td className="font-mono text-[0.8125rem]">{p.connect}</td>
                        <td className="text-ink-2">{p.note ?? ""}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section aria-labelledby="fw-title">
            <h2 id="fw-title" className="t-h3">
              Firmware outline
            </h2>
            <p className="mt-3 text-ink-2">Written for ESP-IDF. The same steps work in Arduino with the matching calls.</p>
            <ol className="step-list mt-5">
              {design.firmware.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="notes-title">
            <h2 id="notes-title" className="t-h3">
              Design notes
            </h2>
            <dl className="mt-5 grid gap-6 sm:grid-cols-2">
              {design.notes.map((n) => (
                <div key={n.title} className="border-t border-line pt-4">
                  <dt className="font-semibold [font-stretch:106%]">{n.title}</dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{n.body}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section aria-labelledby="limits-title">
            <h2 id="limits-title" className="t-h3">
              Limits
            </h2>
            <ul className="mt-4 grid gap-3">
              {design.limits.map((l) => (
                <li key={l} className="limit">
                  {l}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="min-w-0 lg:col-span-3 lg:col-start-10">
          <div className="space-y-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <div className="board-note on-dark">
              <p className="text-sm font-semibold text-silk/75 [font-stretch:92%]">Parts for this build</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-silk">
                Every part above is stocked at {site.store.name}, with cash on delivery to all 64 districts.
              </p>
              <a className="btn btn-silk btn-sm mt-4" href={site.store.url} rel="noopener">
                Visit {site.store.name}
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold [font-stretch:106%]">Need it adapted?</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">
                We turn reference designs into products: battery operation, enclosures, a dashboard, a small batch.
              </p>
              <TLink href="/contact" className="link mt-3 inline-block text-[0.9375rem] font-medium">
                Start a project brief
              </TLink>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
