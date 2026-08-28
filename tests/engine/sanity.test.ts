import { describe, it } from "vitest";
import fc from "fast-check";

describe("sanity", () => {
  it("addition is commutative", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => a + b === b + a),
    );
  });
});
