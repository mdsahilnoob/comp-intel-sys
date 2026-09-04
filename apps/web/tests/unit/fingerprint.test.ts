import { describe, expect, it } from "vitest"

import { createSubmissionFingerprint } from "@/server/normalization/fingerprint"

const submission = {
  companyId: 1,
  roleId: 2,
  companyLevelId: 3,
  locationId: 4,
  compensationYear: 2026,
  baseSalary: 4_600_000,
  stockAnnual: 2_000_000,
  bonusAnnual: 700_000,
  yearsExperience: 5,
}

describe("submission fingerprints", () => {
  it("is deterministic and independent of object insertion order", () => {
    const reordered = {
      yearsExperience: submission.yearsExperience,
      bonusAnnual: submission.bonusAnnual,
      stockAnnual: submission.stockAnnual,
      baseSalary: submission.baseSalary,
      compensationYear: submission.compensationYear,
      locationId: submission.locationId,
      companyLevelId: submission.companyLevelId,
      roleId: submission.roleId,
      companyId: submission.companyId,
    }

    expect(createSubmissionFingerprint(submission)).toBe(
      createSubmissionFingerprint(reordered),
    )
    expect(createSubmissionFingerprint(submission)).toMatch(/^[a-f0-9]{64}$/)
  })

  it("changes when a canonical field changes", () => {
    expect(
      createSubmissionFingerprint({ ...submission, bonusAnnual: 701_000 }),
    ).not.toBe(createSubmissionFingerprint(submission))
  })
})
