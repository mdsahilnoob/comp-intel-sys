import { describe, expect, it } from "vitest"

import {
  percentileCont,
  summarizeValues,
} from "@/server/analytics/statistics"

describe("percentile analytics", () => {
  it("uses continuous linear interpolation consistently", () => {
    expect(percentileCont([10, 20, 30, 40], 0.25)).toBe(17.5)
    expect(percentileCont([10, 20, 30, 40], 0.5)).toBe(25)
    expect(percentileCont([10, 20, 30, 40], 0.75)).toBe(32.5)
  })

  it("returns the dashboard summary fields", () => {
    expect(summarizeValues([10, 20, 30, 40])).toEqual({
      count: 4,
      average: 25,
      median: 25,
      p25: 17.5,
      p50: 25,
      p75: 32.5,
      p90: 37,
      min: 10,
      max: 40,
    })
  })

  it("returns null statistics for an empty dataset", () => {
    expect(summarizeValues([])).toEqual({
      count: 0,
      average: null,
      median: null,
      p25: null,
      p50: null,
      p75: null,
      p90: null,
      min: null,
      max: null,
    })
  })
})
