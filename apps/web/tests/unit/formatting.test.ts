import { describe, expect, it } from "vitest"

import {
  formatCompactCurrency,
  formatDetailedCurrency,
} from "@/lib/currency"

describe("INR formatting", () => {
  it("formats compact compensation values in lakhs", () => {
    expect(formatCompactCurrency(7_300_000)).toBe("₹73L")
    expect(formatCompactCurrency(1_250_000)).toBe("₹12.5L")
  })

  it("formats detailed values with the Indian grouping system", () => {
    expect(formatDetailedCurrency(7_300_000)).toBe("₹73,00,000")
  })
})
