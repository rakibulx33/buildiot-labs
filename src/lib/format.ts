/** Round to a number of significant figures and format without trailing noise. */
export function sig(n: number, digits = 3): string {
  if (!Number.isFinite(n)) return "∞";
  if (n === 0) return "0";
  const magnitude = Math.floor(Math.log10(Math.abs(n)));
  const decimals = Math.max(0, digits - 1 - magnitude);
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(decimals, 6),
  });
}

export type Quantity = { value: string; unit: string };

/** Current given in mA, shown in µA or mA. */
export function current(mA: number, digits = 3): Quantity {
  if (Math.abs(mA) < 1) return { value: sig(mA * 1000, digits), unit: "µA" };
  if (Math.abs(mA) >= 1000) return { value: sig(mA / 1000, digits), unit: "A" };
  return { value: sig(mA, digits), unit: "mA" };
}

/** Voltage given in V, shown in mV or V. */
export function voltage(v: number, digits = 3): Quantity {
  if (Math.abs(v) < 1) return { value: sig(v * 1000, digits), unit: "mV" };
  return { value: sig(v, digits), unit: "V" };
}

/** Resistance in ohms. */
export function resistance(ohms: number, digits = 3): Quantity {
  if (ohms >= 1e6) return { value: sig(ohms / 1e6, digits), unit: "MΩ" };
  if (ohms >= 1e3) return { value: sig(ohms / 1e3, digits), unit: "kΩ" };
  return { value: sig(ohms, digits), unit: "Ω" };
}

/** Power given in W. */
export function power(w: number, digits = 3): Quantity {
  if (Math.abs(w) < 1e-3) return { value: sig(w * 1e6, digits), unit: "µW" };
  if (Math.abs(w) < 1) return { value: sig(w * 1e3, digits), unit: "mW" };
  return { value: sig(w, digits), unit: "W" };
}

/** Bytes, shown in B, KB, MB or GB (decimal, as data plans are sold). */
export function bytes(b: number, digits = 3): Quantity {
  if (b >= 1e9) return { value: sig(b / 1e9, digits), unit: "GB" };
  if (b >= 1e6) return { value: sig(b / 1e6, digits), unit: "MB" };
  if (b >= 1e3) return { value: sig(b / 1e3, digits), unit: "KB" };
  return { value: sig(b, digits), unit: "B" };
}

/** A lifetime given in hours, in the most readable unit. */
export function lifetime(hours: number): Quantity {
  if (!Number.isFinite(hours)) return { value: "∞", unit: "" };
  const days = hours / 24;
  if (days < 2) return { value: sig(hours, 2), unit: "hours" };
  if (days < 60) return { value: sig(days, 2), unit: "days" };
  const months = days / 30.44;
  if (months < 24) return { value: sig(months, 2), unit: "months" };
  return { value: sig(days / 365.25, 2), unit: "years" };
}

/** Seconds as a readable interval: "10 s", "5 min", "2 h". */
export function interval(seconds: number): string {
  if (seconds < 60) return `${sig(seconds, 3)} s`;
  if (seconds < 3600) return `${sig(seconds / 60, 3)} min`;
  return `${sig(seconds / 3600, 3)} h`;
}

export function q(x: Quantity): string {
  return x.unit ? `${x.value} ${x.unit}` : x.value;
}
