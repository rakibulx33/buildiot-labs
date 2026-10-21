"use client";

import { useMemo, useState } from "react";
import { Instrument } from "@/components/objects/Instrument";
import { current, lifetime, q, sig } from "@/lib/format";
import {
  DEFAULT_USABLE_FRACTION,
  REFERENCE_SLEEP_UA,
  REFERENCE_WAKE,
  dutyCycle,
  wakeAverageMilliAmps,
  wakeDurationMs,
} from "@/lib/model/wake";
import { Keys, NumberField, Readout } from "./controls";

const REF_ACTIVE_MA = Math.round(wakeAverageMilliAmps(REFERENCE_WAKE));
const REF_WAKE_S = wakeDurationMs(REFERENCE_WAKE) / 1000;

const PRESET_INTERVALS = [
  { value: 10, label: "10 s" },
  { value: 60, label: "1 min" },
  { value: 300, label: "5 min" },
  { value: 900, label: "15 min" },
  { value: 3600, label: "1 h" },
];

type Inputs = {
  capacityMah: number;
  usablePct: number;
  sleepMicroAmps: number;
  activeMilliAmps: number;
  activeSeconds: number;
  intervalSeconds: number;
};

const DEFAULTS: Inputs = {
  capacityMah: 2500,
  usablePct: DEFAULT_USABLE_FRACTION * 100,
  sleepMicroAmps: REFERENCE_SLEEP_UA,
  activeMilliAmps: REF_ACTIVE_MA,
  activeSeconds: REF_WAKE_S,
  intervalSeconds: 300,
};

function compute(i: Inputs, intervalSeconds = i.intervalSeconds) {
  return dutyCycle({
    wakeCharge: i.activeMilliAmps * i.activeSeconds,
    wakeSeconds: i.activeSeconds,
    sleepMicroAmps: i.sleepMicroAmps,
    intervalSeconds,
    capacityMah: i.capacityMah,
    usableFraction: i.usablePct / 100,
  });
}

export function BatteryTool() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULTS);
  const set = <K extends keyof Inputs>(k: K) => (v: Inputs[K]) => setInputs((s) => ({ ...s, [k]: v }));
  const r = useMemo(() => compute(inputs), [inputs]);
  const avg = current(r.averageMilliAmps);
  const life = lifetime(r.lifeHours);
  const sleepOnly = (inputs.capacityMah * (inputs.usablePct / 100)) / (inputs.sleepMicroAmps / 1000);

  const advice =
    r.activeShare > 0.9
      ? {
          tone: "warn" as const,
          text: "Waking uses almost all of the charge. Report less often, batch several readings into one message, or shorten the wake: keep Wi-Fi details in RTC memory and use a static IP so joining takes less time.",
        }
      : r.activeShare < 0.4
        ? {
            tone: "warn" as const,
            text: "Sleep current uses most of the charge. Look at the regulator's quiescent current, power LEDs, pull-ups and sensors that stay powered while the chip sleeps.",
          }
        : {
            tone: "ok" as const,
            text: "Wake and sleep are roughly balanced. Improving either one now moves battery life noticeably.",
          };

  return (
    <Instrument legend="Battery-life estimator">
      <div className="tool-grid">
        <div className="grid content-start gap-5">
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Battery capacity" unit="mAh" min={1} value={inputs.capacityMah} onChange={set("capacityMah")} />
            <NumberField
              label="Usable capacity"
              unit="%"
              min={1}
              max={100}
              value={inputs.usablePct}
              onChange={set("usablePct")}
              hint="Covers temperature, ageing and cut-off voltage."
            />
          </div>
          <NumberField
            label="Sleep current"
            unit="µA"
            min={0}
            value={inputs.sleepMicroAmps}
            onChange={set("sleepMicroAmps")}
            hint="Measure it on your board with sensors attached. Dev boards often sit in the milliamps."
          />
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Current while awake" unit="mA" min={0} value={inputs.activeMilliAmps} onChange={set("activeMilliAmps")} />
            <NumberField label="Time awake per report" unit="s" min={0.001} value={inputs.activeSeconds} onChange={set("activeSeconds")} />
          </div>
          <Keys
            legend="Report every"
            options={PRESET_INTERVALS}
            value={PRESET_INTERVALS.some((p) => p.value === inputs.intervalSeconds) ? inputs.intervalSeconds : -1}
            onChange={set("intervalSeconds")}
          />
          <NumberField label="Or set the interval" unit="s" min={1} value={inputs.intervalSeconds} onChange={set("intervalSeconds")} />
          <button type="button" className="btn btn-on-dark btn-sm justify-self-start" onClick={() => setInputs(DEFAULTS)}>
            Reset to the reference node
          </button>
        </div>

        <div className="grid content-start gap-4">
          <dl className="readouts" aria-live="polite">
            <Readout label="Average current" value={avg.value} unit={avg.unit} />
            <Readout label="Battery life" value={life.value} unit={life.unit} />
            <Readout label="Used per day" value={sig(r.mahPerDay, 3)} unit="mAh" />
            <Readout label="Spent awake" value={String(Math.round(r.activeShare * 100))} unit="%" />
          </dl>
          <LifeChart inputs={inputs} sleepOnlyHours={sleepOnly} />
          <p className="verdict" data-tone={advice.tone}>
            <span className="verdict-led" aria-hidden="true" />
            <span>{advice.text}</span>
          </p>
          <p className="text-xs leading-relaxed text-panel-muted">
            If the node never woke, this battery would last {q(lifetime(sleepOnly))}. That is the ceiling your
            sleep current sets.
          </p>
        </div>
      </div>
    </Instrument>
  );
}

const X_MIN = 10;
const X_MAX = 3600;
const X_TICKS = [
  { v: 10, l: "10 s" },
  { v: 60, l: "1 min" },
  { v: 300, l: "5 min" },
  { v: 900, l: "15 min" },
  { v: 3600, l: "1 h" },
];
const Y_TICKS = [
  { v: 24, l: "1 day" },
  { v: 24 * 7, l: "1 week" },
  { v: 24 * 30.44, l: "1 month" },
  { v: 24 * 182.6, l: "6 months" },
  { v: 24 * 365.25, l: "1 year" },
  { v: 24 * 365.25 * 5, l: "5 years" },
  { v: 24 * 365.25 * 20, l: "20 years" },
];

/** Battery life against reporting interval, on log axes, with the current setting marked. */
function LifeChart({ inputs, sleepOnlyHours }: { inputs: Inputs; sleepOnlyHours: number }) {
  const W = 640;
  const H = 280;
  const pad = { l: 64, r: 16, t: 16, b: 34 };
  const points = useMemo(() => {
    const out: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= 80; i++) {
      const x = X_MIN * Math.pow(X_MAX / X_MIN, i / 80);
      out.push({ x, y: compute(inputs, x).lifeHours });
    }
    return out;
  }, [inputs]);

  const ys = points.map((p) => p.y).filter(Number.isFinite);
  const yMin = Math.max(1, Math.min(...ys) / 1.6);
  const yMax = Math.min(24 * 365.25 * 40, Math.max(...ys, Math.min(sleepOnlyHours, 24 * 365.25 * 40)) * 1.6);
  const lx = (x: number) => pad.l + ((Math.log(x) - Math.log(X_MIN)) / (Math.log(X_MAX) - Math.log(X_MIN))) * (W - pad.l - pad.r);
  const ly = (y: number) =>
    H - pad.b - ((Math.log(y) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin))) * (H - pad.t - pad.b);
  const path = points
    .filter((p) => Number.isFinite(p.y))
    .map((p, i) => `${i ? "L" : "M"}${lx(p.x).toFixed(1)} ${ly(p.y).toFixed(1)}`)
    .join(" ");
  const cur = Math.min(Math.max(inputs.intervalSeconds, X_MIN), X_MAX);
  const curY = compute(inputs, cur).lifeHours;
  const ceilingVisible = sleepOnlyHours < yMax;

  return (
    <figure className="screen p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label="Battery life against reporting interval, on logarithmic scales. Life rises as reports get rarer, and levels off at the limit set by sleep current.">
        {Y_TICKS.filter((t) => t.v >= yMin && t.v <= yMax).map((t) => (
          <g key={t.l}>
            <line x1={pad.l} x2={W - pad.r} y1={ly(t.v)} y2={ly(t.v)} stroke="rgba(233,229,221,0.08)" />
            <text x={pad.l - 8} y={ly(t.v) + 4} textAnchor="end" fill="#9aa6ab" fontSize="11">
              {t.l}
            </text>
          </g>
        ))}
        {X_TICKS.map((t) => (
          <g key={t.l}>
            <line x1={lx(t.v)} x2={lx(t.v)} y1={pad.t} y2={H - pad.b} stroke="rgba(233,229,221,0.08)" />
            <text x={lx(t.v)} y={H - pad.b + 18} textAnchor="middle" fill="#9aa6ab" fontSize="11">
              {t.l}
            </text>
          </g>
        ))}
        {ceilingVisible ? (
          <g>
            <line
              x1={pad.l}
              x2={W - pad.r}
              y1={ly(sleepOnlyHours)}
              y2={ly(sleepOnlyHours)}
              stroke="#5cc6e0"
              strokeDasharray="4 4"
              opacity="0.8"
            />
            <text x={W - pad.r - 4} y={ly(sleepOnlyHours) - 6} textAnchor="end" fill="#5cc6e0" fontSize="11">
              Limit set by sleep current
            </text>
          </g>
        ) : null}
        <path d={path} fill="none" stroke="#f2c94c" strokeWidth="2.25" />
        {Number.isFinite(curY) ? (
          <g>
            <line x1={lx(cur)} x2={lx(cur)} y1={ly(curY)} y2={H - pad.b} stroke="#c9a24d" strokeDasharray="2 3" />
            <circle cx={lx(cur)} cy={ly(curY)} r="5.5" fill="#f2c94c" stroke="#0e1316" strokeWidth="2" />
          </g>
        ) : null}
      </svg>
      <figcaption className="mt-1 px-1 text-xs text-panel-muted">Battery life against how often the node reports</figcaption>
    </figure>
  );
}
