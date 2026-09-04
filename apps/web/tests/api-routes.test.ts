import { describe, expect, it } from "vitest"

import { GET as getCompensations } from "@/app/api/compensations/route"
import { GET as getCompanies } from "@/app/api/companies/route"
import { POST as postSubmission } from "@/app/api/submissions/route"

describe("CompGrid API routes", () => {
  it("returns paginated compensation data with aggregates", async () => {
    const response = await getCompensations(
      new Request(
        "http://localhost/api/compensations?role=software-engineer&location=bengaluru&limit=5",
      ),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toHaveLength(5)
    expect(body.pagination.total).toBe(240)
    expect(body.aggregates.median).toBeGreaterThan(0)
  })

  it("returns searchable company cards", async () => {
    const response = await getCompanies(
      new Request("http://localhost/api/companies?search=razor"),
    )
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body.data).toHaveLength(1)
    expect(body.data[0].slug).toBe("razorpay")
  })

  it("validates and returns a normalized submission", async () => {
    const response = await postSubmission(
      new Request("http://localhost/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "api-test" },
        body: JSON.stringify({
          company: "Google India",
          role: "SWE",
          companyLevel: "L4",
          location: "Bengaluru",
          baseSalary: 5_000_000,
          stockAnnual: 1_000_000,
          bonusAnnual: 500_000,
          currency: "INR",
          yearsExperience: 5,
          compensationYear: 2031,
        }),
      }),
    )
    const body = await response.json()

    expect(response.status).toBe(201)
    expect(body.data.company.name).toBe("Google")
    expect(body.data.totalCompensation).toBe(6_500_000)
  })

  it("returns the consistent validation error envelope", async () => {
    const response = await postSubmission(
      new Request("http://localhost/api/submissions", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "invalid-test" },
        body: JSON.stringify({ company: "Google" }),
      }),
    )
    const body = await response.json()

    expect(response.status).toBe(400)
    expect(body).toEqual(
      expect.objectContaining({
        error: expect.objectContaining({ code: "VALIDATION_ERROR" }),
      }),
    )
  })
})
