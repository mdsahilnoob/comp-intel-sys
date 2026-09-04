import { getPrismaClient } from "@/lib/db"
import { summarizeValues } from "@/server/analytics/statistics"
import { getCatalogOptions } from "@/server/catalog"
import type { CompanyDetailData, CompanyDirectoryEntry } from "@/server/domain"
import { getDemoCompanyDetail, getDemoCompanyDirectory } from "@/server/repositories/demo-repository"

export async function getCompanyDirectory(
  search?: string,
): Promise<CompanyDirectoryEntry[]> {
  const prisma = getPrismaClient()
  if (!prisma) {
    return getDemoCompanyDirectory(search)
  }

  const normalizedSearch = search?.trim()
  const companies = await prisma.company.findMany({
    where: normalizedSearch
      ? {
          OR: [
            { name: { contains: normalizedSearch, mode: "insensitive" } },
            { slug: { contains: normalizedSearch, mode: "insensitive" } },
            { industry: { contains: normalizedSearch, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { name: "asc" },
  })

  const softwareEngineerRole = await prisma.role.findUnique({
    where: { slug: "software-engineer" },
    select: { id: true },
  })

  return Promise.all(
    companies.map(async (company) => {
      const [recordCount, engineerRows] = await Promise.all([
        prisma.compensationSubmission.count({ where: { companyId: company.id } }),
        softwareEngineerRole
          ? prisma.compensationSubmission.findMany({
              where: { companyId: company.id, roleId: softwareEngineerRole.id },
              select: { totalCompensation: true },
            })
          : Promise.resolve([]),
      ])

      return {
        id: company.id,
        name: company.name,
        slug: company.slug,
        industry: company.industry,
        recordCount,
        medianSoftwareEngineerTc: summarizeValues(
          engineerRows.map((row) => row.totalCompensation),
        ).median,
      }
    }),
  )
}

export async function getCompanyDetail(
  slug: string,
  roleSlug = "software-engineer",
  locationSlug?: string,
): Promise<CompanyDetailData> {
  const prisma = getPrismaClient()
  if (!prisma) {
    return getDemoCompanyDetail(slug, roleSlug, locationSlug)
  }

  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      levels: {
        include: { careerLevel: true },
        orderBy: { rank: "asc" },
      },
    },
  })

  if (!company) {
    throw new Error("Company not found")
  }

  const [role, location] = await Promise.all([
    prisma.role.findUnique({ where: { slug: roleSlug } }),
    locationSlug
      ? prisma.location.findUnique({ where: { slug: locationSlug } })
      : Promise.resolve(null),
  ])
  const where = {
    companyId: company.id,
    roleId: role?.id,
    locationId: location?.id,
  }
  const records = await prisma.compensationSubmission.findMany({
    where,
    select: {
      companyLevelId: true,
      baseSalary: true,
      stockAnnual: true,
      bonusAnnual: true,
      totalCompensation: true,
    },
  })
  const summary = {
    totalCompensation: summarizeValues(
      records.map((record) => record.totalCompensation),
    ),
    baseSalary: summarizeValues(records.map((record) => record.baseSalary)),
    stockAnnual: summarizeValues(records.map((record) => record.stockAnnual)),
    bonusAnnual: summarizeValues(records.map((record) => record.bonusAnnual)),
  }
  const careers = getCatalogOptions().careerLevels
  const levels = company.levels.map((level) => {
    const levelRecords = records.filter(
      (record) => record.companyLevelId === level.id,
    )
    const levelSummary = {
      baseSalary: summarizeValues(levelRecords.map((record) => record.baseSalary)),
      stockAnnual: summarizeValues(
        levelRecords.map((record) => record.stockAnnual),
      ),
      bonusAnnual: summarizeValues(
        levelRecords.map((record) => record.bonusAnnual),
      ),
      totalCompensation: summarizeValues(
        levelRecords.map((record) => record.totalCompensation),
      ),
    }
    const careerLevel = careers.find((career) => career.code === level.careerLevel.code)

    return {
      levelCode: level.code,
      displayName: level.displayName,
      canonicalLevel: level.careerLevel.code as CompanyDetailData["levels"][number]["canonicalLevel"],
      canonicalLevelName: level.careerLevel.name,
      canonicalRank: careerLevel?.rank ?? level.rank,
      baseSalary: levelSummary.baseSalary.median,
      stockAnnual: levelSummary.stockAnnual.median,
      bonusAnnual: levelSummary.bonusAnnual.median,
      medianTc: levelSummary.totalCompensation.median,
      recordCount: levelRecords.length,
    }
  })

  return {
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      industry: company.industry,
      website: company.website,
    },
    recordCount: records.length,
    summary,
    levels,
    selectedRole: role?.name ?? "All roles",
    selectedLocation: location?.city ?? null,
  }
}
