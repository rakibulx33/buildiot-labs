import type { Metadata } from "next";
import { Engagements } from "@/components/home/Engagements";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Engagement Models: Review, Sprint, Retainer",
  description:
    "Three ways to work with BuildIoT Lab: a review, a scoped build sprint or a retainer. Every engagement is a written proposal after we read your brief.",
  path: "/pricing/",
});

const DRIVERS = [
  { t: "How much is unknown", d: "A device that has never been built carries more risk than a fix to one that works. We price that honestly, or suggest a short review first to shrink it." },
  { t: "How it's powered", d: "A mains device is simpler than one that must last a year on a cell. Battery targets add measurement and design time." },
  { t: "How many boards, how many features", d: "A single-sided prototype differs from a multilayer board with several firmware and cloud components. More parts add design, review and documentation effort." },
  { t: "What already exists", d: "Working firmware, a schematic or a server you already run all lower the cost. Tell us what you have." },
];

export default function PricingPage() {
  return (
    <>
      <PageHead
        title="Engagement models"
        lead="Three shapes of engagement. We quote after reading your brief, as a written proposal with scope, milestones and acceptance criteria. We publish no universal prices or timelines because they depend on the work."
      />
      <section aria-label="Engagement models" className="pb-20">
        <div className="wrap">
          <Engagements headingLevel={2} />
        </div>
      </section>

      <section aria-labelledby="drivers-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="drivers-title" className="t-h2 lg:col-span-4">
            What moves the price
          </h2>
          <dl className="grid gap-8 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {DRIVERS.map((x) => (
              <div key={x.t}>
                <dt className="t-h4">{x.t}</dt>
                <dd className="mt-2 text-[0.9375rem] leading-relaxed text-ink-2">{x.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="quote-title" className="pb-24">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="quote-title" className="t-h2 lg:col-span-4">
            How a quote arrives
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <ol className="step-list text-[1.0625rem] text-ink-2">
              <li>You send a brief. Rough answers are fine.</li>
              <li>We reply with questions, then a written scope with the price, milestones and test criteria.</li>
              <li>Payment terms for sprints and retainers are written into the scope before work begins.</li>
            </ol>
            <TLink href="/contact" className="btn btn-primary mt-8">
              <span className="btn-pad" aria-hidden="true" />
              Start a Project
            </TLink>
          </div>
        </div>
      </section>
    </>
  );
}
