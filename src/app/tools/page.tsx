import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";
import { PageHead } from "@/components/ui/PageHead";
import { canonicalUrl } from "@/content/site";
import { tools } from "@/content/tools";

export const metadata: Metadata = {
  title: "Tools",
  description: "Free engineering calculators from BuildIoT Lab: battery life, voltage dividers for ADCs, and MQTT data use.",
  alternates: { canonical: canonicalUrl("/tools/") },
};

export default function ToolsPage() {
  return (
    <>
      <PageHead
        title="Tools"
        lead="The calculators we use on our own projects, cleaned up for yours. Each one shows its working and says what it leaves out."
      />
      <section aria-label="Tools" className="pb-24">
        <ul className="wrap grid gap-6 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.slug} className="tool-card on-dark">
              <span className="instrument-screw" style={{ top: 9, left: 9 }} aria-hidden="true" />
              <span className="instrument-screw" style={{ top: 9, right: 9 }} aria-hidden="true" />
              <span className="instrument-screw" style={{ bottom: 9, left: 9 }} aria-hidden="true" />
              <span className="instrument-screw" style={{ bottom: 9, right: 9 }} aria-hidden="true" />
              <ToolGlyph kind={i} />
              <p className="mt-6 text-sm text-panel-muted">{t.question}</p>
              <h2 className="mt-2 text-[1.375rem] font-[640] leading-tight [font-stretch:112%]">
                <TLink href={`/tools/${t.slug}`} className="stretched-link">
                  {t.name}
                </TLink>
              </h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-panel-muted">{t.summary}</p>
              <p className="mt-6 text-[0.9375rem] font-medium text-ch1">Open the tool</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function ToolGlyph({ kind }: { kind: number }) {
  return (
    <div className="screen h-32">
      <svg viewBox="0 0 300 120" className="h-full w-full" aria-hidden="true">
        <g stroke="rgba(233,229,221,0.08)">
          {[1, 2, 3, 4, 5].map((i) => (
            <line key={`v${i}`} x1={i * 50} x2={i * 50} y1="0" y2="120" />
          ))}
          {[1, 2, 3].map((i) => (
            <line key={`h${i}`} y1={i * 30} y2={i * 30} x1="0" x2="300" />
          ))}
        </g>
        {kind === 0 ? (
          <path d="M10 100 C 60 96, 90 80, 130 56 S 220 22, 290 18" fill="none" stroke="#f2c94c" strokeWidth="2.5" />
        ) : null}
        {kind === 1 ? (
          <g fill="none" stroke="#e9e5dd" strokeWidth="2">
            <path d="M40 20 H120 V34 L128 40 L112 46 L128 52 L112 58 L128 64 L120 70 V86 L128 92 L112 98 L120 104 V112" />
            <path d="M120 78 H220" stroke="#f2c94c" />
            <rect x="220" y="68" width="56" height="20" rx="3" stroke="#5cc6e0" />
          </g>
        ) : null}
        {kind === 2 ? (
          <g>
            <rect x="20" y="46" width="70" height="28" fill="#f2c94c" />
            <rect x="90" y="46" width="40" height="28" fill="#e9e5dd" />
            <rect x="130" y="46" width="60" height="28" fill="#5cc6e0" />
            <rect x="190" y="46" width="90" height="28" fill="#9aa6ab" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}
