import { getCatalogOptions } from "@/server/catalog"
import { summarizeValues } from "@/server/analytics/statistics"
import type {
  CatalogCompany,
  CatalogCompanyLevel,
  CompanyDetailData,
  CompanyDirectoryEntry,
  ExplorerFilters,
  ExplorerResult,
  CompensationRecord,
} from "@/server/domain"
import { getDemoCompensationRecords } from "@/server/demo-data"

function filterRecords(records: CompensationRecord[], filters: ExplorerFilters) {
  return records.filter((record) => {
    if (filters.company && record.company.slug !== filters.company) {
      return false
    }
    if (filters.role && record.role.slug !== filters.role) {
      return false
    }
    if (filters.level && record.companyLevel.careerLevel.code !== filters.level) {
      return false
    }
    if (filters.location && record.location.slug !== filters.location) {
      return false
    }
    if (
      filters.minTc !== undefined &&
      record.totalCompensation < filters.minTc
    ) {
      return false
    }
    if (
      filters.maxTc !== undefined &&
      record.totalCompensation > filters.maxTc
    ) {
      return false
    }
    if (
      filters.minExperience !== undefined &&
      record.yearsExperience < filters.minExperience
    ) {
      return false
    }
    if (
      filters.maxExperience !== undefined &&
      record.yearsExperience > filters.maxExperience
    ) {
      return false
    }

    return true
  })
}

function getSortValue(record: CompensationRecord, sort: ExplorerFilters["sort"]) {
  switch (sort) {
    case "baseSalary":
      return record.baseSalary
    case "stockAnnual":
      return record.stockAnnual
    case "bonusAnnual":
      return record.bonusAnnual
    case "yearsExperience":
      return record.yearsExperience
    case "createdAt":
      return record.createdAt
    case "totalCompensation":
    default:
      return record.totalCompensation
  }
}

function sortRecords(records: CompensationRecord[], filters: ExplorerFilters) {
  const direction = filters.direction === "asc" ? 1 : -1

  return [...records].sort((left, right) => {
    const leftValue = getSortValue(left, filters.sort)
    const rightValue = getSortValue(right, filters.sort)
    const comparison =
      typeof leftValue === "string" && typeof rightValue === "string"
        ? leftValue.localeCompare(rightValue)
        : Number(leftValue) - Number(rightValue)

    return comparison === 0 ? (left.id - right.id) * direction : comparison * direction
  })
}

function summarizeRecords(records: CompensationRecord[]) {
  return {
    totalCompensation: summarizeValues(
      records.map((record) => record.totalCompensation),
    ),
    baseSalary: summarizeValues(records.map((record) => record.baseSalary)),
    stockAnnual: summarizeValues(records.map((record) => record.stockAnnual)),
    bonusAnnual: summarizeValues(records.map((record) => record.bonusAnnual)),
  }
}

export async function listDemoCompensations(
  filters: ExplorerFilters,
): Promise<ExplorerResult> {
  const filteredRecords = sortRecords(
    filterRecords(getDemoCompensationRecords(), filters),
    filters,
  )
  const total = filteredRecords.length
  const totalPages = total === 0 ? 0 : Math.ceil(total / filters.limit)
  const start = (filters.page - 1) * filters.limit

  return {
    data: filteredRecords.slice(start, start + filters.limit),
    pagination: { page: filters.page, limit: filters.limit, total, totalPages },
    aggregates: summarizeValues(
      filteredRecords.map((record) => record.totalCompensation),
    ),
  }
}

function companyMatchesSearch(company: CatalogCompany, search?: string) {
  if (!search) {
    return true
  }

  const query = search.trim().toLocaleLowerCase("en-IN")
  return (
    company.name.toLocaleLowerCase("en-IN").includes(query) ||
    company.slug.includes(query) ||
    company.industry.toLocaleLowerCase("en-IN").includes(query)
  )
}

export async function getDemoCompanyDirectory(
  search?: string,
): Promise<CompanyDirectoryEntry[]> {
  const catalog = getCatalogOptions()
  const records = getDemoCompensationRecords()

  return catalog.companies
    .filter((company) => companyMatchesSearch(company, search))
    .map((company) => {
      const companyRecords = records.filter(
        (record) => record.company.id === company.id,
      )
      const softwareEngineerRecords = companyRecords.filter(
        (record) => record.role.slug === "software-engineer",
      )

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        recordCount: companyRecords.length,
        medianSoftwareEngineerTc: summarizeValues(
          softwareEngineerRecords.map((record) => record.totalCompensation),
        ).median,
      }
    })
}

function makeLevelAnalytics(
  level: CatalogCompanyLevel,
  records: CompensationRecord[],
): CompanyDetailData["levels"][number] {
  const levelRecords = records.filter(
    (record) => record.companyLevel.id === level.id,
  )
  const summary = summarizeRecords(levelRecords)

  return {
    levelCode: level.code,
    displayName: level.displayName ?? null,
    canonicalLevel: level.careerLevelCode,
    canonicalLevelName:
      getCatalogOptions().careerLevels.find(
        (careerLevel) => careerLevel.code === level.careerLevelCode,
      )?.name ?? level.careerLevelCode,
    canonicalRank:
      getCatalogOptions().careerLevels.find(
        (careerLevel) => careerLevel.code === level.careerLevelCode,
      )?.rank ?? level.rank,
    baseSalary: summary.baseSalary.median,
    stockAnnual: summary.stockAnnual.median,
    bonusAnnual: summary.bonusAnnual.median,
    medianTc: summary.totalCompensation.median,
    recordCount: levelRecords.length,
  }
}

export async function getDemoCompanyDetail(
  slug: string,
  roleSlug = "software-engineer",
  locationSlug?: string,
): Promise<CompanyDetailData> {
  const catalog = getCatalogOptions()
  const company = catalog.companies.find((candidate) => candidate.slug === slug)

  if (!company) {
    throw new Error("Company not found")
  }

  const role = catalog.roles.find((candidate) => candidate.slug === roleSlug)
  const location = catalog.locations.find(
    (candidate) => candidate.slug === locationSlug,
  )
  const companyRecords = getDemoCompensationRecords().filter(
    (record) =>
      record.company.id === company.id &&
      (!role || record.role.id === role.id) &&
      (!location || record.location.id === location.id),
  )

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      industry: company.industry,
      website: company.website,
    },
    recordCount: companyRecords.length,
    summary: summarizeRecords(companyRecords),
    levels: catalog.companyLevels
      .filter((level) => level.companyId === company.id)
      .sort((left, right) => left.rank - right.rank)
      .map((level) => makeLevelAnalytics(level, companyRecords)),
    selectedRole: role?.name ?? "All roles",
    selectedLocation: location?.city ?? null,
  }
}
