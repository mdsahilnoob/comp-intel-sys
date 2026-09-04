import { getCatalogOptions } from "@/server/catalog"
import type { CatalogOptions } from "@/server/domain"
import type { CareerLevelCode, CompensationRecord } from "@/server/domain"

const roleBaseSalary: Record<string, number> = {
  "software-engineer": 4_000_000,
  "data-scientist": 3_500_000,
  "product-manager": 3_800_000,
  "engineering-manager": 5_000_000,
}

const careerMultipliers: Record<CareerLevelCode, number> = {
  ENTRY: 0.78,
  MID: 1,
  SENIOR: 1.34,
  STAFF: 1.72,
  PRINCIPAL: 2.12,
  DISTINGUISHED: 2.55,
}

const locationMultipliers: Record<string, number> = {
  bengaluru: 1.06,
  hyderabad: 1,
  pune: 0.96,
  gurgaon: 1.02,
  mumbai: 1.04,
  chennai: 0.93,
}

const stockRatios: Record<CareerLevelCode, number> = {
  ENTRY: 0.08,
  MID: 0.16,
  SENIOR: 0.24,
  STAFF: 0.32,
  PRINCIPAL: 0.4,
  DISTINGUISHED: 0.46,
}

function seededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

function roundToThousand(value: number) {
  return Math.max(1_000, Math.round(value / 1_000) * 1_000)
}

export function generateDemoCompensationRecords(
  catalog: CatalogOptions = getCatalogOptions(),
): CompensationRecord[] {
  const records: CompensationRecord[] = []
  let nextRecordId = 10_000
  let seed = 42

  for (const company of catalog.companies) {
    for (const role of catalog.roles) {
      for (const location of catalog.locations) {
        for (let sample = 0; sample < 12; sample += 1) {
          const random = seededRandom(seed)
          seed += 1
          const level = company.levels[sample % company.levels.length]
          const catalogLevel = catalog.companyLevels.find(
            (candidate) =>
              candidate.companyId === company.id && candidate.code === level.code,
          )

          if (!catalogLevel) {
            continue
          }

          const careerLevel = catalog.careerLevels.find(
            (candidate) => candidate.id === catalogLevel.careerLevelId,
          )

          if (!careerLevel) {
            continue
          }

          const base =
            roleBaseSalary[role.slug] *
            careerMultipliers[careerLevel.code] *
            locationMultipliers[location.slug] *
            (0.86 + random() * 0.28) *
            (0.9 + company.tier * 0.035)
          const baseSalary = roundToThousand(base)
          const stockAnnual = roundToThousand(
            baseSalary * stockRatios[careerLevel.code] * (0.75 + random() * 0.5),
          )
          const bonusAnnual = roundToThousand(
            baseSalary * (0.08 + careerLevel.rank * 0.018) * (0.8 + random() * 0.4),
          )
          const yearsExperience = Math.min(
            level.maxYearsExperience,
            level.minYearsExperience +
              Math.floor(
                random() * (level.maxYearsExperience - level.minYearsExperience + 1),
              ),
          )

          records.push({
            id: nextRecordId,
            company: { id: company.id, name: company.name, slug: company.slug },
            role: { id: role.id, name: role.name, slug: role.slug },
            companyLevel: {
              id: catalogLevel.id,
              code: catalogLevel.code,
              careerLevel: {
                code: careerLevel.code,
                name: careerLevel.name,
                rank: careerLevel.rank,
              },
            },
            location: { id: location.id, city: location.city, slug: location.slug },
            baseSalary,
            stockAnnual,
            bonusAnnual,
            totalCompensation: baseSalary + stockAnnual + bonusAnnual,
            currency: "INR",
            yearsExperience,
            compensationYear: 2024 + (records.length % 3),
            verified: false,
            source: "synthetic-demo",
            createdAt: new Date(
              Date.UTC(2025, 0, 1 + (records.length % 700)),
            ).toISOString(),
          })
          nextRecordId += 1
        }
      }
    }
  }

  return records
}

let demoRecordsCache: CompensationRecord[] | undefined

export function getDemoCompensationRecords() {
  if (!demoRecordsCache) {
    demoRecordsCache = generateDemoCompensationRecords()
  }

  return demoRecordsCache
}
