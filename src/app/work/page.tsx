import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { ReportSheet } from "@/components/work/ReportSheet";
import { absoluteUrl } from "@/content/site";
import { reports } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Client projects from BuildIoT Labs, written up as test reports: the problem, what we built and what we measured.",
  alternates: { canonical: absoluteUrl("/work/") },
};

export default function WorkPage() {
  return (
    <>
      <PageHead
        title="Work"
        lead="Client projects, written up as test reports: the problem, what we built, and what we measured. Public reports stay at a high level; clients see everything."
      />
      <section aria-label="Reports" className="pb-24">
        <div className="wrap grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="grid min-w-0 gap-10 lg:col-span-9">
            {reports.map((r) => (
              <ReportSheet key={r.slug} report={r} headingLevel={2} />
            ))}
          </div>
          <aside className="min-w-0 lg:col-span-3">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
              <h2 className="t-h4">Reading a report</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
                Each number carries a tag. A <strong className="font-semibold text-ink">measured</strong> number has
                its method published: device, conditions, instrument and date. A number tagged{" "}
                <strong className="font-semibold text-ink">method note pending</strong> is one we have recorded but
                not yet written up.
              </p>
              <p className="mt-4">
                <TLink href="/methods" className="link text-[0.9375rem] font-medium">
                  How we measure
                </TLink>
              </p>
              <p className="mt-8 text-[0.9375rem] leading-relaxed text-ink-2">
                Working on something similar? We can share more detail privately once we know what you&rsquo;re
                building.
              </p>
              <TLink href="/contact" className="btn btn-primary btn-sm mt-4">
                <span className="btn-pad" aria-hidden="true" />
                Start a brief
              </TLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
