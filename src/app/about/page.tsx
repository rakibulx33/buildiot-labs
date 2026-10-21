import type { Metadata } from "next";
import { LogoMark } from "@/components/site/Logo";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { absoluteUrl, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About the lab",
  description: "BuildIoT Labs is the engineering side of BuildIoT BD in Dhaka: firmware, low-power hardware and telemetry, measured and written down.",
  alternates: { canonical: absoluteUrl("/about/") },
};

const PRINCIPLES = [
  { t: "Measure before we claim", d: "A number on this site either has its method published, is labelled as a model, or says its method note is pending." },
  { t: "Design for the bad day", d: "Brownouts, dropped links, failed updates and whole neighbourhoods rebooting at once are normal conditions, not edge cases." },
  { t: "Leave you able to carry on", d: "Source, build steps, wiring and test reports go to you, so your team can maintain the device without us." },
  { t: "Say no early", d: "If a project isn't a fit, or a cheaper path exists, we say so in the first reply rather than after the invoice." },
];

type Row = [string, string, string?];
const DATASHEET: Array<{ title: string; rows: Row[]; note?: string }> = [
  {
    title: "Recommended operating conditions",
    rows: [
      ["Projects", "New devices, fixes, reviews, research prototypes"],
      ["Platforms", "ESP32 family, STM32"],
      ["Data paths", "Wi-Fi, Bluetooth LE, MQTT over TLS, HTTP"],
      ["Location", "Dhaka in person, anywhere remotely"],
    ],
  },
  {
    title: "Characteristics",
    rows: [
      ["Reply to a brief", "Usually within one working day"],
      ["Written scope before work starts", "Always"],
      ["Method published with each measured number", "Always"],
      ["Source and build steps handed over", "Always"],
    ],
  },
  {
    title: "Absolute maximum ratings",
    rows: [
      ["Unmeasured numbers presented as measured", "0"],
      ["Simulations presented as live data", "0"],
      ["Handovers without documentation", "0"],
    ],
    note: "Exceeding these ratings voids our credibility.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHead
        title="About the lab"
        lead={`BuildIoT Labs is the engineering side of ${site.store.name}, an electronics parts store in Dhaka. The store sells the parts; the lab designs, builds and measures the devices made from them.`}
      />

      <section aria-labelledby="why-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="why-title" className="t-h2 lg:col-span-4">
            Why a lab
          </h2>
          <div className="grid gap-5 text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-7 lg:col-start-6">
            <p>
              Most IoT projects fail quietly. A battery lasts a month instead of a year. Data stops when the Wi-Fi drops
              and nobody notices for a week. A device needs a site visit after every power cut.
            </p>
            <p>
              We set the lab up to work the other way round: measure first, design for the bad day, and write down how
              we know. That&rsquo;s why our home page opens on a scope trace instead of a stock photo.
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="store-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="store-title" className="t-h2 lg:col-span-4">
            Next to a parts store
          </h2>
          <div className="grid gap-5 text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-7 lg:col-start-6">
            <p>
              Working beside {site.store.name} means we design with parts that are actually in stock in Bangladesh, and
              that you can order again next month. Every{" "}
              <TLink href="/reference-designs" className="link">
                reference design
              </TLink>{" "}
              links each of its parts to the store.
            </p>
            <p>
              <a className="link" href={site.store.url} rel="noopener">
                Visit {site.store.name}
              </a>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles-title" className="pb-20">
        <div className="wrap border-t border-line pt-16">
          <h2 id="principles-title" className="t-h2">
            How we work
          </h2>
          <dl className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {PRINCIPLES.map((p) => (
              <div key={p.t}>
                <dt className="t-h4">{p.t}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{p.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="datasheet-title" className="pb-24">
        <div className="wrap">
          <div className="sheet mx-auto max-w-[56rem] overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-double border-line px-5 py-4 sm:px-8">
              <div className="flex items-center gap-2.5">
                <LogoMark size={24} />
                <h2 id="datasheet-title" className="text-[0.9375rem] font-semibold [font-stretch:110%]">
                  BuildIoT Labs, studio datasheet
                </h2>
              </div>
              <p className="font-mono text-[0.8125rem] text-ink-3">Rev 2.0</p>
            </div>
            <div className="grid gap-8 px-5 py-8 sm:px-8">
              {DATASHEET.map((block) => (
                <div key={block.title}>
                  <h3 className="text-sm font-semibold text-mask [font-stretch:106%]">{block.title}</h3>
                  <table className="mt-3 w-full border-collapse text-[0.9375rem]">
                    <tbody>
                      {block.rows.map(([k, v]) => (
                        <tr key={k} className="border-b border-line-soft last:border-b-0">
                          <th scope="row" className="py-2.5 pr-4 text-left font-normal text-ink-2">
                            {k}
                          </th>
                          <td className="py-2.5 text-right font-medium tabular-nums">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {block.note ? <p className="mt-2 text-xs text-ink-3">{block.note}</p> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
