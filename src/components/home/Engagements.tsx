import { engagements } from "@/content/engagements";

export function Engagements({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="grid gap-12 md:grid-cols-3 md:gap-8">
      {engagements.map((e) => (
        <section key={e.slug} aria-labelledby={`eng-${e.slug}`} className="engagement">
          <H id={`eng-${e.slug}`} className="t-h3">
            {e.name}
          </H>
          <p className="mt-3 text-[1.0625rem] leading-relaxed">{e.summary}</p>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-ink-2">{e.forWho}</p>
          <ul className="tick-list mt-5">
            {e.youGet.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-ink-3">Length</dt>
              <dd className="mt-1 font-medium">{e.length}</dd>
            </div>
            <div>
              <dt className="text-ink-3">Pricing</dt>
              <dd className="mt-1 font-medium">{e.pricing}</dd>
            </div>
          </dl>
        </section>
      ))}
    </div>
  );
}
