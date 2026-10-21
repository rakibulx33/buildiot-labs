import { TLink } from "@/components/site/TLink";

const ARTIFACTS = [
  "Editable schematic and PCB source files",
  "Gerber and drill files, bill of materials",
  "Firmware and application source code",
  "Deployment instructions and API documentation",
  "Test results with methods written down",
  "Milestone sign-off against the agreed scope",
];

const DISCIPLINES = [
  ["Hardware and PCB", "Circuits, layout and design review"],
  ["Embedded firmware", "ESP32, STM32, connectivity and OTA"],
  ["IoT software and cloud", "Dashboards, APIs, MQTT and telemetry"],
  ["Technical consulting", "Feasibility, debugging and remote support"],
];

export function Handover() {
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-6">
        <p className="max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
          Every engagement starts with an agreed scope, milestones and acceptance criteria. Depending on the project,
          deliverables may include editable schematics and PCB files, firmware and application source code, deployment
          instructions, technical documentation and test results.
        </p>
        <ul className="tick-list mt-6">
          {ARTIFACTS.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <h3 className="t-h4 mt-10">Confidentiality</h3>
        <p className="mt-2 max-w-[34rem] text-[1.0625rem] leading-relaxed text-ink-2">
          We can discuss NDA arrangements before reviewing confidential design files. Access, ownership and handover
          terms are agreed in writing before work begins.
        </p>
      </div>
      <div className="lg:col-span-5 lg:col-start-8">
        <h3 className="t-h4">Engineering team</h3>
        <dl className="mt-4 grid gap-4">
          {DISCIPLINES.map(([k, v]) => (
            <div key={k} className="border-t border-line pt-3">
              <dt className="font-semibold [font-stretch:106%]">{k}</dt>
              <dd className="mt-1 text-[0.9375rem] text-ink-2">{v}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-2">
          Named profiles are published with each engineer&rsquo;s consent.{" "}
          <TLink href="/about" className="link">
            About our engineering approach
          </TLink>
          .
        </p>
      </div>
    </div>
  );
}
