import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { TLink } from "@/components/site/TLink";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { MethodTag } from "@/components/ui/MethodTag";
import { ReportFields, ReportHead } from "@/components/work/ReportSheet";
import { absoluteUrl } from "@/content/site";
import { getReport, reports } from "@/content/work";

export const dynamicParams = false;

export function generateStaticParams() {
  return reports.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) return {};
  return {
    title: report.title,
    description: report.summary,
    alternates: { canonical: absoluteUrl(`/work/${report.slug}/`) },
  };
}

export default async function ReportPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const report = getReport(slug);
  if (!report) notFound();

  return (
    <article className="wrap pb-24 pt-10 sm:pt-14">
      <Breadcrumb items={[{ href: "/work", label: "Work" }]} current={report.number} />

      <ViewTransition name={`report-${report.slug}`} share="morph" default="none">
        <div className="sheet mt-8 overflow-hidden">
          <ReportHead report={report} />
          <div className="report-stamp" aria-hidden="true">
            {report.status}
          </div>
          <div className="px-5 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-12 lg:pt-10">
            <h1 className="t-h2 max-w-[24ch]">{report.title}</h1>
            <ReportFields report={report} />
            <p className="t-lead mt-8 max-w-[44rem]">{report.summary}</p>

            <div className="report-section">
              <h2 className="report-h2">
                <span className="report-num">1</span>The problem
              </h2>
              <p className="max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-2">{report.problem}</p>
            </div>

            <div className="report-section">
              <h2 className="report-h2">
                <span className="report-num">2</span>What we built
              </h2>
              <ol className="max-w-[44rem] list-decimal space-y-3 pl-5 text-[1.0625rem] leading-relaxed text-ink-2 marker:font-mono marker:text-ink-3">
                {report.approach.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ol>
            </div>

            <div className="report-section">
              <h2 className="report-h2">
                <span className="report-num">3</span>Results
              </h2>
              <div className="report-table-wrap mt-0">
                <table className="report-table">
                  <caption className="sr-only">Results and how each was measured</caption>
                  <thead>
                    <tr>
                      <th scope="col">Measure</th>
                      <th scope="col" className="text-right">
                        Result
                      </th>
                      <th scope="col">Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.metrics.map((m) => (
                      <tr key={m.label}>
                        <th scope="row">{m.label}</th>
                        <td className="text-right font-mono tabular-nums">
                          {m.value}
                          {m.unit ? <span className="text-ink-3"> {m.unit}</span> : null}
                        </td>
                        <td>
                          {m.method ? (
                            <span className="text-sm text-ink-2">
                              {m.method.device}; {m.method.conditions}; {m.method.instrument}; {m.method.date}
                            </span>
                          ) : (
                            <MethodTag status={m.status} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 max-w-[44rem] text-sm leading-relaxed text-ink-3">
                Tags are explained on{" "}
                <TLink href="/methods" className="link">
                  How we measure
                </TLink>
                .
              </p>
            </div>

            <div className="report-section">
              <h2 className="report-h2">
                <span className="report-num">4</span>Where it stands
              </h2>
              <p className="max-w-[44rem] text-[1.0625rem] leading-relaxed text-ink-2">{report.outcome}</p>
            </div>

            <footer className="mt-12 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-6">
              <div>
                <p className="text-sm text-ink-3">Issued by</p>
                <p className="mt-1 font-semibold [font-stretch:110%]">BuildIoT Labs, Dhaka</p>
              </div>
              <p className="font-mono text-sm text-ink-3">{report.number}</p>
            </footer>
          </div>
        </div>
      </ViewTransition>

      <div className="mt-12 flex flex-wrap items-center gap-6">
        <TLink href="/contact" className="btn btn-primary">
          <span className="btn-pad" aria-hidden="true" />
          Start a project brief
        </TLink>
        <TLink href="/work" transitionTypes={["drill"]} className="link font-medium">
          Back to all work
        </TLink>
      </div>
    </article>
  );
}
