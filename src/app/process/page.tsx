import type { Metadata } from "next";
import { ProcessTrace } from "@/components/home/ProcessTrace";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { absoluteUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "How a project runs",
  description: "Brief, scope, build, test, hand over: how a BuildIoT Labs project runs and what you receive at each step.",
  alternates: { canonical: absoluteUrl("/process/") },
};

const SCOPE = [
  "What we will build, and what we won't",
  "The test criteria the work must pass",
  "Milestones, dates and the price",
  "What we need from you, and by when",
  "Who owns the source and designs",
];

const HANDOVER = [
  "Source code in your repository, with build and flashing steps",
  "Wiring diagrams and the bill of materials",
  "The test report, with every method written down",
  "A walkthrough for your team",
];

const QUESTIONS = [
  {
    q: "Can you work on firmware someone else wrote?",
    a: "Yes. A review is usually the right first step: we measure the problem, read the code and give you a ranked list of fixes before anyone rewrites anything.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes, before you share anything sensitive. Mention it in your brief and we'll send ours, or sign yours.",
  },
  {
    q: "Do you only work in Bangladesh?",
    a: "No. We're in Dhaka and work with local clients in person and with clients abroad remotely. Hardware ships both ways.",
  },
  {
    q: "What if the scope changes halfway?",
    a: "We write the change down, with its effect on price and dates, and continue only when you agree. No surprises on the invoice.",
  },
];

export default function ProcessPage() {
  return (
    <>
      <PageHead
        title="How a project runs"
        lead="Five steps, the same every time. You always know what we're doing, what comes next, and what you'll have in your hands at the end of each step."
      />
      <section aria-label="Steps" className="pb-20">
        <div className="wrap grid lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ProcessTrace />
          </div>
        </div>
      </section>

      <section aria-labelledby="docs-title" className="pb-20">
        <div className="wrap">
          <h2 id="docs-title" className="t-h2 border-t border-line pt-16">
            Two documents you can hold us to
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="sheet p-6 sm:p-8">
              <p className="font-mono text-[0.8125rem] text-ink-3">Before work starts</p>
              <h3 className="t-h3 mt-2">The scope</h3>
              <ul className="tick-list mt-5">
                {SCOPE.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="sheet p-6 sm:p-8">
              <p className="font-mono text-[0.8125rem] text-ink-3">When work ends</p>
              <h3 className="t-h3 mt-2">The handover pack</h3>
              <ul className="tick-list mt-5">
                {HANDOVER.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <h2 id="faq-title" className="t-h2 lg:col-span-4">
            Questions people ask first
          </h2>
          <dl className="grid gap-8 lg:col-span-7 lg:col-start-6">
            {QUESTIONS.map((x) => (
              <div key={x.q} className="border-t border-line pt-5">
                <dt className="t-h4">{x.q}</dt>
                <dd className="mt-2 text-[1.0625rem] leading-relaxed text-ink-2">{x.a}</dd>
              </div>
            ))}
            <div className="border-t border-line pt-5">
              <p className="text-[1.0625rem] text-ink-2">
                Something else?{" "}
                <TLink href="/contact" className="link">
                  Ask in your brief
                </TLink>
                .
              </p>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
