import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";
import { MethodTag } from "@/components/ui/MethodTag";
import { PageHead } from "@/components/ui/PageHead";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "How We Measure and Label Numbers",
  description:
    "What the Measured, Model and Unverified tags on BuildIoT Lab figures mean, and how we measure current on the bench so results can be trusted.",
  path: "/methods/",
});

const KINDS = [
  {
    status: "measured" as const,
    title: "Measured",
    body: "Taken from the real device on our bench, with the method written next to it: the device, the conditions, the instrument and the date.",
  },
  {
    status: "model" as const,
    title: "Model",
    body: "Calculated from datasheets and stated assumptions, to show the shape of a problem. The scope on our home page is a model, and says so.",
  },
  {
    status: "pending" as const,
    title: "Method note pending",
    body: "A number we have recorded but not yet written up. We show it with this tag rather than hide it or pass it off as measured.",
  },
];

const RULES = [
  "Measure the whole cycle, not one moment of it. A node's average includes every wake and every sleep.",
  "Sleep and wake need different ranges. Microamps and radio bursts of hundreds of milliamps are measured in a way that sees both.",
  "Average many cycles. One wake can be lucky with the Wi-Fi; fifty usually are not.",
  "Measure the real board, with its real sensors attached and its real supply.",
  "Write down the supply voltage and the temperature. Both move the result.",
];

const NEVER = [
  "Grades we can't test, such as “military-grade” or “industrial-grade”.",
  "A live dashboard that is really a simulation. If it's a model, it is labelled as one.",
  "An accuracy figure without the data it was measured on.",
  "A battery life without its interval, its battery and its temperature.",
];

export default function MethodsPage() {
  return (
    <>
      <PageHead
        title="How we measure"
        lead="A number without a method is a guess with good typography. Every figure we publish carries a tag that says what kind of number it is."
      />

      <section aria-labelledby="kinds-title" className="pb-20">
        <div className="wrap">
          <h2 id="kinds-title" className="sr-only">
            Three kinds of number
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {KINDS.map((k) => (
              <div key={k.status} className="sheet p-6">
                <MethodTag status={k.status} />
                <h3 className="t-h3 mt-5">{k.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">{k.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="note-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h2 id="note-title" className="t-h2">
              What a method note holds
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-2">
              Four fields, enough for someone else to repeat the measurement and get the same answer.
            </p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="sheet overflow-hidden">
              <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-6">
                <p className="text-sm font-semibold [font-stretch:106%]">Method note</p>
                <p className="text-xs text-ink-3">Example layout</p>
              </div>
              <dl className="grid gap-0 sm:grid-cols-2">
                {[
                  ["Device", "Which board and revision, with what attached"],
                  ["Conditions", "Supply voltage, temperature, signal strength, number of cycles"],
                  ["Instrument", "What measured it, at what range and sample rate"],
                  ["Date", "When it was measured, so later changes can be traced"],
                ].map(([k, v]) => (
                  <div key={k} className="border-b border-line-soft px-5 py-4 sm:px-6 sm:[&:nth-child(odd)]:border-r">
                    <dt className="text-xs font-semibold text-ink-3 [font-stretch:92%]">{k}</dt>
                    <dd className="mt-1 text-[0.9375rem]">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="current-title" className="pb-20">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="current-title" className="t-h2 lg:col-span-4">
            Measuring current
          </h2>
          <ol className="step-list text-[1.0625rem] text-ink-2 lg:col-span-7 lg:col-start-6">
            {RULES.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="never-title" className="pb-24">
        <div className="wrap grid gap-10 border-t border-line pt-16 lg:grid-cols-12 lg:gap-8">
          <h2 id="never-title" className="t-h2 lg:col-span-4">
            What we won&rsquo;t write
          </h2>
          <div className="lg:col-span-7 lg:col-start-6">
            <ul className="grid gap-3">
              {NEVER.map((n) => (
                <li key={n} className="limit">
                  {n}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-[1.0625rem] leading-relaxed text-ink-2">
              Found a number on this site without a tag? Tell us at{" "}
              <a className="link" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              and we&rsquo;ll tag it or take it down. Our{" "}
              <TLink href="/tools" className="link">
                tools
              </TLink>{" "}
              show their working for the same reason.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
