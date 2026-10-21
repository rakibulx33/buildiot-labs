import type { Metadata } from "next";
import { ProcessTrace } from "@/components/home/ProcessTrace";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { faqs } from "@/content/faq";
import { steps } from "@/content/process";
import { canonicalUrl } from "@/content/site";

export const metadata: Metadata = {
  title: "How a project runs",
  description: "Brief, scope, build, test, hand over: how a BuildIoT Lab project runs, with the inputs, outputs and acceptance criteria for each step.",
  alternates: { canonical: canonicalUrl("/process/") },
};

const SCOPE = [
  "What we will build, and what we won't",
  "The test criteria the work must pass",
  "Milestones, dates and the price",
  "What we need from you, and by when",
  "Who owns the source and designs",
];

const HANDOVER = [
  "Editable schematics and PCB files, when in scope",
  "Firmware and application source code, with build and deployment instructions",
  "Technical documentation and a bill of materials",
  "The test results, with every method written down",
  "A walkthrough for your team",
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

      <section aria-labelledby="accept-title" className="pb-20">
        <div className="wrap">
          <h2 id="accept-title" className="t-h2 border-t border-line pt-16">
            Inputs, outputs and acceptance
          </h2>
          <div className="sheet mt-10 overflow-x-auto">
            <table className="data-table">
              <caption className="sr-only">What each step needs, produces and is accepted against</caption>
              <thead>
                <tr>
                  <th scope="col">Step</th>
                  <th scope="col">We need</th>
                  <th scope="col">You receive</th>
                  <th scope="col">Accepted when</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((st) => (
                  <tr key={st.name}>
                    <th scope="row">{st.name}</th>
                    <td className="text-ink-2">{st.input}</td>
                    <td className="text-ink-2">{st.youGet}</td>
                    <td className="text-ink-2">{st.accept}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            {faqs.slice(0, 4).map((x) => (
              <div key={x.q} className="border-t border-line pt-5">
                <dt className="t-h4">{x.q}</dt>
                <dd className="mt-2 text-[1.0625rem] leading-relaxed text-ink-2">{x.a}</dd>
              </div>
            ))}
            <div className="border-t border-line pt-5">
              <p className="text-[1.0625rem] text-ink-2">
                <TLink href="/faq" className="link">
                  All questions and answers
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
