import { describe, expect, it } from "vitest"

import {
  getDemoCompanyDetail,
  getDemoCompanyDirectory,
  listDemoCompensations,
} from "@/server/repositories/demo-repository"

describe("demo repository queries", () => {
  it("filters by role and location before paginating", async () => {
    const result = await listDemoCompensations({
      role: "software-engineer",
      location: "bengaluru",
      sort: "totalCompensation",
      direction: "desc",
      page: 1,
      limit: 10,
    })

    expect(result.pagination.total).toBe(240)
    expect(result.data).toHaveLength(10)
    expect(result.data.every((record) => record.role.slug === "software-engineer")).toBe(
      true,
    )
    expect(result.data.every((record) => record.location.slug === "bengaluru")).toBe(
      true,
    )
    expect(result.data[0].totalCompensation).toBeGreaterThanOrEqual(
      result.data[9].totalCompensation,
    )
  })

  it("searches companies and calculates software engineer median", async () => {
    const companies = await getDemoCompanyDirectory("micro")

    expect(companies).toHaveLength(1)
    expect(companies[0].name).toBe("Microsoft")
    expect(companies[0].recordCount).toBeGreaterThan(0)
    expect(companies[0].medianSoftwareEngineerTc).toBeGreaterThan(0)
  })

  it("returns level analytics for a company detail view", async () => {
    const detail = await getDemoCompanyDetail("google", "software-engineer", "bengaluru")

    expect(detail.company.name).toBe("Google")
    expect(detail.recordCount).toBe(12)
    expect(detail.levels.length).toBeGreaterThanOrEqual(5)
    expect(detail.levels.some((level) => level.canonicalLevel === "MID")).toBe(true)
    expect(detail.summary.totalCompensation.median).toBeGreaterThan(0)
  })
})
