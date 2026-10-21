import type { Metadata } from "next";
import { TLink } from "@/components/site/TLink";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="wrap grid gap-10 pb-24 pt-16 lg:grid-cols-12 lg:gap-8 lg:pt-24">
      <div className="lg:col-span-5">
        <p className="font-mono text-sm text-ink-3">Error 404</p>
        <h1 className="t-h1 mt-3">No signal on this route.</h1>
        <p className="t-lead mt-5">The page you asked for isn&rsquo;t here. It may have moved, or the link may be mistyped.</p>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          <TLink href="/" className="btn btn-primary">
            <span className="btn-pad" aria-hidden="true" />
            Back to the lab
          </TLink>
          <TLink href="/lab-notes" className="link font-medium">
            Read the lab notes
          </TLink>
        </div>
      </div>
      <div className="lg:col-span-6 lg:col-start-7">
        <div className="instrument on-dark">
          <p className="instrument-legend" aria-hidden="true">
            Channel 1: waiting for a trigger
          </p>
          <div className="screen aspect-[16/9]">
            <svg viewBox="0 0 400 225" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <g stroke="rgba(233,229,221,0.08)">
                {Array.from({ length: 9 }, (_, i) => (
                  <line key={`v${i}`} x1={(i + 1) * 40} x2={(i + 1) * 40} y1="0" y2="225" />
                ))}
                {Array.from({ length: 7 }, (_, i) => (
                  <line key={`h${i}`} y1={(i + 1) * 28.125} y2={(i + 1) * 28.125} x1="0" x2="400" />
                ))}
              </g>
              <path className="flatline" d="M0 113 H400" stroke="#f2c94c" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
