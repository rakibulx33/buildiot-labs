import type { Metadata } from "next";
import {
  FirmwarePlate,
  PowerPlate,
  PrototypePlate,
  TelemetryPlate,
} from "@/components/diagrams/CapabilityDiagrams";
import { TLink } from "@/components/site/TLink";
import { ActiveWhenVisible } from "@/components/ui/ActiveWhenVisible";
import { PageHead } from "@/components/ui/PageHead";
import { services, type ServiceSlug } from "@/content/services";
import { absoluteUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Firmware, low-power design, telemetry pipelines and prototypes for connected devices, or all of them as one end-to-end build.",
  alternates: { canonical: absoluteUrl("/services/") },
};

const PLATES: Partial<Record<ServiceSlug, { Plate: (p: { className?: string }) => React.ReactNode; caption: string }>> = {
  firmware: { Plate: FirmwarePlate, caption: "Tasks on a FreeRTOS timeline, with the watchdog fed at every checkpoint." },
  power: { Plate: PowerPlate, caption: "A duty-cycled node: short, expensive wakes and long, cheap sleeps." },
  telemetry: { Plate: TelemetryPlate, caption: "Store and forward: readings queue on the node while the link is down." },
  prototypes: { Plate: PrototypePlate, caption: "An exploded prototype. Every layer is a stocked, documented part." },
};

export default function ServicesPage() {
  return (
    <>
      <PageHead
        title="Services"
        lead="Four kinds of work, usually combined in one project: firmware, power, telemetry and prototypes. Or all of them under one plan, as an end-to-end build."
      >
        <nav aria-label="On this page" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {services.map((s) => (
              <li key={s.slug}>
                <a href={`#${s.slug}`} className="chip">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHead>

      {services.map((s, i) => {
        const plate = PLATES[s.slug];
        return (
          <section key={s.slug} id={s.slug} aria-labelledby={`${s.slug}-title`} className="scroll-mt-24">
            <div className="wrap">
              <div className="grid gap-10 border-t border-line py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
                <div className="lg:col-span-5">
                  <h2 id={`${s.slug}-title`} className="t-h2">
                    {s.name}
                  </h2>
                  <p className="t-h3 mt-3 text-ink-2">{s.outcome}</p>
                  <p className="mt-5 max-w-[34rem] text-[1.0625rem] leading-relaxed">{s.summary}</p>
                  {plate ? (
                    <ActiveWhenVisible as="figure" className="sheet mt-10 p-4 sm:p-6">
                      <plate.Plate />
                      <figcaption className="mt-3 text-sm text-ink-2">
                        <span className="font-semibold text-ink [font-stretch:106%]">Fig. {i + 1}.</span>{" "}
                        {plate.caption}
                      </figcaption>
                    </ActiveWhenVisible>
                  ) : null}
                </div>
                <div className="grid content-start gap-10 lg:col-span-6 lg:col-start-7">
                  <div>
                    <h3 className="t-h4">What we do</h3>
                    <ul className="tick-list mt-4">
                      {s.includes.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="t-h4">What you get</h3>
                    <ul className="tick-list mt-4">
                      {s.deliverables.map((x) => (
                        <li key={x}>{x}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="t-h4">Tools and platforms</h3>
                    <p className="mt-3 text-ink-2">{s.stack.join(", ")}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section aria-labelledby="next-title" className="pb-24 pt-8">
        <div className="wrap">
          <div className="grid gap-6 border-t border-line pt-16 md:grid-cols-12">
            <h2 id="next-title" className="t-h3 md:col-span-5">
              Not sure which you need?
            </h2>
            <div className="md:col-span-6 md:col-start-7">
              <p className="text-[1.0625rem] leading-relaxed text-ink-2">
                Describe the device and the problem. We&rsquo;ll tell you which of these applies, or that a{" "}
                <TLink href="/pricing" className="link">
                  review
                </TLink>{" "}
                is the cheaper first step.
              </p>
              <TLink href="/contact" className="btn btn-primary mt-6">
                <span className="btn-pad" aria-hidden="true" />
                Start a project brief
              </TLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
