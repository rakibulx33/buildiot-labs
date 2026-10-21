import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { ReportSheet } from "@/components/work/ReportSheet";
import { reports } from "@/content/work";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Engineering Case Studies",
  description:
    "Engineering reports from BuildIoT Lab: the problem, the approach, the evidence and its limits, with every figure labelled as measured, modelled or unverified.",
  path: "/work/",
});

export default function WorkPage() {
  return (
    <>
      <PageHead
        title="Work and case studies"
        lead="Projects written up as engineering reports: the problem, what we built, the evidence, and its limits. Public reports stay at a high level, and we publish client details only with written permission."
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
                Start a Project
              </TLink>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
