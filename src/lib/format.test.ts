import { describe, expect, it } from "vitest";
import { current, lifetime, sig } from "./format";

describe("format", () => {
  it("rounds to significant figures", () => {
    expect(sig(458.33, 3)).toBe("458");
    expect(sig(0.012345, 2)).toBe("0.012");
    expect(sig(12_345, 3)).toBe("12,345");
  });

  it("chooses current units", () => {
    expect(current(0.458)).toEqual({ value: "458", unit: "µA" });
    expect(current(82)).toEqual({ value: "82", unit: "mA" });
  });

  it("chooses lifetime units", () => {
    expect(lifetime(30)).toEqual({ value: "30", unit: "hours" });
    expect(lifetime(24 * 5)).toEqual({ value: "5", unit: "days" });
    expect(lifetime(24 * 182).unit).toBe("months");
    expect(lifetime(24 * 900).unit).toBe("years");
  });
});
