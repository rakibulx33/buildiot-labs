import { ViewTransition } from "react";
import { Logo } from "@/components/site/Logo";
import { TLink } from "@/components/site/TLink";
import { MethodTag } from "@/components/ui/MethodTag";
import type { Report } from "@/content/work";

export function ReportHead({ report }: { report: Report }) {
  return (
    <header className="report-head">
      <div className="flex items-center gap-3">
        <Logo height={26} />
        <p className="text-[0.8125rem] text-ink-3">Test report</p>
      </div>
      <p className="text-right font-mono text-[0.8125rem] leading-tight text-ink-2">
        {report.number}
      </p>
    </header>
  );
}

export function ReportFields({ report }: { report: Report }) {
  const fields: Array<[string, string]> = [
    ["Sector", report.sector],
    ["Platform", report.platform.join(", ")],
    ["Data", report.data.join(", ")],
    ["Status", report.status],
  ];
  return (
    <dl className="report-fields">
      {fields.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ResultsTable({ report }: { report: Report }) {
  return (
    <div className="report-table-wrap">
      <table className="report-table">
        <caption className="sr-only">Results for {report.title}</caption>
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
                <MethodTag status={m.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A report as a sheet of paper on the bench, linking to the full report. */
export function ReportSheet({ report, headingLevel = 3 }: { report: Report; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="report-card">
      <ViewTransition name={`report-${report.slug}`} share="morph" default="none">
        <div className="sheet report">
          <ReportHead report={report} />
          <div className="report-stamp" aria-hidden="true">
            {report.status}
          </div>
          <div className="px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
            <H className="t-h3 max-w-[34rem]">
              <TLink href={`/work/${report.slug}`} transitionTypes={["drill"]} className="stretched-link">
                {report.title}
              </TLink>
            </H>
            <ReportFields report={report} />
            <p className="mt-5 max-w-[40rem] text-ink-2">{report.summary}</p>
            <ResultsTable report={report} />
            <p className="mt-6 text-[0.9375rem] font-medium text-mask">Read the report</p>
          </div>
        </div>
      </ViewTransition>
    </article>
  );
}
