import { describe, expect, it } from "vitest";
import { formatNumber } from "./format";

describe("formatNumber", () => {
  it("uses a narrow no-break space as thousands separator", () => {
    expect(formatNumber(1180)).toBe("1 180");
    expect(formatNumber(240)).toBe("240");
  });
});
