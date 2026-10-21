import type { Metadata } from "next";
import { Logo } from "@/components/site/Logo";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "About BuildIoT Lab",
  description:
    "How BuildIoT Lab works: hardware, PCB, firmware and software engineering that is measured, documented and handed over so your team can maintain it.",
  path: "/about/",
});

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
      ["Projects", "New devices, design reviews, fixes, research prototypes"],
      ["Platforms", "ESP32 family, STM32, custom PCBs"],
      ["Data paths", "Wi-Fi, Bluetooth LE, MQTT over TLS, HTTP"],
      ["Delivery", "Remote: designs, source files, documentation and advice"],
    ],
  },
  {
    title: "Characteristics",
    rows: [
      ["Written scope before work starts", "Always"],
      ["Handover documentation with every delivery", "Always"],
      ["Method published with each measured number", "Always"],
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
        title="About BuildIoT Lab"
        lead="BuildIoT Lab is an IoT and embedded product engineering team. We design the electronics, develop the embedded systems, build the supporting applications and document the handover."
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

      <section aria-labelledby="team-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="team-title" className="t-h2 lg:col-span-4">
            Engineering team
          </h2>
          <div className="grid gap-5 text-[1.0625rem] leading-relaxed text-ink-2 lg:col-span-7 lg:col-start-6">
            <p>
              Four disciplines work together on every connected product: hardware and PCB design, embedded firmware,
              IoT software and cloud, and technical consulting.
            </p>
            <p className="rounded-[8px] border border-line bg-sheet p-4 text-[0.9375rem]">
              Team profiles are being prepared. We publish a name, role and project experience only with that
              person&rsquo;s consent, and only what can be verified. Until then, ask for the engineers who would work on
              your project in your first reply.
            </p>
            <p>
              <TLink href="/contact" className="link">
                Start a Project
              </TLink>
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
                <Logo height={26} />
                <h2 id="datasheet-title" className="text-[0.9375rem] font-semibold [font-stretch:110%]">
                  Engineering datasheet
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
