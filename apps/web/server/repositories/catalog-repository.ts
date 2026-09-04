import { getPrismaClient } from "@/lib/db"
import { getCatalogOptions } from "@/server/catalog"
import type {
  CatalogCompany,
  CatalogCompanyLevel,
  CatalogCareerLevel,
  CatalogLocation,
  CatalogOptions,
  CatalogRole,
  CareerLevelCode,
} from "@/server/domain"

function asCareerLevelCode(value: string) {
  return value as CareerLevelCode
}

export async function getCatalogOptionsFromRepository(): Promise<CatalogOptions> {
  const prisma = getPrismaClient()
  if (!prisma) {
    return getCatalogOptions()
  }

  const [companiesFromDb, rolesFromDb, careerLevelsFromDb, locationsFromDb] =
    await Promise.all([
      prisma.company.findMany({
        include: {
          aliases: true,
          levels: { include: { careerLevel: true }, orderBy: { rank: "asc" } },
        },
        orderBy: { name: "asc" },
      }),
      prisma.role.findMany({
        include: { aliases: true },
        orderBy: { name: "asc" },
      }),
      prisma.careerLevel.findMany({ orderBy: { rank: "asc" } }),
      prisma.location.findMany({ orderBy: { city: "asc" } }),
    ])

  const careerLevels: CatalogCareerLevel[] = careerLevelsFromDb.map((level) => ({
    id: level.id,
    code: asCareerLevelCode(level.code),
    name: level.name,
    rank: level.rank,
  }))
  const careerById = new Map(careerLevels.map((level) => [level.id, level]))

  const companyLevels: CatalogCompanyLevel[] = companiesFromDb.flatMap((company) =>
    company.levels.map((level) => ({
      id: level.id,
      companyId: company.id,
      careerLevelId: level.careerLevelId,
      code: level.code,
      careerLevelCode: asCareerLevelCode(level.careerLevel.code),
      displayName: level.displayName ?? undefined,
      rank: level.rank,
      minYearsExperience: level.minYearsExperience ?? 0,
      maxYearsExperience: level.maxYearsExperience ?? 60,
    })),
  )

  const companies: CatalogCompany[] = companiesFromDb.map((company) => ({
    id: company.id,
    name: company.name,
    slug: company.slug,
    industry: company.industry ?? "Technology",
    website: company.website ?? "",
    tier: 3,
    aliases: company.aliases.map((alias) => alias.alias),
    levels: company.levels.map((level) => ({
      code: level.code,
      careerLevelCode: asCareerLevelCode(level.careerLevel.code),
      displayName: level.displayName ?? undefined,
      rank: level.rank,
      minYearsExperience: level.minYearsExperience ?? 0,
      maxYearsExperience: level.maxYearsExperience ?? 60,
    })),
  }))
  const roles: CatalogRole[] = rolesFromDb.map((role) => ({
    id: role.id,
    name: role.name,
    slug: role.slug,
    category: role.category ?? "Other",
    aliases: role.aliases.map((alias) => alias.alias),
  }))
  const locations: CatalogLocation[] = locationsFromDb.map((location) => ({
    id: location.id,
    city: location.city,
    state: location.state ?? "",
    country: location.country,
    slug: location.slug,
  }))

  // Keep the map creation in the same place as the relational projection so
  // callers never need to reconcile database foreign keys themselves.
  for (const level of companyLevels) {
    if (!careerById.has(level.careerLevelId)) {
      throw new Error(`Company level ${level.id} references an unknown career level`)
    }
  }

  return { companies, roles, careerLevels, companyLevels, locations }
}
