import { createHash } from "node:crypto"

export interface SubmissionFingerprintInput {
  companyId: number
  roleId: number
  companyLevelId: number
  locationId: number
  compensationYear: number
  baseSalary: number
  stockAnnual: number
  bonusAnnual: number
  yearsExperience: number
}

export function createSubmissionFingerprint(
  input: SubmissionFingerprintInput,
) {
  const canonicalValue = [
    input.companyId,
    input.roleId,
    input.companyLevelId,
    input.locationId,
    input.compensationYear,
    input.baseSalary,
    input.stockAnnual,
    input.bonusAnnual,
    input.yearsExperience,
  ].join("|")

  return createHash("sha256").update(canonicalValue).digest("hex")
}
