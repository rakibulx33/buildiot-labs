import { describe, expect, it } from "vitest";
import {
  REFERENCE_SLEEP_UA,
  REFERENCE_WAKE,
  dutyCycle,
  sampleWake,
  wakeChargeMilliCoulombs,
  wakeDurationMs,
  type WakeSegment,
} from "./wake";

describe("wake model", () => {
  it("integrates a flat segment", () => {
    const seg: WakeSegment[] = [{ label: "x", ms: 1000, mA: 100 }];
    expect(wakeChargeMilliCoulombs(seg)).toBeCloseTo(100); // 100 mA for 1 s
  });

  it("adds burst charge on top of the baseline", () => {
    const seg: WakeSegment[] = [{ label: "x", ms: 100, mA: 50, burst: { every: 10, width: 2, peak: 250 } }];
    // 10 bursts x 200 mA extra x 2 ms = 4 mA·s, plus 5 mA·s baseline
    expect(wakeChargeMilliCoulombs(seg)).toBeCloseTo(9);
  });

  it("gives a reference wake in a plausible range", () => {
    expect(wakeDurationMs(REFERENCE_WAKE)).toBe(1400);
    const q = wakeChargeMilliCoulombs(REFERENCE_WAKE);
    expect(q).toBeGreaterThan(100);
    expect(q).toBeLessThan(250);
  });

  it("computes duty-cycle average and life", () => {
    const r = dutyCycle({
      wakeCharge: 100, // mA·s
      wakeSeconds: 1,
      sleepMicroAmps: 10,
      intervalSeconds: 100,
      capacityMah: 1000,
      usableFraction: 1,
    });
    // (100 + 0.01 * 99) / 100 = 1.0099 mA
    expect(r.averageMilliAmps).toBeCloseTo(1.0099, 4);
    expect(r.lifeHours).toBeCloseTo(1000 / 1.0099, 1);
    expect(r.activeShare).toBeGreaterThan(0.99);
  });

  it("never lets the interval be shorter than the wake", () => {
    const r = dutyCycle({ wakeCharge: 10, wakeSeconds: 2, sleepMicroAmps: 5, intervalSeconds: 1, capacityMah: 100, usableFraction: 1 });
    expect(r.averageMilliAmps).toBeCloseTo(5);
  });

  it("samples deterministically", () => {
    const a = sampleWake(REFERENCE_WAKE, 2, 3);
    const b = sampleWake(REFERENCE_WAKE, 2, 3);
    expect(a).toEqual(b);
    expect(a.length).toBe(700);
    expect(Math.max(...a.map((p) => p.mA))).toBeGreaterThan(200);
  });

  it("keeps the reference sleep floor in the microamp range", () => {
    expect(REFERENCE_SLEEP_UA).toBeLessThan(100);
  });
});
