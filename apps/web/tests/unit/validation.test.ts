import { describe, expect, it } from "vitest"

import {
  parseExplorerQuery,
  submissionSchema,
} from "@/server/validation/schemas"

describe("request validation", () => {
  it("parses bounded explorer filters with safe defaults", () => {
    expect(
      parseExplorerQuery(
        new URLSearchParams("role=software-engineer&location=bengaluru&limit=10"),
      ),
    ).toMatchObject({
      role: "software-engineer",
      location: "bengaluru",
      sort: "totalCompensation",
      direction: "desc",
      page: 1,
      limit: 10,
    })
  })

  it("rejects inverted compensation ranges", () => {
    expect(() =>
      parseExplorerQuery(
        new URLSearchParams("minTc=9000000&maxTc=1000000"),
      ),
    ).toThrow()
  })

  it("accepts missing optional components and rejects oversized totals", () => {
    expect(
      submissionSchema.parse({
        company: "Google",
        role: "SDE",
        companyLevel: "L4",
        location: "Bengaluru",
        baseSalary: 4_600_000,
        currency: "INR",
        yearsExperience: 5,
        compensationYear: 2026,
      }).stockAnnual,
    ).toBeUndefined()

    expect(() =>
      submissionSchema.parse({
        company: "Google",
        role: "SDE",
        companyLevel: "L4",
        location: "Bengaluru",
        baseSalary: 1_000_000_000,
        stockAnnual: 1,
        currency: "INR",
        yearsExperience: 5,
        compensationYear: 2026,
      }),
    ).toThrow()
  })
})
