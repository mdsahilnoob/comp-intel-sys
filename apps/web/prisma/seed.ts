import "dotenv/config"

import { Prisma, PrismaClient } from "@prisma/client"

import {
  CAREER_LEVEL_DEFINITIONS,
  COMPANY_DEFINITIONS,
  LOCATION_DEFINITIONS,
  ROLE_DEFINITIONS,
} from "@/server/catalog"
import { createSubmissionFingerprint } from "@/server/normalization/fingerprint"
import { normalizeCompanyName, normalizeRoleName } from "@/server/normalization/string-normalizer"
import { generateDemoCompensationRecords } from "@/server/demo-data"

const prisma = new PrismaClient()

async function seedCatalog(client: PrismaClient | Prisma.TransactionClient) {
  const careerLevels = new Map<string, { id: number }>()
  const roles = new Map<string, { id: number }>()
  const companies = new Map<string, { id: number }>()
  const locations = new Map<string, { id: number }>()
  const companyLevels = new Map<string, { id: number }>()

  for (const definition of CAREER_LEVEL_DEFINITIONS) {
    const careerLevel = await client.careerLevel.upsert({
      where: { code: definition.code },
      update: { name: definition.name, rank: definition.rank },
      create: definition,
      select: { id: true },
    })
    careerLevels.set(definition.code, careerLevel)
  }

  for (const definition of ROLE_DEFINITIONS) {
    const role = await client.role.upsert({
      where: { slug: definition.slug },
      update: { name: definition.name, category: definition.category },
      create: {
        name: definition.name,
        slug: definition.slug,
        category: definition.category,
      },
      select: { id: true },
    })
    roles.set(definition.slug, role)

    for (const alias of definition.aliases) {
      const normalizedAlias = normalizeRoleName(alias)
      await client.roleAlias.upsert({
        where: { normalizedAlias },
        update: { alias, roleId: role.id },
        create: { alias, normalizedAlias, roleId: role.id },
      })
    }
  }

  for (const definition of COMPANY_DEFINITIONS) {
    const company = await client.company.upsert({
      where: { slug: definition.slug },
      update: {
        name: definition.name,
        industry: definition.industry,
        website: definition.website,
      },
      create: {
        name: definition.name,
        slug: definition.slug,
        industry: definition.industry,
        website: definition.website,
      },
      select: { id: true },
    })
    companies.set(definition.slug, company)

    const aliases = [definition.name, ...definition.aliases]
    for (const alias of aliases) {
      const normalizedAlias = normalizeCompanyName(alias)
      await client.companyAlias.upsert({
        where: { normalizedAlias },
        update: { alias, companyId: company.id },
        create: { alias, normalizedAlias, companyId: company.id },
      })
    }

    for (const level of definition.levels) {
      const careerLevel = careerLevels.get(level.careerLevelCode)
      if (!careerLevel) {
        throw new Error(`Missing career level ${level.careerLevelCode}`)
      }

      const companyLevel = await client.companyLevel.upsert({
        where: {
          companyId_code: { companyId: company.id, code: level.code },
        },
        update: {
          careerLevelId: careerLevel.id,
          displayName: level.displayName,
          rank: level.rank,
          minYearsExperience: level.minYearsExperience,
          maxYearsExperience: level.maxYearsExperience,
        },
        create: {
          companyId: company.id,
          careerLevelId: careerLevel.id,
          code: level.code,
          displayName: level.displayName,
          rank: level.rank,
          minYearsExperience: level.minYearsExperience,
          maxYearsExperience: level.maxYearsExperience,
        },
        select: { id: true },
      })
      companyLevels.set(`${definition.slug}:${level.code}`, companyLevel)
    }
  }

  for (const definition of LOCATION_DEFINITIONS) {
    const location = await client.location.upsert({
      where: { slug: definition.slug },
      update: {
        city: definition.city,
        state: definition.state,
        country: definition.country,
      },
      create: definition,
      select: { id: true },
    })
    locations.set(definition.slug, location)
  }

  return { careerLevels, roles, companies, locations, companyLevels }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to seed PostgreSQL")
  }

  const catalogIds = await prisma.$transaction((transaction) => seedCatalog(transaction))
  const records = generateDemoCompensationRecords()
  const rows = records.map((record) => {
    const company = catalogIds.companies.get(record.company.slug)
    const role = catalogIds.roles.get(record.role.slug)
    const companyLevel = catalogIds.companyLevels.get(
      `${record.company.slug}:${record.companyLevel.code}`,
    )
    const location = catalogIds.locations.get(record.location.slug)

    if (!company || !role || !companyLevel || !location) {
      throw new Error(`Unable to resolve seeded record ${record.id}`)
    }

    return {
      companyId: company.id,
      roleId: role.id,
      companyLevelId: companyLevel.id,
      locationId: location.id,
      baseSalary: record.baseSalary,
      stockAnnual: record.stockAnnual,
      bonusAnnual: record.bonusAnnual,
      totalCompensation: record.totalCompensation,
      currency: record.currency,
      yearsExperience: record.yearsExperience,
      compensationYear: record.compensationYear,
      verified: false,
      source: "synthetic-demo",
      fingerprint: createSubmissionFingerprint({
        companyId: company.id,
        roleId: role.id,
        companyLevelId: companyLevel.id,
        locationId: location.id,
        compensationYear: record.compensationYear,
        baseSalary: record.baseSalary,
        stockAnnual: record.stockAnnual,
        bonusAnnual: record.bonusAnnual,
        yearsExperience: record.yearsExperience,
      }),
      createdAt: new Date(record.createdAt),
      updatedAt: new Date(record.createdAt),
    }
  })

  const batchSize = 500
  for (let index = 0; index < rows.length; index += batchSize) {
    await prisma.compensationSubmission.createMany({
      data: rows.slice(index, index + batchSize),
      skipDuplicates: true,
    })
  }

  console.log(`Seeded ${records.length} deterministic synthetic compensation records.`)
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
