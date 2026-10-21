/**
 * Voltage divider into a microcontroller ADC.
 *
 * Measurable ranges for Espressif parts are taken from the ESP-IDF ADC
 * documentation ("ADC Attenuation" tables). They are the ranges Espressif
 * recommends for accurate readings, not the absolute full scale.
 */

export type AdcRange = { id: string; label: string; minMv: number; maxMv: number };

export type AdcProfile = {
  id: string;
  name: string;
  bits: number;
  ranges: AdcRange[];
  defaultRange: string;
  note: string;
};

export const ADC_PROFILES: AdcProfile[] = [
  {
    id: "esp32",
    name: "ESP32",
    bits: 12,
    ranges: [
      { id: "db0", label: "0 dB", minMv: 100, maxMv: 950 },
      { id: "db2_5", label: "2.5 dB", minMv: 100, maxMv: 1250 },
      { id: "db6", label: "6 dB", minMv: 150, maxMv: 1750 },
      { id: "db12", label: "12 dB", minMv: 150, maxMv: 2450 },
    ],
    defaultRange: "db12",
    note: "Use ADC1 pins (GPIO32 to GPIO39). ADC2 reads fail while Wi-Fi is running.",
  },
  {
    id: "esp32s3",
    name: "ESP32-S3",
    bits: 12,
    ranges: [
      { id: "db0", label: "0 dB", minMv: 0, maxMv: 950 },
      { id: "db2_5", label: "2.5 dB", minMv: 0, maxMv: 1250 },
      { id: "db6", label: "6 dB", minMv: 0, maxMv: 1750 },
      { id: "db12", label: "12 dB", minMv: 0, maxMv: 3100 },
    ],
    defaultRange: "db12",
    note: "Prefer ADC1. ADC2 reads can fail while Wi-Fi is running.",
  },
  {
    id: "esp32c3",
    name: "ESP32-C3",
    bits: 12,
    ranges: [
      { id: "db0", label: "0 dB", minMv: 0, maxMv: 750 },
      { id: "db2_5", label: "2.5 dB", minMv: 0, maxMv: 1050 },
      { id: "db6", label: "6 dB", minMv: 0, maxMv: 1300 },
      { id: "db12", label: "12 dB", minMv: 0, maxMv: 2500 },
    ],
    defaultRange: "db12",
    note: "Use ADC1. ADC2 one-shot reads are not supported on the C3.",
  },
  {
    id: "stm32",
    name: "STM32 at 3.3 V",
    bits: 12,
    ranges: [{ id: "vref", label: "VREF+ 3.3 V", minMv: 0, maxMv: 3300 }],
    defaultRange: "vref",
    note: "Full scale follows VREF+. On parts where VREF+ is tied to VDDA, supply noise shows up in every reading.",
  },
  {
    id: "avr",
    name: "ATmega328P (Arduino Uno)",
    bits: 10,
    ranges: [
      { id: "avcc", label: "AVcc 5 V", minMv: 0, maxMv: 5000 },
      { id: "int", label: "Internal 1.1 V", minMv: 0, maxMv: 1100 },
    ],
    defaultRange: "avcc",
    note: "With the AVcc reference, a sagging 5 V rail shifts every reading.",
  },
];

export function getProfile(id: string): AdcProfile {
  return ADC_PROFILES.find((p) => p.id === id) ?? ADC_PROFILES[0];
}

export function getRange(profile: AdcProfile, id: string): AdcRange {
  return profile.ranges.find((r) => r.id === id) ?? profile.ranges[profile.ranges.length - 1];
}

export type DividerInput = {
  vinMax: number; // volts
  vinMin: number; // volts
  r1: number; // ohms, top resistor
  r2: number; // ohms, bottom resistor
  range: AdcRange;
  bits: number;
};

export type DividerVerdict = "ok" | "over" | "under-used" | "below-floor";

export type DividerResult = {
  ratio: number;
  voutMax: number; // V
  voutMin: number; // V
  rangeUse: number; // 0..1+, voutMax relative to the top of the range
  inputVoltsPerStep: number; // V of input signal per ADC step, approximate
  currentAtMax: number; // A
  powerR1: number; // W
  powerR2: number; // W
  sourceImpedance: number; // Ω seen by the ADC pin (R1 || R2)
  loadImpedance: number; // Ω seen by the signal (R1 + R2)
  verdict: DividerVerdict;
  advice: string[];
};

export function divider(input: DividerInput): DividerResult {
  const r1 = Math.max(input.r1, 0);
  const r2 = Math.max(input.r2, 1e-9);
  const ratio = r2 / (r1 + r2);
  const voutMax = input.vinMax * ratio;
  const voutMin = input.vinMin * ratio;
  const top = input.range.maxMv / 1000;
  const floor = input.range.minMv / 1000;
  const rangeUse = top > 0 ? voutMax / top : 0;
  const steps = 2 ** input.bits;
  const inputVoltsPerStep = top / steps / ratio;
  const currentAtMax = input.vinMax / (r1 + r2);
  const powerR1 = currentAtMax ** 2 * r1;
  const powerR2 = currentAtMax ** 2 * r2;
  const sourceImpedance = (r1 * r2) / (r1 + r2);
  const loadImpedance = r1 + r2;

  let verdict: DividerVerdict = "ok";
  if (voutMax > top) verdict = "over";
  else if (floor > 0 && voutMin < floor) verdict = "below-floor";
  else if (rangeUse < 0.5) verdict = "under-used";

  const advice: string[] = [];
  if (verdict === "over") {
    advice.push("The top of your signal is above the measurable range, so readings will clip. Increase R1 or reduce R2.");
  }
  if (verdict === "below-floor") {
    advice.push(
      `The bottom of your signal falls below ${input.range.minMv} mV, where this ADC is not accurate. Readings near zero will be unreliable.`,
    );
  }
  if (verdict === "under-used") {
    advice.push("Less than half of the range is in use. A larger ratio, or a lower attenuation setting, gives finer steps.");
  }
  if (sourceImpedance > 10_000) {
    advice.push("The divider is high-impedance. Put a 100 nF capacitor from the ADC pin to ground so the sampling capacitor charges fully.");
  }
  if (currentAtMax > 0.0001) {
    advice.push("This divider draws more than 100 µA. On a battery node, switch it off between readings or use larger resistors.");
  }
  if (powerR1 > 0.125 || powerR2 > 0.125) {
    advice.push("A resistor dissipates more than 1/8 W. Use 1/4 W parts or larger values.");
  }
  return {
    ratio,
    voutMax,
    voutMin,
    rangeUse,
    inputVoltsPerStep,
    currentAtMax,
    powerR1,
    powerR2,
    sourceImpedance,
    loadImpedance,
    verdict,
    advice,
  };
}

const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2];
const E24 = [
  1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2,
  9.1,
];

export function standardValues(series: "E12" | "E24", minOhms = 1_000, maxOhms = 1_000_000): number[] {
  const base = series === "E12" ? E12 : E24;
  const out: number[] = [];
  for (let decade = 1; decade <= 1e6; decade *= 10) {
    for (const b of base) {
      const v = Math.round(b * decade * 100) / 100;
      if (v >= minOhms && v <= maxOhms) out.push(v);
    }
  }
  return out;
}

export type Suggestion = { r1: number; r2: number; ratio: number; voutMax: number };

/**
 * Find standard resistor pairs whose ratio puts `vinMax` just under
 * `targetVout`, keeping the divider current under `maxCurrent`.
 */
export function suggestPairs(
  vinMax: number,
  targetVout: number,
  maxCurrent = 0.0001,
  series: "E12" | "E24" = "E12",
  count = 3,
): Suggestion[] {
  const values = standardValues(series);
  const want = targetVout / vinMax;
  const pairs: Suggestion[] = [];
  for (const r1 of values) {
    for (const r2 of values) {
      const ratio = r2 / (r1 + r2);
      const voutMax = vinMax * ratio;
      if (voutMax > targetVout) continue;
      if (vinMax / (r1 + r2) > maxCurrent) continue;
      pairs.push({ r1, r2, ratio, voutMax });
    }
  }
  pairs.sort((a, b) => Math.abs(a.ratio - want) - Math.abs(b.ratio - want) || a.r1 + a.r2 - (b.r1 + b.r2));
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  for (const p of pairs) {
    const key = p.ratio.toFixed(4);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
    if (out.length >= count) break;
  }
  return out;
}
