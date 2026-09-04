import { Prisma } from "@prisma/client"

import { getPrismaClient } from "@/lib/db"
import { getCatalogOptionsFromRepository } from "@/server/repositories/catalog-repository"
import type { CatalogCompany, CatalogCompanyLevel, CatalogLocation, CatalogRole, SubmissionResult } from "@/server/domain"
import { createSubmissionFingerprint } from "@/server/normalization/fingerprint"
import { normalizeCompensationValues } from "@/server/normalization/compensation-normalizer"
import { normalizeCompanyName, normalizeRoleName } from "@/server/normalization/string-normalizer"
import { AppError, isUniqueConstraintError, validationError } from "@/server/errors"
import { MAX_COMPENSATION, type SubmissionInput } from "@/server/validation/schemas"

const demoFingerprints = new Set<string>()
let nextDemoSubmissionId = 2_000_000

function resolveCompany(input: string, companies: CatalogCompany[]) {
  const normalizedInput = normalizeCompanyName(input)
  return companies.find(
    (company) =>
      normalizeCompanyName(company.name) === normalizedInput ||
      company.aliases.some((alias) => normalizeCompanyName(alias) === normalizedInput),
  )
}

function resolveRole(input: string, roles: CatalogRole[]) {
  const normalizedInput = normalizeRoleName(input)
  return roles.find(
    (role) =>
      normalizeRoleName(role.name) === normalizedInput ||
      role.aliases.some((alias) => normalizeRoleName(alias) === normalizedInput),
  )
}

function resolveLocation(input: string, locations: CatalogLocation[]) {
  const normalizedInput = normalizeCompanyName(input)
  return locations.find(
    (location) =>
      location.slug === normalizedInput ||
      normalizeCompanyName(location.city) === normalizedInput,
  )
}

function resolveCompanyLevel(
  input: string,
  companyId: number,
  companyLevels: CatalogCompanyLevel[],
) {
  const normalizedInput = input.trim().toLocaleUpperCase("en-IN")
  return companyLevels.find(
    (level) => level.companyId === companyId && level.code.toUpperCase() === normalizedInput,
  )
}

function invalidReference(field: string, value: string) {
  return validationError(`Unknown ${field}: ${value}`, { field, value })
}

export async function createSubmission(input: SubmissionInput): Promise<SubmissionResult> {
  const currency = input.currency.toLocaleUpperCase("en-IN")
  if (currency !== "INR") {
    throw new AppError(
      "UNSUPPORTED_CURRENCY",
      "CompGrid currently accepts INR submissions only.",
      400,
      { supportedCurrencies: ["INR"] },
    )
  }

  const catalog = await getCatalogOptionsFromRepository()
  const company = resolveCompany(input.company, catalog.companies)
  const role = resolveRole(input.role, catalog.roles)
  const location = resolveLocation(input.location, catalog.locations)

  if (!company) throw invalidReference("company", input.company)
  if (!role) throw invalidReference("role", input.role)
  if (!location) throw invalidReference("location", input.location)

  const companyLevel = resolveCompanyLevel(
    input.companyLevel,
    company.id,
    catalog.companyLevels,
  )
  if (!companyLevel) throw invalidReference("company level", input.companyLevel)

  const careerLevel = catalog.careerLevels.find(
    (level) => level.id === companyLevel.careerLevelId,
  )
  if (!careerLevel) {
    throw new AppError("DATABASE_ERROR", "Company level mapping is incomplete.", 500)
  }

  const compensation = normalizeCompensationValues({
    baseSalary: input.baseSalary,
    stockAnnual: input.stockAnnual,
    bonusAnnual: input.bonusAnnual,
  })
  if (compensation.totalCompensation > MAX_COMPENSATION) {
    throw validationError("Total compensation exceeds the demo sanity limit", {
      maxTotalCompensation: MAX_COMPENSATION,
    })
  }

  const fingerprint = createSubmissionFingerprint({
    companyId: company.id,
    roleId: role.id,
    companyLevelId: companyLevel.id,
    locationId: location.id,
    compensationYear: input.compensationYear,
    baseSalary: compensation.baseSalary,
    stockAnnual: compensation.stockAnnual,
    bonusAnnual: compensation.bonusAnnual,
    yearsExperience: input.yearsExperience,
  })
  const prisma = getPrismaClient()

  if (!prisma) {
    if (demoFingerprints.has(fingerprint)) {
      throw new AppError(
        "DUPLICATE_SUBMISSION",
        "This compensation submission already exists.",
        409,
        { fingerprint },
      )
    }
    demoFingerprints.add(fingerprint)
    return {
      id: nextDemoSubmissionId++,
      fingerprint,
      company: { id: company.id, name: company.name, slug: company.slug },
      role: { id: role.id, name: role.name, slug: role.slug },
      companyLevel: {
        id: companyLevel.id,
        code: companyLevel.code,
        canonicalLevel: careerLevel.code,
        canonicalLevelName: careerLevel.name,
      },
      location: { id: location.id, city: location.city, slug: location.slug },
      ...compensation,
      currency,
      yearsExperience: input.yearsExperience,
      compensationYear: input.compensationYear,
      source: "public-submission",
    }
  }

  try {
    const saved = await prisma.$transaction(async (transaction) =>
      transaction.compensationSubmission.create({
        data: {
          companyId: company.id,
          roleId: role.id,
          companyLevelId: companyLevel.id,
          locationId: location.id,
          ...compensation,
          currency,
          yearsExperience: input.yearsExperience,
          compensationYear: input.compensationYear,
          verified: false,
          source: "public-submission",
          fingerprint,
        },
        select: { id: true },
      }),
    )

    return {
      id: saved.id,
      fingerprint,
      company: { id: company.id, name: company.name, slug: company.slug },
      role: { id: role.id, name: role.name, slug: role.slug },
      companyLevel: {
        id: companyLevel.id,
        code: companyLevel.code,
        canonicalLevel: careerLevel.code,
        canonicalLevelName: careerLevel.name,
      },
      location: { id: location.id, city: location.city, slug: location.slug },
      ...compensation,
      currency,
      yearsExperience: input.yearsExperience,
      compensationYear: input.compensationYear,
      source: "public-submission",
    }
  } catch (error: unknown) {
    if (isUniqueConstraintError(error)) {
      throw new AppError(
        "DUPLICATE_SUBMISSION",
        "This compensation submission already exists.",
        409,
        { fingerprint },
      )
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      throw new AppError(
        "DATABASE_ERROR",
        "The compensation submission could not be saved.",
        503,
        {},
      )
    }
    throw error
  }
}
