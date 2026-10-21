import { describe, expect, it } from "vitest";
import { ADC_PROFILES, divider, getProfile, getRange, standardValues, suggestPairs } from "./divider";

describe("divider", () => {
  const esp32 = getProfile("esp32");
  const db12 = getRange(esp32, "db12");

  it("computes ratio, output and current", () => {
    const r = divider({ vinMax: 5, vinMin: 0.5, r1: 10_000, r2: 10_000, range: db12, bits: 12 });
    expect(r.ratio).toBeCloseTo(0.5);
    expect(r.voutMax).toBeCloseTo(2.5);
    expect(r.currentAtMax).toBeCloseTo(0.00025);
    expect(r.sourceImpedance).toBeCloseTo(5000);
    expect(r.verdict).toBe("over"); // 2.5 V is above the 2.45 V recommended top on ESP32
  });

  it("flags under-used ranges", () => {
    const r = divider({ vinMax: 1, vinMin: 0.3, r1: 10_000, r2: 10_000, range: db12, bits: 12 });
    expect(r.verdict).toBe("under-used");
  });

  it("flags readings below the ESP32 floor", () => {
    const r = divider({ vinMax: 4.8, vinMin: 0, r1: 10_000, r2: 10_000, range: db12, bits: 12 });
    expect(r.verdict).toBe("below-floor");
  });

  it("recommends a capacitor for high-impedance dividers", () => {
    const r = divider({ vinMax: 12, vinMin: 10, r1: 1_000_000, r2: 220_000, range: db12, bits: 12 });
    expect(r.advice.join(" ")).toMatch(/100 nF/);
  });

  it("has every profile's default range", () => {
    for (const p of ADC_PROFILES) expect(p.ranges.some((r) => r.id === p.defaultRange)).toBe(true);
  });

  it("generates E12 values across decades", () => {
    const v = standardValues("E12", 1000, 10_000);
    expect(v[0]).toBe(1000);
    expect(v).toContain(4700);
    expect(v[v.length - 1]).toBe(10_000);
  });

  it("suggests pairs that stay under the target", () => {
    const s = suggestPairs(5, 2.4, 0.0001);
    expect(s.length).toBeGreaterThan(0);
    for (const p of s) {
      expect(p.voutMax).toBeLessThanOrEqual(2.4);
      expect(5 / (p.r1 + p.r2)).toBeLessThanOrEqual(0.0001);
    }
    expect(s[0].voutMax).toBeGreaterThan(2.2);
  });
});
