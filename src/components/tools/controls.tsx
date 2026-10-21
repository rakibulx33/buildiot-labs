"use client";

import { useId, useState, type ReactNode } from "react";

type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  unit?: string;
  min?: number;
  max?: number;
  step?: number | "any";
  hint?: ReactNode;
};

/** A labelled numeric input on an instrument panel. Keeps the text while typing. */
export function NumberField({ label, value, onChange, unit, min, max, step = "any", hint }: NumberFieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const [text, setText] = useState(String(value));
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    // The value changed from outside (a preset or a suggestion): show it.
    setLastValue(value);
    if (Number(text) !== value) setText(String(value));
  }
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-box">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className="field-input"
          value={text}
          min={min}
          max={max}
          step={step}
          aria-describedby={hint ? hintId : undefined}
          onChange={(e) => {
            setText(e.target.value);
            const n = e.target.valueAsNumber;
            if (Number.isFinite(n)) {
              setLastValue(n);
              onChange(n);
            }
          }}
        />
        {unit ? <span className="field-unit">{unit}</span> : null}
      </div>
      {hint ? (
        <p id={hintId} className="field-hint">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

type Option<T extends string | number> = { value: T; label: string };

export function Keys<T extends string | number>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const name = useId();
  return (
    <fieldset className="field">
      <legend className="field-label">{legend}</legend>
      <div className="keys mt-0.5">
        {options.map((o) => (
          <label key={String(o.value)} className="key">
            <input type="radio" name={name} checked={o.value === value} onChange={() => onChange(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function SelectField<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="field-box">
        <select id={id} className="field-input field-select" value={value} onChange={(e) => onChange(e.target.value as T)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function Readout({ label, value, unit, sub }: { label: string; value: string; unit?: string; sub?: ReactNode }) {
  return (
    <div className="readout">
      <dt>{label}</dt>
      <dd>
        {value}
        {unit ? <small>{unit}</small> : null}
      </dd>
      {sub ? <p className="mt-1 text-xs text-panel-muted">{sub}</p> : null}
    </div>
  );
}
