import { PcbPlate } from "@/components/diagrams/CapabilityDiagrams";

/** A clearly labelled, simulated dashboard. The numbers are illustrative and nothing here is live. */
function DashboardMock() {
  const points = [14, 18, 16, 22, 21, 27, 25, 31, 29, 34, 30, 36];
  const path = points.map((y, i) => `${i === 0 ? "M" : "L"}${20 + i * 38} ${150 - y * 3}`).join(" ");
  const tiles = [
    ["Devices online", "12 of 12"],
    ["Last report", "2 min ago"],
    ["Battery (sample)", "3.9 V"],
  ];
  return (
    <figure className="sheet p-4 sm:p-6">
      <div className="screen p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {tiles.map(([k, v]) => (
            <div key={k} className="rounded-[6px] border border-panel-line p-2 sm:p-3">
              <p className="text-[0.6875rem] text-panel-muted sm:text-xs">{k}</p>
              <p className="mt-1 text-sm font-semibold text-panel-text sm:text-base">{v}</p>
            </div>
          ))}
        </div>
        <svg viewBox="0 0 480 170" className="mt-4 w-full" role="img" aria-label="A simulated line chart of sensor readings rising over twelve samples. Illustrative data.">
          <line x1="20" x2="470" y1="150" y2="150" stroke="var(--color-panel-line)" />
          <path d={path} fill="none" stroke="var(--color-ch1)" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
      <figcaption className="mt-3 text-sm text-ink-2">
        <span className="font-semibold text-ink [font-stretch:106%]">Simulated screen.</span> Illustrative layout and
        numbers, not live data and not a client system.
      </figcaption>
    </figure>
  );
}

export function Showcase() {
  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
      <figure className="sheet p-4 sm:p-6">
        <PcbPlate />
        <figcaption className="mt-3 text-sm text-ink-2">
          <span className="font-semibold text-ink [font-stretch:106%]">Illustration.</span> The elements of a board
          layout. Real, approved PCB renders and schematic excerpts will replace this as projects are cleared for
          publication.
        </figcaption>
      </figure>
      <DashboardMock />
    </div>
  );
}
