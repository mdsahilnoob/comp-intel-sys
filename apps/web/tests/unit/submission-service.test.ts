import { describe, expect, it } from "vitest"

import { AppError } from "@/server/errors"
import { createSubmission } from "@/server/services/submission-service"
import { submissionSchema } from "@/server/validation/schemas"

function makeSubmission(overrides: Record<string, unknown> = {}) {
  return submissionSchema.parse({
    company: " GOOGLE India Pvt. Ltd ",
    role: "SDE",
    companyLevel: "L4",
    location: "Bengaluru",
    baseSalary: 4_600_000,
    currency: "INR",
    yearsExperience: 5,
    compensationYear: 2026,
    ...overrides,
  })
}

describe("submission service", () => {
  it("resolves aliases, defaults missing components, and derives total compensation", async () => {
    const result = await createSubmission(makeSubmission({ compensationYear: 2027 }))

    expect(result.company.name).toBe("Google")
    expect(result.role.name).toBe("Software Engineer")
    expect(result.companyLevel.canonicalLevel).toBe("MID")
    expect(result.stockAnnual).toBe(0)
    expect(result.bonusAnnual).toBe(0)
    expect(result.totalCompensation).toBe(4_600_000)
  })

  it("returns a structured duplicate error for the same canonical submission", async () => {
    const input = makeSubmission({ compensationYear: 2028 })
    await createSubmission(input)

    await expect(createSubmission(input)).rejects.toMatchObject({
      code: "DUPLICATE_SUBMISSION",
      status: 409,
    } satisfies Partial<AppError>)
  })

  it("rejects unknown references and unsupported currencies", async () => {
    await expect(
      createSubmission(makeSubmission({ company: "Unknown Labs", compensationYear: 2029 })),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" })
    await expect(
      createSubmission(makeSubmission({ currency: "USD", compensationYear: 2030 })),
    ).rejects.toMatchObject({ code: "UNSUPPORTED_CURRENCY" })
  })
})
