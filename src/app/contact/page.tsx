import type { Metadata } from "next";
import { IntakeForm } from "@/components/contact/IntakeForm";
import { TLink } from "@/components/site/TLink";
import { absoluteUrl, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Start a project brief",
  description: "Tell BuildIoT Labs what you're building. Four short steps; we reply by email with questions or a first plan.",
  alternates: { canonical: absoluteUrl("/contact/") },
};

export default function ContactPage() {
  return (
    <div className="wrap pb-24 pt-12 sm:pt-16 lg:pt-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h1 className="t-h1 rise">Start a project brief</h1>
          <p className="t-lead mt-6 rise" style={{ "--d": "120ms" } as React.CSSProperties}>
            Four short steps. Only the first and last are required. We reply by email with questions, a first plan, or
            an honest &ldquo;this isn&rsquo;t for us.&rdquo;
          </p>
          <div className="mt-10 grid gap-6 border-t border-line pt-6 text-[0.9375rem]">
            <div>
              <h2 className="font-semibold [font-stretch:106%]">What happens next</h2>
              <ol className="step-list mt-4 text-ink-2">
                <li>We read the brief and reply with questions, usually within one working day.</li>
                <li>A short call if it helps, then a written scope with a price.</li>
                <li>Work starts when you&rsquo;ve agreed to the scope.</li>
              </ol>
            </div>
            <div>
              <h2 className="font-semibold [font-stretch:106%]">Rather write directly?</h2>
              <p className="mt-2 text-ink-2">
                <a className="link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </p>
            </div>
            <div>
              <h2 className="font-semibold [font-stretch:106%]">Only need parts?</h2>
              <p className="mt-2 text-ink-2">
                Boards, sensors and modules are at{" "}
                <a className="link" href={site.store.url} rel="noopener">
                  {site.store.name}
                </a>
                . For a bill of materials, use their{" "}
                <a className="link" href={site.store.quoteUrl} rel="noopener">
                  quote request
                </a>
                .
              </p>
            </div>
            <p className="text-ink-3">
              Not ready for a brief? Read{" "}
              <TLink href="/process" className="link">
                how a project runs
              </TLink>
              .
            </p>
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:col-start-6">
          <div className="sheet">
            <div className="flex items-center justify-between gap-4 border-b-[3px] border-double border-line px-5 py-4 sm:px-8">
              <p className="text-[0.9375rem] font-semibold [font-stretch:110%]">Project brief</p>
              <p className="font-mono text-[0.8125rem] text-ink-3">Form BIL-F01</p>
            </div>
            <div className="px-5 py-8 sm:px-8 sm:py-10">
              <IntakeForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
