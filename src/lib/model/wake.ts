/**
 * A simple, documented model of a duty-cycled sensor node:
 * it sleeps, wakes, reads a sensor, joins Wi-Fi, publishes one MQTT
 * message over TLS and goes back to sleep.
 *
 * This is a model to show the shape of the problem. It is not a capture
 * from the bench, and the site labels it that way wherever it is drawn.
 */

export type BurstSpec = {
  /** average spacing between radio TX bursts, in ms */
  every: number;
  /** burst width, in ms */
  width: number;
  /** peak current during a burst, in mA */
  peak: number;
};

export type WakeSegment = {
  label: string;
  /** duration in ms */
  ms: number;
  /** baseline current in mA */
  mA: number;
  burst?: BurstSpec;
};

/** Reference node: ESP32-C3 module on a low-quiescent regulator. */
export const REFERENCE_WAKE: WakeSegment[] = [
  { label: "Boot", ms: 70, mA: 24 },
  { label: "Sensor", ms: 50, mA: 27 },
  { label: "Wi-Fi join", ms: 720, mA: 82, burst: { every: 48, width: 6, peak: 310 } },
  { label: "TLS + MQTT", ms: 420, mA: 88, burst: { every: 60, width: 5, peak: 300 } },
  { label: "Publish", ms: 90, mA: 95, burst: { every: 30, width: 6, peak: 320 } },
  { label: "Radio off", ms: 50, mA: 38 },
];

/** Sleep floor of the reference node, in µA (chip + regulator + sensor leakage). */
export const REFERENCE_SLEEP_UA = 15;

/** Fraction of nameplate capacity we plan to use (temperature, ageing, cut-off). */
export const DEFAULT_USABLE_FRACTION = 0.8;

export function wakeDurationMs(segments: WakeSegment[]): number {
  return segments.reduce((sum, s) => sum + s.ms, 0);
}

/** Charge drawn during one wake, in mA·s (millicoulombs). */
export function wakeChargeMilliCoulombs(segments: WakeSegment[]): number {
  let total = 0;
  for (const s of segments) {
    total += (s.mA * s.ms) / 1000;
    if (s.burst) {
      const count = Math.floor(s.ms / s.burst.every);
      total += (count * (s.burst.peak - s.mA) * s.burst.width) / 1000;
    }
  }
  return total;
}

/** Average active current over the wake, in mA. */
export function wakeAverageMilliAmps(segments: WakeSegment[]): number {
  const ms = wakeDurationMs(segments);
  return ms === 0 ? 0 : (wakeChargeMilliCoulombs(segments) * 1000) / ms;
}

export type DutyCycleInput = {
  /** charge per wake in mA·s */
  wakeCharge: number;
  /** wake duration in s */
  wakeSeconds: number;
  /** sleep current in µA */
  sleepMicroAmps: number;
  /** seconds between wakes (start to start) */
  intervalSeconds: number;
  /** nameplate capacity in mAh */
  capacityMah: number;
  /** usable fraction of capacity, 0..1 */
  usableFraction: number;
};

export type DutyCycleResult = {
  /** average current in mA */
  averageMilliAmps: number;
  /** share of the average that comes from waking, 0..1 */
  activeShare: number;
  /** charge used per day in mAh */
  mahPerDay: number;
  /** estimated life in hours (Infinity if average current is zero) */
  lifeHours: number;
};

export function dutyCycle(input: DutyCycleInput): DutyCycleResult {
  const interval = Math.max(input.intervalSeconds, input.wakeSeconds, 0.001);
  const sleepSeconds = Math.max(interval - input.wakeSeconds, 0);
  const sleepCharge = (input.sleepMicroAmps / 1000) * sleepSeconds; // mA·s
  const perCycle = input.wakeCharge + sleepCharge;
  const averageMilliAmps = perCycle / interval;
  const activeShare = perCycle === 0 ? 0 : input.wakeCharge / perCycle;
  const mahPerDay = averageMilliAmps * 24;
  const usable = input.capacityMah * clamp(input.usableFraction, 0, 1);
  const lifeHours = averageMilliAmps > 0 ? usable / averageMilliAmps : Infinity;
  return { averageMilliAmps, activeShare, mahPerDay, lifeHours };
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Deterministic pseudo-random generator (mulberry32) so the drawn
 * waveform looks organic but is identical on every render.
 */
export function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type TracePoint = { t: number; mA: number };

/**
 * Sample one wake as a list of (ms, mA) points, including radio bursts
 * and a little noise. `step` is the sample spacing in ms.
 */
export function sampleWake(segments: WakeSegment[], step = 1, seed = 7): TracePoint[] {
  const rand = rng(seed);
  const points: TracePoint[] = [];
  let start = 0;
  for (const s of segments) {
    // Pre-compute burst windows for this segment with some jitter.
    const bursts: Array<[number, number, number]> = [];
    if (s.burst) {
      let t = s.burst.every * (0.3 + rand() * 0.6);
      while (t < s.ms - s.burst.width) {
        const w = s.burst.width * (0.7 + rand() * 0.6);
        const p = s.burst.peak * (0.82 + rand() * 0.18);
        bursts.push([t, t + w, p]);
        t += s.burst.every * (0.6 + rand() * 0.8);
      }
    }
    for (let t = 0; t < s.ms; t += step) {
      let mA = s.mA * (0.94 + rand() * 0.12);
      for (const [a, b, p] of bursts) {
        if (t >= a && t < b) {
          mA = p;
          break;
        }
      }
      points.push({ t: start + t, mA });
    }
    start += s.ms;
  }
  return points;
}

/** Segment boundaries in ms from the start of the wake. */
export function segmentSpans(segments: WakeSegment[]): Array<{ label: string; from: number; to: number }> {
  let t = 0;
  return segments.map((s) => {
    const span = { label: s.label, from: t, to: t + s.ms };
    t += s.ms;
    return span;
  });
}
