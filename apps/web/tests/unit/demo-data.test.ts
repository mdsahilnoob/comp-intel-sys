import { describe, expect, it } from "vitest"

import {
  generateDemoCompensationRecords,
  getDemoCompensationRecords,
} from "@/server/demo-data"

describe("demo compensation dataset", () => {
  it("generates a deterministic, varied dataset of usable size", () => {
    const first = generateDemoCompensationRecords()
    const second = generateDemoCompensationRecords()

    expect(first).toHaveLength(5_760)
    expect(first).toEqual(second)
    expect(new Set(first.map((record) => record.totalCompensation)).size).toBeGreaterThan(
      100,
    )
    expect(new Set(first.map((record) => record.company.slug)).size).toBe(20)
    expect(new Set(first.map((record) => record.location.slug)).size).toBe(6)
  })

  it("memoizes the generated fallback dataset", () => {
    expect(getDemoCompensationRecords()).toBe(getDemoCompensationRecords())
  })
})
