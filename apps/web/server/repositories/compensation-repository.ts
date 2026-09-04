import { Prisma } from "@prisma/client"

import { getPrismaClient } from "@/lib/db"
import { summarizeValues } from "@/server/analytics/statistics"
import type { ComparisonEntryInput, ExplorerFilters, ExplorerResult, CompensationRecord } from "@/server/domain"
import { getDemoCompensationRecords } from "@/server/demo-data"
import { listDemoCompensations } from "@/server/repositories/demo-repository"

const compensationSelect = {
  id: true,
  baseSalary: true,
  stockAnnual: true,
  bonusAnnual: true,
  totalCompensation: true,
  currency: true,
  yearsExperience: true,
  compensationYear: true,
  verified: true,
  source: true,
  createdAt: true,
  company: { select: { id: true, name: true, slug: true } },
  role: { select: { id: true, name: true, slug: true } },
  companyLevel: {
    select: {
      id: true,
      code: true,
      careerLevel: { select: { code: true, name: true, rank: true } },
    },
  },
  location: { select: { id: true, city: true, slug: true } },
} as const

type CompensationRow = Prisma.CompensationSubmissionGetPayload<{
  select: typeof compensationSelect
}>

function toCompensationRecord(row: CompensationRow): CompensationRecord {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    companyLevel: {
      id: row.companyLevel.id,
      code: row.companyLevel.code,
      careerLevel: {
        code: row.companyLevel.careerLevel.code as CompensationRecord["companyLevel"]["careerLevel"]["code"],
        name: row.companyLevel.careerLevel.name,
        rank: row.companyLevel.careerLevel.rank,
      },
    },
    location: row.location,
    baseSalary: row.baseSalary,
    stockAnnual: row.stockAnnual,
    bonusAnnual: row.bonusAnnual,
    totalCompensation: row.totalCompensation,
    currency: row.currency,
    yearsExperience: row.yearsExperience,
    compensationYear: row.compensationYear,
    verified: row.verified,
    source: row.source,
    createdAt: row.createdAt.toISOString(),
  }
}

function buildWhere(filters: ExplorerFilters): Prisma.CompensationSubmissionWhereInput {
  return {
    company: filters.company ? { is: { slug: filters.company } } : undefined,
    role: filters.role ? { is: { slug: filters.role } } : undefined,
    companyLevel: filters.level
      ? { is: { careerLevel: { is: { code: filters.level } } } }
      : undefined,
    location: filters.location ? { is: { slug: filters.location } } : undefined,
    totalCompensation:
      filters.minTc !== undefined || filters.maxTc !== undefined
        ? { gte: filters.minTc, lte: filters.maxTc }
        : undefined,
    yearsExperience:
      filters.minExperience !== undefined || filters.maxExperience !== undefined
        ? { gte: filters.minExperience, lte: filters.maxExperience }
        : undefined,
  }
}

export async function listCompensations(
  filters: ExplorerFilters,
): Promise<ExplorerResult> {
  const prisma = getPrismaClient()
  if (!prisma) {
    return listDemoCompensations(filters)
  }

  const where = buildWhere(filters)
  const orderBy = [
    { [filters.sort]: filters.direction },
    { id: "asc" },
  ] as Prisma.CompensationSubmissionOrderByWithRelationInput[]
  const skip = (filters.page - 1) * filters.limit

  const [total, rows, aggregateRows] = await Promise.all([
    prisma.compensationSubmission.count({ where }),
    prisma.compensationSubmission.findMany({
      where,
      orderBy,
      skip,
      take: filters.limit,
      select: compensationSelect,
    }),
    prisma.compensationSubmission.findMany({
      where,
      select: { totalCompensation: true },
    }),
  ])
  const totalPages = total === 0 ? 0 : Math.ceil(total / filters.limit)

  return {
    data: rows.map(toCompensationRecord),
    pagination: { page: filters.page, limit: filters.limit, total, totalPages },
    aggregates: summarizeValues(
      aggregateRows.map((row) => row.totalCompensation),
    ),
  }
}

export interface ComparisonStats {
  baseSalary: number | null
  stockAnnual: number | null
  bonusAnnual: number | null
  medianTc: number | null
  p75Tc: number | null
  recordCount: number
  minExperience: number | null
  maxExperience: number | null
}

function summarizeComparisonRows(
  rows: Array<{
    baseSalary: number
    stockAnnual: number
    bonusAnnual: number
    totalCompensation: number
    yearsExperience: number
  }>,
): ComparisonStats {
  const totalCompensation = summarizeValues(
    rows.map((row) => row.totalCompensation),
  )

  return {
    baseSalary: summarizeValues(rows.map((row) => row.baseSalary)).median,
    stockAnnual: summarizeValues(rows.map((row) => row.stockAnnual)).median,
    bonusAnnual: summarizeValues(rows.map((row) => row.bonusAnnual)).median,
    medianTc: totalCompensation.median,
    p75Tc: totalCompensation.p75,
    recordCount: rows.length,
    minExperience:
      rows.length > 0 ? Math.min(...rows.map((row) => row.yearsExperience)) : null,
    maxExperience:
      rows.length > 0 ? Math.max(...rows.map((row) => row.yearsExperience)) : null,
  }
}

export async function getComparisonStats(
  input: ComparisonEntryInput,
): Promise<ComparisonStats> {
  const prisma = getPrismaClient()
  if (!prisma) {
    const rows = getDemoCompensationRecords().filter(
      (record) =>
        record.company.slug === input.companySlug &&
        record.companyLevel.code === input.companyLevelCode &&
        record.role.slug === input.roleSlug &&
        record.location.slug === input.locationSlug,
    )
    return summarizeComparisonRows(rows)
  }

  const rows = await prisma.compensationSubmission.findMany({
    where: {
      company: { is: { slug: input.companySlug } },
      role: { is: { slug: input.roleSlug } },
      companyLevel: { is: { code: input.companyLevelCode } },
      location: { is: { slug: input.locationSlug } },
    },
    select: {
      baseSalary: true,
      stockAnnual: true,
      bonusAnnual: true,
      totalCompensation: true,
      yearsExperience: true,
    },
  })

  return summarizeComparisonRows(rows)
}
