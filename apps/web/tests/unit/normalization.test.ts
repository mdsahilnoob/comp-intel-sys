import { describe, expect, it } from "vitest"

import {
  calculateTotalCompensation,
  normalizeCompensationValues,
} from "@/server/normalization/compensation-normalizer"
import {
  normalizeCompanyName,
  normalizeRoleName,
} from "@/server/normalization/string-normalizer"

describe("string normalization", () => {
  it("normalizes company input without pretending it is an alias match", () => {
    expect(normalizeCompanyName(" GOOGLE India Pvt. Ltd ")).toBe(
      "google india pvt ltd",
    )
    expect(normalizeCompanyName("Acme, Inc.")).toBe("acme inc")
  })

  it("normalizes role aliases deterministically", () => {
    expect(normalizeRoleName("  Software Development Engineer ")).toBe(
      "software development engineer",
    )
    expect(normalizeRoleName("SDE")).toBe("sde")
  })
})

describe("compensation normalization", () => {
  it("calculates total compensation from base, stock, and bonus", () => {
    expect(calculateTotalCompensation(4_600_000, 2_000_000, 700_000)).toBe(
      7_300_000,
    )
  })

  it("defaults missing stock and bonus to zero", () => {
    expect(
      normalizeCompensationValues({
        baseSalary: 4_600_000,
        stockAnnual: undefined,
        bonusAnnual: null,
      }),
    ).toEqual({
      baseSalary: 4_600_000,
      stockAnnual: 0,
      bonusAnnual: 0,
      totalCompensation: 4_600_000,
    })
  })
})
