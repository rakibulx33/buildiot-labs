"use client";

import { useMemo, useState } from "react";
import { Instrument } from "@/components/objects/Instrument";
import { ADC_PROFILES, divider, getProfile, getRange, suggestPairs } from "@/lib/calc/divider";
import { current, power, q, resistance, sig, voltage } from "@/lib/format";
import { NumberField, Readout, SelectField } from "./controls";

const VERDICT_TEXT = {
  ok: "The signal fits the recommended range.",
  over: "Over range: the top of the signal will clip.",
  "under-used": "Fits, but uses less than half of the range.",
  "below-floor": "The bottom of the signal is below the accurate range.",
} as const;

export function DividerTool() {
  const [chip, setChip] = useState("esp32");
  const profile = getProfile(chip);
  const [rangeId, setRangeId] = useState(profile.defaultRange);
  const range = getRange(profile, rangeId);
  const [vinMax, setVinMax] = useState(5);
  const [vinMin, setVinMin] = useState(0.5);
  const [r1k, setR1k] = useState(12);
  const [r2k, setR2k] = useState(10);

  const r = useMemo(
    () => divider({ vinMax, vinMin, r1: r1k * 1000, r2: r2k * 1000, range, bits: profile.bits }),
    [vinMax, vinMin, r1k, r2k, range, profile.bits],
  );
  const suggestions = useMemo(
    () => suggestPairs(vinMax, (range.maxMv / 1000) * 0.95, 0.0001, "E12", 3),
    [vinMax, range.maxMv],
  );
  const tone = r.verdict === "ok" ? "ok" : r.verdict === "over" ? "bad" : "warn";

  return (
    <Instrument legend="Voltage divider into an ADC">
      <div className="tool-grid">
        <div className="grid content-start gap-5">
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="Signal, highest" unit="V" min={0} value={vinMax} onChange={setVinMax} />
            <NumberField label="Signal, lowest" unit="V" min={0} value={vinMin} onChange={setVinMin} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <NumberField label="R1, top" unit="kΩ" min={0} value={r1k} onChange={setR1k} />
            <NumberField label="R2, bottom" unit="kΩ" min={0.001} value={r2k} onChange={setR2k} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Microcontroller"
              value={chip}
              options={ADC_PROFILES.map((p) => ({ value: p.id, label: p.name }))}
              onChange={(v) => {
                setChip(v);
                setRangeId(getProfile(v).defaultRange);
              }}
            />
            <SelectField
              label="ADC range"
              value={range.id}
              options={profile.ranges.map((x) => ({ value: x.id, label: `${x.label}: ${x.minMv} to ${x.maxMv} mV` }))}
              onChange={setRangeId}
            />
          </div>
          <p className="text-xs leading-relaxed text-panel-muted">{profile.note}</p>

          <div className="grid gap-2">
            <p className="field-label">Standard E12 pairs that fit, under 100 µA</p>
            <ul className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <li key={`${s.r1}-${s.r2}`}>
                  <button
                    type="button"
                    className="key"
                    onClick={() => {
                      setR1k(s.r1 / 1000);
                      setR2k(s.r2 / 1000);
                    }}
                  >
                    <span>
                      {q(resistance(s.r1))} / {q(resistance(s.r2))}
                    </span>
                  </button>
                </li>
              ))}
              {suggestions.length === 0 ? (
                <li className="text-sm text-panel-muted">No pair under 100 µA fits. Try a lower input voltage.</li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="grid content-start gap-4">
          <DividerDiagram r1={r1k * 1000} r2={r2k * 1000} vinMax={vinMax} voutMax={r.voutMax} />
          <RangeBar minMv={range.minMv} maxMv={range.maxMv} lowV={r.voutMin} highV={r.voutMax} />
          <dl className="readouts" aria-live="polite">
            <Readout label="At the pin, highest" value={voltage(r.voutMax).value} unit={voltage(r.voutMax).unit} />
            <Readout label="Range in use" value={String(Math.round(r.rangeUse * 100))} unit="%" />
            <Readout label="Input per ADC step" value={voltage(r.inputVoltsPerStep).value} unit={voltage(r.inputVoltsPerStep).unit} />
            <Readout label="Divider current" value={current(r.currentAtMax * 1000).value} unit={current(r.currentAtMax * 1000).unit} />
          </dl>
          <p className="verdict" data-tone={tone}>
            <span className="verdict-led" aria-hidden="true" />
            <span>{VERDICT_TEXT[r.verdict]}</span>
          </p>
          {r.advice.length ? (
            <ul className="grid gap-2 text-sm leading-relaxed text-panel-text">
              {r.advice.map((a) => (
                <li key={a} className="flex gap-2">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                  {a}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="text-xs text-panel-muted">
            Ratio {sig(r.ratio, 3)}. The ADC pin sees {q(resistance(r.sourceImpedance))}; your signal sees a{" "}
            {q(resistance(r.loadImpedance))} load. R1 dissipates {q(power(r.powerR1))}.
          </p>
        </div>
      </div>
    </Instrument>
  );
}

/** The divider drawn as a schematic, with live values. */
function DividerDiagram({ r1, r2, vinMax, voutMax }: { r1: number; r2: number; vinMax: number; voutMax: number }) {
  const zig = (x: number, y0: number, y1: number) => {
    const n = 6;
    const h = (y1 - y0) / n;
    let d = `M${x} ${y0}`;
    for (let i = 0; i < n; i++) d += ` L${x + (i % 2 ? -9 : 9)} ${y0 + h * (i + 0.5)}`;
    return `${d} L${x} ${y1}`;
  };
  return (
    <figure className="screen p-3">
      <svg viewBox="0 0 640 220" className="block h-auto w-full" role="img" aria-label={`Divider schematic: input up to ${q(voltage(vinMax))}, R1 ${q(resistance(r1))}, R2 ${q(resistance(r2))}, ADC pin up to ${q(voltage(voutMax))}.`}>
        <g stroke="#e9e5dd" strokeWidth="2" fill="none" strokeLinejoin="round">
          <path d="M60 30 H200 V50" />
          <path d={zig(200, 50, 100)} />
          <path d="M200 100 V120 H420" />
          <path d={zig(200, 120, 170)} transform="translate(0 0)" />
          <path d="M200 170 V196" />
          <path d="M186 196 H214 M191 202 H209 M196 208 H204" />
        </g>
        <circle cx="60" cy="30" r="5" fill="#0e1316" stroke="#e9e5dd" strokeWidth="2" />
        <circle cx="200" cy="120" r="4" fill="#e9e5dd" />
        <rect x="420" y="104" width="120" height="32" rx="4" fill="none" stroke="#5cc6e0" strokeWidth="2" />
        <text x="480" y="125" textAnchor="middle" fill="#5cc6e0" fontSize="14">
          ADC pin
        </text>
        <text x="74" y="22" fill="#9aa6ab" fontSize="13">
          Signal, up to {q(voltage(vinMax))}
        </text>
        <text x="224" y="80" fill="#e9e5dd" fontSize="14">
          R1 {q(resistance(r1))}
        </text>
        <text x="224" y="150" fill="#e9e5dd" fontSize="14">
          R2 {q(resistance(r2))}
        </text>
        <text x="300" y="112" fill="#f2c94c" fontSize="14">
          {q(voltage(voutMax))}
        </text>
      </svg>
    </figure>
  );
}

/** Where the signal lands within the ADC's recommended range. */
function RangeBar({ minMv, maxMv, lowV, highV }: { minMv: number; maxMv: number; lowV: number; highV: number }) {
  const top = Math.max(maxMv * 1.25, highV * 1000 * 1.05);
  const pct = (mv: number) => `${Math.min(100, Math.max(0, (mv / top) * 100))}%`;
  return (
    <div className="screen px-4 pb-3 pt-4" aria-hidden="true">
      <div className="relative h-7">
        <div className="absolute inset-y-2 left-0 right-0 rounded bg-[#1b2226]" />
        <div className="absolute inset-y-2 rounded bg-[rgba(111,208,140,0.25)]" style={{ left: pct(minMv), width: `calc(${pct(maxMv)} - ${pct(minMv)})` }} />
        <div className="absolute inset-y-0 rounded-sm bg-[rgba(242,201,76,0.85)]" style={{ left: pct(lowV * 1000), width: `max(3px, calc(${pct(highV * 1000)} - ${pct(lowV * 1000)}))` }} />
      </div>
      <div className="mt-2 flex justify-between text-[11px] text-panel-muted">
        <span>0 V</span>
        <span>Accurate range in green, your signal in yellow</span>
        <span>{q(voltage(top / 1000))}</span>
      </div>
    </div>
  );
}
