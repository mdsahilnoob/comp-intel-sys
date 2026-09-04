export interface CompensationValuesInput {
  baseSalary: number
  stockAnnual?: number | null
  bonusAnnual?: number | null
}

export interface NormalizedCompensationValues {
  baseSalary: number
  stockAnnual: number
  bonusAnnual: number
  totalCompensation: number
}

export function calculateTotalCompensation(
  baseSalary: number,
  stockAnnual = 0,
  bonusAnnual = 0,
) {
  return baseSalary + stockAnnual + bonusAnnual
}

export function normalizeCompensationValues(
  input: CompensationValuesInput,
): NormalizedCompensationValues {
  const stockAnnual = input.stockAnnual ?? 0
  const bonusAnnual = input.bonusAnnual ?? 0

  return {
    baseSalary: input.baseSalary,
    stockAnnual,
    bonusAnnual,
    totalCompensation: calculateTotalCompensation(
      input.baseSalary,
      stockAnnual,
      bonusAnnual,
    ),
  }
}
